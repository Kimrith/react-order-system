import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../auth/ProtectedRoute";
import CategoriesId from "../features/pages/CategoryDetailsPage";
import Product from "../features/pages/ProductsPage";
import Header from "../common/Header";
import CartOrder from "../features/pages/CartOrderPage";
import PaymentSuccess from "../features/pages/PaymentSuccessPage";

export default function Index() {
  return (
    <Routes>
      <Route path="TableQr/:tableId" element={<Header />}>
        <Route index element={<Product />} />
        <Route path="categories/:id" element={<CategoriesId />} />
      </Route>
      <Route
        path="TableQr/:tableId/cart"
        element={
          <ProtectedRoute>
            <CartOrder />
          </ProtectedRoute>
        }
      />


      {/* Top-level page completely separate from the menu/table framework */}
      <Route path="/TableQr/:tableId/payment-success" element={<PaymentSuccess />} />
    </Routes>
  );
}