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
            {/* Primary & Hover Image */}
            <img
              src={product.images[0]}
              alt={product.name}
              className={cn(
                "h-full w-full object-cover transition-all duration-700 ease-in-out",
                product.images[1] ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
              )}
              loading="lazy"
            />
            {product.images[1] && (
              <img
                src={product.images[1]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                loading="lazy"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {discount > 0 && (
                <Badge className="bg-red-500 text-white text-[10px] py-0.5 px-1.5 font-bold uppercase tracking-wider">{discount}% OFF</Badge>
              )}
              {product.stock === 0 ? (
                <Badge variant="destructive" className="text-[10px] py-0.5 px-1.5 font-bold uppercase tracking-wider">Out of Stock</Badge>
              ) : product.stock < 15 ? (
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] py-0.5 px-1.5 font-bold uppercase tracking-wider">Low Stock ({product.stock})</Badge>
              ) : (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-0.5 px-1.5 font-bold uppercase tracking-wider">In Stock</Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-zinc-950 text-white text-[10px] py-0.5 px-1.5 font-bold uppercase tracking-wider">Best Seller</Badge>
              )}
              {product.isNewArrival && (
                <Badge className="bg-blue-600 text-white text-[10px] py-0.5 px-1.5 font-bold uppercase tracking-wider">New</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 z-10 border shadow-sm"
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
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <Button
                  onClick={handleAddToCart}
                  className="w-full rounded-none rounded-b-xl h-11 gap-2 bg-zinc-950 text-white hover:bg-zinc-800"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Quick Add
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{product.brand || "ShopMyUniform"}</span>
              {product.sku && <span className="font-mono text-[10px]">{product.sku}</span>}
            </div>
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors text-zinc-900">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <StarRating rating={product.avgRating || 4.5} size="sm" />
              <span className="text-xs text-muted-foreground">({product.reviewCount || 12})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 pt-1">
              <span className="font-bold text-sm text-zinc-950">{formatPrice(Number(product.price))}</span>
              {product.comparePrice && (
                <span className="text-xs text-muted-foreground line-through">
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
