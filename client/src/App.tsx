import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";

import { RootLayout } from "@/layouts/RootLayout";
import { ProtectedRoute } from "@/layouts/ProtectedRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PageLoader } from "@/components/shared/LoadingSpinner";

// Lazy Loaded Customer Pages
const Home = React.lazy(() => import("@/pages/Home"));
const Products = React.lazy(() => import("@/pages/Products"));
const ProductDetail = React.lazy(() => import("@/pages/ProductDetail"));
const Cart = React.lazy(() => import("@/pages/Cart"));
const Checkout = React.lazy(() => import("@/pages/Checkout"));
const OrderConfirmation = React.lazy(() => import("@/pages/OrderConfirmation"));
const Orders = React.lazy(() => import("@/pages/Orders"));
const OrderDetail = React.lazy(() => import("@/pages/OrderDetail"));
const Wishlist = React.lazy(() => import("@/pages/Wishlist"));
const Login = React.lazy(() => import("@/pages/Login"));
const Register = React.lazy(() => import("@/pages/Register"));

// Lazy Loaded Admin Pages
const AdminDashboard = React.lazy(() => import("@/pages/admin/Dashboard"));
const ProductsManage = React.lazy(() => import("@/pages/admin/ProductsManage"));
const CategoriesManage = React.lazy(() => import("@/pages/admin/CategoriesManage"));
const OrdersManage = React.lazy(() => import("@/pages/admin/OrdersManage"));
const UsersManage = React.lazy(() => import("@/pages/admin/UsersManage"));
const CouponsManage = React.lazy(() => import("@/pages/admin/CouponsManage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public & Customer Routes */}
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetail />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />

                  {/* Protected Customer Routes */}
                  <Route
                    path="cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="order-confirmation/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="orders/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Admin Protected Panel Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ProductsManage />} />
                  <Route path="categories" element={<CategoriesManage />} />
                  <Route path="orders" element={<OrdersManage />} />
                  <Route path="users" element={<UsersManage />} />
                  <Route path="coupons" element={<CouponsManage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
