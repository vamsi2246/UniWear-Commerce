import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, User, RefreshCw } from "lucide-react";
import { userService } from "@/services/user.service";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { toast } from "sonner";

export default function UsersManage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => userService.getAll(page, 15),
  });

  const users = data?.data || [];
  const meta = data?.meta;

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      userService.updateRole(id, role),
    onSuccess: () => {
      toast.success("User role updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update role");
    },
  });

  const handleRoleToggle = (id: string, currentRole: string) => {
    const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (confirm(`Change user's role to ${nextRole}?`)) {
      roleMutation.mutate({ id, role: nextRole });
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
        <p className="text-sm text-muted-foreground mt-1">View shopper accounts and toggle access privileges.</p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground text-xs font-semibold uppercase">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold">{user.name}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="py-3.5 px-4 font-mono">{user._count?.orders || 0}</td>
                  <td className="py-3.5 px-4">
                    {user.role === "ADMIN" ? (
                      <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                        <Shield className="h-3 w-3 mr-1" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <User className="h-3 w-3 mr-1" /> Shopper
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleRoleToggle(user.id, user.role)}>
                      Toggle Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && (
          <div className="p-4 border-t">
            <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
