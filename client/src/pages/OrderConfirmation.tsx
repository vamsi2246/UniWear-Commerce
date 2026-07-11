import { useParams, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center space-y-6">
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-500/10 text-green-500 mb-2">
        <CheckCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Order Placed Successfully!</h1>
        <p className="text-muted-foreground text-sm">
          Thank you for your purchase. We are processing your order and will ship it shortly.
        </p>
      </div>

      {orderId && (
        <div className="bg-card border rounded-xl p-4 text-sm font-medium">
          <span className="text-muted-foreground">Order ID: </span>
          <span className="font-mono text-primary select-all">{orderId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button asChild size="lg" className="flex-1">
          <Link to={`/orders/${orderId}`}>
            Track Order
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="flex-1">
          <Link to="/products">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}
