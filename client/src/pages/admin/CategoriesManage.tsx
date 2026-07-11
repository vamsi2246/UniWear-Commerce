import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { categoryService } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
  description: string;
  image: string;
}

export default function CategoriesManage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<CategoryFormData>();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => categoryService.getAll(),
  });

  const categories = data?.data || [];

  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setIsOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => categoryService.update(id, payload),
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setIsOpen(false);
      setEditCategory(null);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete category");
    },
  });

  const handleEditClick = (cat: any) => {
    setEditCategory(cat);
    setValue("name", cat.name);
    setValue("description", cat.description || "");
    setValue("image", cat.image || "");
    setIsOpen(true);
  };

  const handleCreateClick = () => {
    setEditCategory(null);
    reset({ name: "", description: "", image: "" });
    setIsOpen(true);
  };

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      image: data.image || null,
    };

    if (editCategory) {
      updateMutation.mutate({ id: editCategory.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage catalog categories.</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b text-muted-foreground text-xs font-semibold uppercase">
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Products</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <img
                    src={cat.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100"}
                    alt={cat.name}
                    className="w-10 h-10 object-cover rounded bg-muted shrink-0"
                  />
                </td>
                <td className="py-3 px-4 font-semibold">{cat.name}</td>
                <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">{cat.description}</td>
                <td className="py-3 px-4 font-medium">{cat._count?.products || 0}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(cat)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                          deleteMutation.mutate(cat.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl w-full max-w-md p-6 shadow-lg space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold">{editCategory ? "Edit Category" : "Add Category"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="cat-name">Category Name</Label>
                <Input id="cat-name" required {...register("name")} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cat-desc">Description</Label>
                <Textarea id="cat-desc" {...register("description")} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cat-image">Image URL</Label>
                <Input id="cat-image" placeholder="https://unsplash.com/example.jpg" {...register("image")} />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">
                  {editCategory ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
