import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit2, Archive, Trash2, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { toast } from "sonner";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string; // Comma separated
  sizes: string; // Comma separated
  colors: string; // Comma separated
  stock: number;
  categoryId: string;
  isFeatured: boolean;
}

export default function ProductsManage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ProductFormData>({
    defaultValues: {
      isFeatured: false,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products", debouncedSearch, page],
    queryFn: () => productService.getAllAdmin({ search: debouncedSearch, page, limit: 10 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const products = data?.data || [];
  const meta = data?.meta;
  const categories = categoriesData?.data || [];

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setIsOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => productService.update(id, payload),
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setIsOpen(false);
      setEditProduct(null);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update product");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      toast.success("Product archived successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to archive product");
    },
  });

  const handleEditClick = (product: any) => {
    setEditProduct(product);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", Number(product.price));
    setValue("comparePrice", product.comparePrice ? Number(product.comparePrice) : null);
    setValue("images", product.images.join(", "));
    setValue("sizes", product.sizes.join(", "));
    setValue("colors", product.colors.join(", "));
    setValue("stock", product.stock);
    setValue("categoryId", product.categoryId);
    setValue("isFeatured", product.isFeatured);
    setIsOpen(true);
  };

  const handleCreateClick = () => {
    setEditProduct(null);
    reset({
      name: "",
      description: "",
      price: 0,
      comparePrice: null,
      images: "",
      sizes: "",
      colors: "",
      stock: 0,
      categoryId: "",
      isFeatured: false,
    });
    setIsOpen(true);
  };

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : null,
      images: data.images.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: data.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: data.colors.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(data.stock),
      categoryId: data.categoryId,
      isFeatured: data.isFeatured,
    };

    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Add, update, or archive store products.</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search catalog products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Product CRUD Table */}
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground text-xs font-semibold uppercase">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-12 object-cover rounded bg-muted shrink-0"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium max-w-[200px] truncate">{product.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{product.category.name}</td>
                  <td className="py-3 px-4 font-semibold">{formatPrice(Number(product.price))}</td>
                  <td className="py-3 px-4 font-mono">{product.stock}</td>
                  <td className="py-3 px-4">
                    {product.isFeatured ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {product.isArchived ? (
                      <Badge variant="destructive">Archived</Badge>
                    ) : (
                      <Badge className="bg-blue-500/10 text-blue-600">Active</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(product)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {!product.isArchived && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to archive this product?")) {
                              archiveMutation.mutate(product.id);
                            }
                          }}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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

      {/* Create / Edit Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-lg space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold">{editProduct ? "Edit Product" : "Add Product"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="prod-name">Product Name</Label>
                  <Input id="prod-name" required {...register("name")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prod-category">Category</Label>
                  <select
                    id="prod-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                    {...register("categoryId")}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="prod-desc">Description</Label>
                <Textarea id="prod-desc" required {...register("description")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="prod-price">Price (INR)</Label>
                  <Input id="prod-price" type="number" required {...register("price")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prod-comparePrice">Compare Price (INR)</Label>
                  <Input id="prod-comparePrice" type="number" {...register("comparePrice")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prod-stock">Stock Quantity</Label>
                  <Input id="prod-stock" type="number" required {...register("stock")} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="prod-images">Images URLs (comma separated)</Label>
                <Input id="prod-images" placeholder="https://url1.jpg, https://url2.jpg" required {...register("images")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="prod-sizes">Sizes (comma separated)</Label>
                  <Input id="prod-sizes" placeholder="S, M, L, XL" {...register("sizes")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prod-colors">Colors (comma separated)</Label>
                  <Input id="prod-colors" placeholder="Black, White, Blue" {...register("colors")} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="prod-featured"
                  className="rounded border-input text-primary focus:ring-ring h-4 w-4 cursor-pointer"
                  {...register("isFeatured")}
                />
                <Label htmlFor="prod-featured" className="cursor-pointer font-medium">Feature this product on the home page</Label>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">
                  {editProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
