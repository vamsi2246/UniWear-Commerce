import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ShoppingCart, Calendar, Tag, ChevronRight } from "lucide-react";
import { orderService } from "@/services/order.service";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";

export default function Orders() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getUserOrders(1, 20),
  });

  const orders = data?.data || [];

  if (isLoading) return <PageLoader />;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16 text-muted-foreground" />}
          title="No orders found"
          description="Looks like you haven't placed any orders yet."
          action={
            <Button asChild size="lg">
              <Link to="/products">Shop Our Collection</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            {/* Header info */}
            <div className="bg-muted/50 p-4 border-b flex flex-wrap justify-between items-center gap-4 text-sm">
              <div className="flex gap-x-6 gap-y-2 flex-wrap">
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">Order Placed</p>
                  <p className="font-medium mt-0.5 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">Total Amount</p>
                  <p className="font-semibold mt-0.5">{formatPrice(order.total)}</p>
                </div>
                {order.coupon && (
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Coupon Used</p>
                    <p className="font-medium mt-0.5 flex items-center gap-1 text-green-600">
                      <Tag className="h-3.5 w-3.5" />
                      {order.coupon.code}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/orders/${order.id}`} className="flex items-center">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Items preview list */}
            <div className="p-4 divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="w-12 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                      </p>
                    </div>
                    <p className="text-sm font-semibold mt-1">{formatPrice(Number(item.price))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
