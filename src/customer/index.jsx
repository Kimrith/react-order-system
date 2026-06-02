import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import CategoriesId from "./byId/categoriesId";
import Product from "./components/product";
import Header from "./components/header";
import CartOrder from "./components/cartorder";

export default function Index() {
  return (
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
    </Routes>
  );
}
