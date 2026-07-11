import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Eye, RefreshCw } from "lucide-react";
import { orderService } from "@/services/order.service";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { toast } from "sonner";

export default function OrdersManage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", page],
    queryFn: () => orderService.getAllOrders(page, 10),
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateStatus(id, status),
    onSuccess: (updated) => {
      toast.success("Order status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      if (selectedOrder?.id === updated.data.id) {
        setSelectedOrder(updated.data);
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update order status");
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-sm text-muted-foreground mt-1">View all customer orders and update status tracking.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Orders list */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs font-semibold uppercase">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                        selectedOrder?.id === order.id ? "bg-muted/50" : ""
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-4 font-mono text-xs">{order.id.slice(-8)}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium">{order.user?.name}</div>
                        <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                      <td className="py-3.5 px-4 font-semibold">{formatPrice(order.total)}</td>
                      <td className="py-3.5 px-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
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

        {/* Detailed panel view */}
        <div className="space-y-6">
          {selectedOrder ? (
            <div className="bg-card border rounded-xl p-6 space-y-6 shadow-sm">
              <div className="border-b pb-4">
                <h3 className="font-bold text-lg">Order Details</h3>
                <p className="text-xs font-mono text-muted-foreground mt-1">ID: {selectedOrder.id}</p>
              </div>

              {/* Status Update controls */}
              <div className="space-y-2">
                <Label>Update Status Tracking</Label>
                <div className="flex gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={updateStatusMutation.isPending}
                  >
                    <option value="PLACED">Placed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Shipping info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">Shipping Address</h4>
                <div className="text-sm bg-muted/40 p-3 rounded-lg space-y-1">
                  <p className="font-semibold">{selectedOrder.shipping.name}</p>
                  <p>{selectedOrder.shipping.address}</p>
                  <p>
                    {selectedOrder.shipping.city}, {selectedOrder.shipping.state} - {selectedOrder.shipping.zip}
                  </p>
                  <p className="text-xs text-muted-foreground pt-1.5 font-medium">Phone: {selectedOrder.shipping.phone}</p>
                </div>
              </div>

              {/* Order items summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">Order Items</h4>
                <div className="divide-y max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between py-2 text-sm">
                      <div>
                        <p className="font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        </p>
                      </div>
                      <span className="font-semibold shrink-0">{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {Number(selectedOrder.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground shadow-sm">
              Select an order to view full customer details and update delivery tracking status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
