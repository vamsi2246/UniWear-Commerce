import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Package, Star, Calendar, MessageSquare } from "lucide-react";
import { orderService } from "@/services/order.service";
import { reviewService } from "@/services/review.service";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/shared/StarRating";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  const [ratingProduct, setRatingProduct] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: !!orderId,
  });

  const order = data?.data;

  const reviewMutation = useMutation({
    mutationFn: ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) =>
      reviewService.create(productId, { rating, comment }),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setRatingProduct(null);
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });

  if (isLoading) return <PageLoader />;
  if (!order) return <div className="container mx-auto px-4 py-16 text-center">Order not found</div>;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingProduct) return;
    reviewMutation.mutate({ productId: ratingProduct, rating, comment });
  };

  const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent mb-2">
          <Link to="/orders" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to My Orders
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-sm text-muted-foreground mt-1">ID: <span className="font-mono">{order.id}</span></p>
          </div>
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>
      </div>

      {/* Order status tracking timeline */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          Order Tracking
        </h2>
        {order.status === "CANCELLED" ? (
          <div className="p-4 bg-red-500/10 text-red-600 rounded-lg text-sm font-medium">
            This order was cancelled.
          </div>
        ) : (
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 md:px-8">
            {/* Horizontal line for desktop */}
            <div className="absolute top-[18px] left-[40px] right-[40px] h-[3px] bg-border hidden md:block z-0" />
            <div
              className="absolute top-[18px] left-[40px] h-[3px] bg-primary hidden md:block z-0 transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 90}%`,
              }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-auto relative">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2 ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground scale-110 shadow-sm"
                        : "bg-background border-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="text-left md:text-center">
                    <p className={`text-sm font-semibold tracking-tight ${isCurrent ? "text-primary" : "text-foreground"}`}>
                      {step}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isCurrent ? "Current Status" : isCompleted ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-semibold border-b pb-3 mb-4">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-semibold">{formatPrice(Number(item.price))}</p>
                      {order.status === "DELIVERED" && (
                        <Button variant="ghost" size="sm" onClick={() => setRatingProduct(item.productId)} className="text-primary text-xs h-7 px-2">
                          <MessageSquare className="h-3 w-3 mr-1" /> Write Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline review form */}
          {ratingProduct && (
            <form onSubmit={handleReviewSubmit} className="bg-card border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-base">Write a Review</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <StarRating rating={rating} interactive size="md" onRate={setRating} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment</label>
                <Textarea
                  placeholder="Share your thoughts about this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={reviewMutation.isPending}>
                  Submit Review
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setRatingProduct(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Shipping details & Totals */}
        <div className="space-y-6">
          {/* Shipping details */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              Delivery Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{order.shipping.name}</p>
              <p className="text-muted-foreground">{order.shipping.address}</p>
              <p className="text-muted-foreground">
                {order.shipping.city}, {order.shipping.state} - {order.shipping.zip}
              </p>
              <p className="text-muted-foreground font-medium pt-2">Phone: {order.shipping.phone}</p>
            </div>
          </div>

          {/* Pricing totals */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Price Details</h2>
            <div className="text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
