import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";

export default function Cart() {
  const { items, subtotal, isLoading, updateItem, removeItem, clearCart } = useCart();

  if (isLoading) return <PageLoader />;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="h-16 w-16 text-muted-foreground" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          action={
            <Button asChild size="lg">
              <Link to="/products">Start Shopping</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="font-medium text-muted-foreground">Product Details</span>
            <Button variant="ghost" size="sm" onClick={() => clearCart()} className="text-destructive hover:bg-destructive/10">
              Clear Cart
            </Button>
          </div>

          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <Link to={`/products/${item.product.slug}`} className="w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${item.product.slug}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                      {item.product.name}
                    </Link>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={item.quantity <= 1}
                        onClick={() => updateItem({ id: item.id, quantity: item.quantity - 1 })}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateItem({ id: item.id, quantity: item.quantity + 1 })}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sm">
                        {formatPrice(Number(item.product.price) * item.quantity)}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border rounded-xl p-6 h-fit space-y-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="space-y-4 text-sm divide-y">
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between pt-4">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="flex justify-between pt-4 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Button asChild className="w-full" size="lg">
            <Link to="/checkout">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Shipping, taxes, and discounts calculated at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
