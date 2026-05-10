import React, { use, useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react"; // Optional: npm i lucide-react
import { Link } from "react-router-dom";

// Change the function definition to accept props
export default function HeaderOrder({ cartItems = [] }) {
  const handleClear = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to clear the cart?",
    );

    if (!isConfirmed) return;

    localStorage.removeItem("my_order");

    alert("Cart cleared!");

    window.location.reload();
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-10 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button className="bg-[#2D3748] p-3 rounded-full hover:bg-gray-700 transition">
            <Link to="/">
              <ArrowLeft size={20} className="text-gray-300" />
            </Link>
          </button>

          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Your Order
            </h1>
            <p className="text-gray-400 mt-1">
              Table <span className="text-[#FFBB33] font-bold">A1</span> •{" "}
              {/* Added a fallback check for safety */}
              {cartItems?.length || 0} items
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm font-medium transition"
        >
          <Trash2 size={16} />
          Clear
        </button>
      </header>
    </div>
  );
}
