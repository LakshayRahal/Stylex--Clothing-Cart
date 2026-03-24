import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import axios from "axios";

/* Layouts */
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";

/* Auth Pages */
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgot";

/* Admin Pages */
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";

/* Shop Pages */
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import SearchProducts from "./pages/shopping-view/search";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";

/* Other */
import UnauthPage from "./pages/unauth-page";
import NotFound from "./pages/not-found";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔥 Firebase Auth Listener */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const token = await firebaseUser.getIdToken();

      // 🔥 Sync Firebase user with backend (role, DB user)
      const res = await axios.post(
        "http://localhost:5000/api/auth/firebase-login",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/auth/login" />
          ) : user.role === "admin" ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <Navigate to="/shop/home" />
          )
        }
      />

      {/* AUTH ROUTES */}
      <Route
        path="/auth"
        element={
          !isAuthenticated ? <AuthLayout /> : <Navigate to="/" />
        }
      >
        <Route path="login" element={<AuthLogin />} />
        <Route path="register" element={<AuthRegister />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          isAuthenticated && user.role === "admin" ? (
            <AdminLayout />
          ) : (
            <Navigate to="/unauth-page" />
          )
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="features" element={<AdminFeatures />} />
      </Route>

      {/* SHOP ROUTES */}
      <Route
        path="/shop"
        element={
          isAuthenticated && user.role !== "admin" ? (
            <ShoppingLayout />
          ) : (
            <Navigate to="/unauth-page" />
          )
        }
      >
        <Route path="home" element={<ShoppingHome />} />
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="checkout" element={<ShoppingCheckout />} />
        <Route path="account" element={<ShoppingAccount />} />
        <Route path="paypal-return" element={<PaypalReturnPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="search" element={<SearchProducts />} />
      </Route>

      <Route path="/unauth-page" element={<UnauthPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
