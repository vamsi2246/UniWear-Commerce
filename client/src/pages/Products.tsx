import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X, RotateCcw, Package } from "lucide-react";
import { productService, type ProductFilters } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "24", "26", "28", "30", "32", "34", "36", "38"];
const AVAILABLE_COLORS = ["White", "Black", "Blue", "Grey", "Olive", "Sage", "Tan", "Khaki", "Rust", "Camel", "Cream", "Burgundy", "Emerald"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sizesQuery = searchParams.get("sizes") || "";
  const colorsQuery = searchParams.get("colors") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync search input with search param changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const selectedSizes = sizesQuery ? sizesQuery.split(",") : [];
  const selectedColors = colorsQuery ? colorsQuery.split(",") : [];

  const filters: ProductFilters = {
    page,
    limit: 12,
    category: category || undefined,
    search: debouncedSearch || undefined,
    sort: sort || undefined,
    featured: searchParams.get("featured") === "true" || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sizes: sizesQuery || undefined,
    colors: colorsQuery || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getAll(filters),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const products = data?.data || [];
  const meta = data?.meta;
  const categories = categoriesData?.data || [];

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset page on filter change
    setSearchParams(params);
  };

  const toggleFilterItem = (key: "sizes" | "colors", item: string) => {
    const currentList = key === "sizes" ? selectedSizes : selectedColors;
    const newList = currentList.includes(item)
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];
    updateParams(key, newList.join(","));
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  const activeFiltersCount = [category, search, sort, minPrice, maxPrice, sizesQuery, colorsQuery].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {category ? categories.find((c) => c.slug === category)?.name || "Products" : "All Products"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {meta ? `${meta.total} products found` : "Browse our collection"}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" className="gap-2 text-destructive hover:bg-destructive/10" onClick={clearFilters}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid with Sidebar Filter Panel */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Collapsible Sidebar Filter Panel */}
        {showFilters && (
          <aside className="w-full lg:w-64 space-y-6 shrink-0 bg-card border p-5 rounded-xl h-fit">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-semibold text-base">Filter Parameters</h3>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Price Range (INR)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParams("minPrice", e.target.value)}
                  className="h-9 text-xs"
                />
                <span className="text-muted-foreground text-xs">—</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParams("maxPrice", e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Sizes</Label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_SIZES.map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleFilterItem("sizes", size)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                        active
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input bg-background hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Colors</Label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_COLORS.map((color) => {
                  const active = selectedColors.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => toggleFilterItem("colors", color)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                        active
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input bg-background hover:border-foreground"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Products Display Container */}
        <div className="flex-1 space-y-6">
          {/* Sub Search Bar + Category + Sort shortcuts */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  updateParams("search", e.target.value);
                }}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Select value={category} onValueChange={(v) => updateParams("category", v === "all" ? "" : v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(v) => updateParams("sort", v === "default" ? "" : v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="name_asc">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {category && (
                <Badge variant="secondary" className="gap-1">
                  Cat: {categories.find((c) => c.slug === category)?.name}
                  <button onClick={() => updateParams("category", "")} className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {search}
                  <button onClick={() => { updateParams("search", ""); setSearchInput(""); }} className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                </Badge>
              )}
              {(minPrice || maxPrice) && (
                <Badge variant="secondary" className="gap-1">
                  Price: {minPrice ? `₹${minPrice}` : "0"} - {maxPrice ? `₹${maxPrice}` : "∞"}
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete("minPrice");
                      params.delete("maxPrice");
                      setSearchParams(params);
                    }}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedSizes.map((size) => (
                <Badge key={size} variant="secondary" className="gap-1">
                  Size: {size}
                  <button onClick={() => toggleFilterItem("sizes", size)} className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                </Badge>
              ))}
              {selectedColors.map((color) => (
                <Badge key={color} variant="secondary" className="gap-1">
                  Color: {color}
                  <button onClick={() => toggleFilterItem("colors", color)} className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                </Badge>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Package className="h-12 w-12 text-muted-foreground" />}
              title="No products match filters"
              description="Try adjusting your filters, price limits, sizes, or search terms to browse other styles."
              action={
                <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {meta && (
                <Pagination
                  page={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={(p) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", String(p));
                    setSearchParams(params);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
