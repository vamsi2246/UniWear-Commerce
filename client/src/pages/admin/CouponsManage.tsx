import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { couponService } from "@/services/coupon.service";
import { formatDate, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

interface CouponFormData {
  code: string;
  discountPct: number;
  minOrder: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  expiresAt: string;
}

export default function CouponsManage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<CouponFormData>();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => couponService.getAll(),
  });

  const coupons = data?.data || [];

  const createMutation = useMutation({
    mutationFn: couponService.create,
    onSuccess: () => {
      toast.success("Coupon created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      setIsOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create coupon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: couponService.delete,
    onSuccess: () => {
      toast.success("Coupon deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete coupon");
    },
  });

  const onSubmit = (data: CouponFormData) => {
    const payload = {
      code: data.code.toUpperCase(),
      discountPct: Number(data.discountPct),
      minOrder: Number(data.minOrder),
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      expiresAt: new Date(data.expiresAt).toISOString(),
    };
    createMutation.mutate(payload);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage e-commerce shopping discount coupons.</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Coupon
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b text-muted-foreground text-xs font-semibold uppercase">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Min Order</th>
              <th className="py-3 px-4">Expires At</th>
              <th className="py-3 px-4">Usage Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold">{coupon.code}</td>
                <td className="py-3.5 px-4 font-semibold text-green-600">{coupon.discountPct}% OFF</td>
                <td className="py-3.5 px-4">{formatPrice(Number(coupon.minOrder))}</td>
                <td className="py-3.5 px-4 text-muted-foreground">{formatDate(coupon.expiresAt)}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">
                      {coupon.usedCount} / {coupon.usageLimit || "∞"}
                    </span>
                    <span className="text-muted-foreground">used</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      if (confirm(`Delete coupon "${coupon.code}"?`)) {
                        deleteMutation.mutate(coupon.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl w-full max-w-md p-6 shadow-lg space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold">Add Coupon</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="coup-code">Coupon Code</Label>
                <Input id="coup-code" placeholder="WINTER20" required {...register("code")} className="uppercase" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="coup-pct">Discount (%)</Label>
                  <Input id="coup-pct" type="number" required {...register("discountPct")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="coup-min">Min Order (INR)</Label>
                  <Input id="coup-min" type="number" required {...register("minOrder")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="coup-max">Max Discount (INR)</Label>
                  <Input id="coup-max" type="number" {...register("maxDiscount")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="coup-limit">Usage Limit</Label>
                  <Input id="coup-limit" type="number" placeholder="∞" {...register("usageLimit")} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="coup-expiry">Expires At</Label>
                <Input id="coup-expiry" type="date" required {...register("expiresAt")} />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">Create Coupon</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
