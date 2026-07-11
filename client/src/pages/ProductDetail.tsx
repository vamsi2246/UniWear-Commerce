import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Heart, Minus, Plus, ArrowLeft, Package, Sparkles, ShieldCheck, Ruler, ClipboardList, Info } from "lucide-react";
import { motion } from "framer-motion";
import { productService } from "@/services/product.service";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/StarRating";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { ProductCard } from "@/components/products/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const { addItem, isAdding } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getBySlug(slug!),
    enabled: !!slug,
  });

  const product = data?.data;

  // Dynamic related products query
  const { data: relatedData } = useQuery({
    queryKey: ["products", "related", product?.categoryId],
    queryFn: () => productService.getAll({ category: product?.category.slug }),
    enabled: !!product?.categoryId,
  });

  const relatedProducts = (relatedData?.data as Product[]) || [];

  if (isLoading) return <PageLoader />;
  if (!product) return <div className="container mx-auto px-4 py-16 text-center text-lg">Product not found</div>;

  const discount = product.comparePrice
    ? getDiscountPercentage(Number(product.price), Number(product.comparePrice))
    : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addItem({
      productId: product.id,
      quantity,
      size: selectedSize || product.sizes[0] || null,
      color: selectedColor || product.colors[0] || null,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Products
        </Link>
        <span>/</span>
        <Link to={`/products?category=${product.category.slug}`} className="hover:text-foreground transition-colors">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery with Zoom Effect */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="space-y-4">
            <div
              className="aspect-square overflow-hidden rounded-xl bg-card border relative cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-300",
                  isZoomed ? "scale-125" : "scale-100"
                )}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "h-20 w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all",
                      selectedImage === idx ? "border-zinc-950" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Details & Specs */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              <span>{product.brand || "ShopMyUniform"}</span>
              {product.sku && <span className="font-mono text-zinc-500">SKU: {product.sku}</span>}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-950">{product.name}</h1>

            <div className="flex items-center gap-2 pt-1">
              <StarRating rating={product.avgRating || 4.5} size="md" />
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount || 12} customer reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 border-y py-4">
            <span className="text-3xl font-bold text-zinc-950">{formatPrice(Number(product.price))}</span>
            {product.comparePrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(Number(product.comparePrice))}
                </span>
                <Badge className="bg-red-500 text-white font-bold uppercase tracking-wider text-[10px]">{discount}% OFF</Badge>
              </>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Fabric Details */}
            {product.fabricDetails && (
              <div className="flex items-center gap-2 p-3 bg-zinc-50 border rounded-lg text-sm text-zinc-700">
                <Info className="h-4.5 w-4.5 text-zinc-500 shrink-0" />
                <span><strong>Fabric Ratio:</strong> {product.fabricDetails}</span>
              </div>
            )}
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-zinc-900">Select Size</label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-zinc-900 inline-flex items-center gap-1 font-semibold"
                  onClick={() => toast.info("Unisex Standard Sizing. Choose normal size.")}
                >
                  <Ruler className="h-3.5 w-3.5" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-10 min-w-[44px] px-3 rounded-lg border text-sm font-semibold transition-all",
                      selectedSize === size
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-input bg-card hover:border-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-900">
                Select Color{selectedColor && `: ${selectedColor}`}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-10 px-4 rounded-lg border text-sm font-semibold transition-all",
                      selectedColor === color
                        ? "border-zinc-950 bg-zinc-100 text-zinc-950"
                        : "border-input bg-card hover:border-foreground"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-900">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold text-sm">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              size="xl"
              className="flex-1 bg-zinc-950 text-white hover:bg-zinc-800"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              size="xl"
              variant="outline"
              onClick={() => {
                if (!isAuthenticated) { toast.error("Please login to manage wishlist"); return; }
                toggleWishlist(product.id);
              }}
            >
              <Heart className={cn("h-5 w-5", isAuthenticated && isInWishlist(product.id) && "fill-red-500 text-red-500")} />
            </Button>
          </div>

          {/* Low stock warning */}
          {product.stock > 0 && product.stock <= 15 && (
            <p className="text-xs text-orange-600 flex items-center gap-1 font-semibold">
              <Package className="h-4 w-4 animate-pulse" /> Running Low! Only {product.stock} uniforms left in stock.
            </p>
          )}

          {/* Service/Shipping Accordion details */}
          <div className="border-t pt-6 space-y-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-zinc-500" />
              <span><strong>Logo Customization:</strong> Logo embroidery available on checkout.</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5 text-zinc-500" />
              <span><strong>B2B Fit Guarantee:</strong> Exchanges accepted on non-custom orders.</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products Panel */}
      {relatedProducts.length > 1 && (
        <section className="space-y-6 border-t pt-10">
          <h2 className="text-2xl font-bold tracking-tight">Related Uniforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts
              .filter((p: Product) => p.id !== product.id)
              .slice(0, 4)
              .map((prod: Product) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
