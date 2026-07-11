import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Ticket, CheckCircle2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { orderService } from "@/services/order.service";
import { couponService } from "@/services/coupon.service";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const shippingSchema = z.object({
  name: z.string().min(2, "Name is required (min 2 chars)"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(4, "ZIP code must be at least 4 digits"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

type ShippingForm = z.infer<typeof shippingSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, itemCount, clearCart } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discountPct: number } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
        <Button asChild><Link to="/products">Browse products</Link></Button>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const response = await couponService.validate(couponCode.toUpperCase(), subtotal);
      setActiveCoupon(response.data.coupon);
      setDiscountAmount(response.data.discount);
      toast.success("Coupon applied successfully!");
    } catch (error: any) {
      toast.error(error.message || "Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
  };

  const finalTotal = subtotal - discountAmount;

  const onSubmit = async (data: ShippingForm) => {
    setIsSubmitting(true);
    try {
      const response = await orderService.create({
        shipping: data,
        couponCode: activeCoupon?.code,
      });
      toast.success("Order placed successfully!");
      // Force cache invalidation & cart state sync (clearCart local storage is handled by DB triggers/response in hook)
      navigate(`/order-confirmation/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
          <Link to="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mt-2">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6 bg-card border rounded-xl p-6">
          <h2 className="text-xl font-semibold border-b pb-3">Shipping Details</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Recipient Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address Line</Label>
              <Input id="address" placeholder="123 Street Name, Apartment, Suite" {...register("address")} />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Mumbai" {...register("city")} />
                {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="Maharashtra" {...register("state")} />
                {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input id="zip" placeholder="400001" {...register("zip")} />
                {errors.zip && <p className="text-xs text-destructive">{errors.zip.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (10 digits)</Label>
              <Input id="phone" type="tel" placeholder="9876543210" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="border-t pt-6">
            <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing simulated payment..." : `Place Order • ${formatPrice(finalTotal)}`}
            </Button>
          </div>
        </form>

        {/* Order Items & Coupon summary */}
        <div className="space-y-6">
          {/* Cart items preview */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Order Items ({itemCount})</h3>
            <div className="divide-y max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 text-sm">
                  <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground w-6 text-center">{item.quantity}x</span>
                    <span className="line-clamp-1">{item.product.name}</span>
                  </div>
                  <span className="font-medium shrink-0">{formatPrice(Number(item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo code */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Promo Code</h3>
            {activeCoupon ? (
              <div className="flex items-center justify-between p-3 bg-green-500/10 text-green-600 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Code <strong>{activeCoupon.code}</strong> applied ({activeCoupon.discountPct}% off)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-600 p-0 h-auto">Remove</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="pl-9 uppercase"
                  />
                </div>
                <Button variant="secondary" onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
                  Apply
                </Button>
              </div>
            )}
          </div>

          {/* Pricing totals */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Checkout Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
