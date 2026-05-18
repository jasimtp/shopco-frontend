import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import HomePage from "./Home/HomePage";
import Footer from "./footer/Footer";
import ProductDetails from "./products/ProductDetails";
import CategoryPage from "./catogory/CategoryPage";
import CartPage from "./cart/CartPage";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import AdminDashboard from "./auth/admin/AdminDashboard";
import AdminRoute from "./routes/AdminRoute";
import CreateProduct from "./auth/admin/CreateProduct";
import AdminProducts from "./auth/admin/AdminProducts";
import CheckoutPage from "./checkout/CheckoutPage";
import ProfilePage from "./profile/ProfilePage";
import OrdersPage from "./orders/OrdersPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import UpiPaymentPage from "./upi/UpiPaymentPage";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import ResetPasswordPage from "./auth/ResetPasswordPage";
import SettingsPage from "./settings/SettingsPage";
import AboutPage from "./about/AboutPage";
import HelpContactPage from "./help/HelpContactPage";
import { useEffect } from "react";
function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/admin");

useEffect(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}, []);


  return (
    <>
      {!hideLayout && <Navbar />}
      <div className={!hideLayout ? "appPageContent" : ""}>

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />

<Route path="/settings" element={<SettingsPage />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/help-contact" element={<HelpContactPage />} />

<Route element={<ProtectedRoute />}>
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/orders" element={<OrdersPage />} />
  <Route path="/upi-payment" element={<UpiPaymentPage />} />
</Route>

        <Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route
  path="/admin/products"
  element={
    <AdminRoute>
      <AdminProducts />
    </AdminRoute>
  }
/>

<Route
  path="/admin/create-product"
  element={
    <AdminRoute>
      <CreateProduct />
    </AdminRoute>
  }
/>

<Route
  path="/admin/edit-product/:id"
  element={
    <AdminRoute>
      <CreateProduct />
    </AdminRoute>
  }
/>
      </Routes>
</div>
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;