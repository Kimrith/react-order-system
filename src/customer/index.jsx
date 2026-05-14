import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import CategoriesId from "./byId/categoriesId";
import Product from "./components/product";
import Header from "./components/header";
import CartOrder from "./components/cartorder";
import PaymentSuccess from "../share/paymentSuccess";

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<Product />} />
          <Route path="/categories/:id" element={<CategoriesId />} />
        </Route>
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartOrder />
            </ProtectedRoute>
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}
