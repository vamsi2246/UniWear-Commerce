import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/StarRating";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const discount = product.comparePrice
    ? getDiscountPercentage(Number(product.price), Number(product.comparePrice))
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addItem({
      productId: product.id,
      quantity: 1,
      size: product.sizes[0] || null,
      color: product.colors[0] || null,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">{discount}% OFF</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" className="text-xs">Out of Stock</Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">Featured</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isAuthenticated && isInWishlist(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600"
                )}
              />
            </button>

            {/* Quick Add */}
            {product.stock > 0 && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <Button
                  onClick={handleAddToCart}
                  className="w-full rounded-none rounded-b-xl h-11 gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground">{product.category.name}</p>
            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {(product.avgRating ?? 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.avgRating || 0} size="sm" />
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">{formatPrice(Number(product.price))}</span>
              {product.comparePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(Number(product.comparePrice))}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
