import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, Package, Users, Activity } from "lucide-react";
import { userService } from "@/services/user.service";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { PageLoader } from "@/components/shared/LoadingSpinner";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => userService.getDashboardStats(),
  });

  const stats = data?.data;

  if (isLoading) return <PageLoader />;
  if (!stats) return <div className="text-center py-8">Failed to load analytics dashboard stats.</div>;

  const cards = [
    { label: "Total Revenue", value: formatPrice(Number(stats.totalRevenue)), icon: DollarSign, color: "text-green-600 bg-green-50 dark:bg-green-950/20" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20" },
    { label: "Products in Catalog", value: stats.totalProducts, icon: Package, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20" },
    { label: "Registered Users", value: stats.totalUsers, icon: Users, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time store stats and analytics.</p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border rounded-xl p-6 flex justify-between items-center shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders table */}
        <div className="bg-card border rounded-xl p-6 lg:col-span-2 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b text-muted-foreground text-xs font-semibold uppercase">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs">{order.id.slice(-8)}</td>
                    <td className="py-3.5 px-4 font-medium">{order.user?.name}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{order._count?.items || 0}</td>
                    <td className="py-3.5 px-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3.5 px-4">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders by Status breakdown card */}
        <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg">Orders By Status</h3>
          <div className="space-y-4 pt-2">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center text-sm">
                <span className="font-medium text-muted-foreground">{status}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{count}</span>
                  <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${(count / stats.totalOrders) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
