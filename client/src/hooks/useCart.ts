import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useCart() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
  });

  const addItemMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      toast.success("Added to cart");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add item");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartService.updateItem(id, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update item");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      toast.success("Item removed from cart");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove item");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },
  });

  const cart = cartQuery.data?.data;
  const items = cart?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return {
    cart,
    items,
    itemCount,
    subtotal,
    isLoading: cartQuery.isLoading,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAdding: addItemMutation.isPending,
  };
}
