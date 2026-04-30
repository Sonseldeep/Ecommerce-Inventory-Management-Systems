



import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProductsPage from "./pages/user/ProductsPage";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import OrdersPage from "./pages/user/OrdersPage";
import AddressesPage from "./pages/user/AddressesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import VerifyEmailOtpPage from "./pages/auth/VerifyEmailOtpPage";
import ForgotPasswordPage from "./pages/auth/ForgetPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ChangePasswordPage from "./pages/user/ChnagePasswordPage";
import UserProfilePage from "./pages/user/UserProfilePage";

export default function App() {
  return (

    <BrowserRouter>
      {/* ✅ AuthProvider is now INSIDE BrowserRouter so useNavigate works */}
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />

          <Routes>
            {/* 🔓 Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/verify-email" element={<VerifyEmailOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* 🔐 Protected Layout */}
            <Route element={<MainLayout />}>

              {/* 👤 Customer + Admin */}
              <Route element={<ProtectedRoute roles={["Customer", "Admin"]} />}>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/addresses" element={<AddressesPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
              </Route>

              {/* 👑 Admin only */}
              <Route element={<ProtectedRoute roles={["Admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
              </Route>
            </Route>

            {/* 🔁 Redirects */}
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}