import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const savedCart = localStorage.getItem("my_order");

  if (!savedCart) {
    return <Navigate to="/" replace />;
  }

  let items = [];

  try {
    const parsed = JSON.parse(savedCart);
    items = Object.values(parsed || {});
  } catch (err) {
    console.error("Cart JSON error:", err);
    localStorage.removeItem("my_order");
    return <Navigate to="/" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  return children;
}
