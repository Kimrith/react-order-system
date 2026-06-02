import React, { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom"; // Added useParams
import Toast from "../features/components/ToastPayment";

export default function HeaderOrder({ cartItems = [], setCartItems }) {
  const [showToast, setShowToast] = useState(false);
  const { tableId } = useParams(); // Extract tableId from URL path parameters

  const handleClear = () => {
    new Audio('/public/sound/remove.mp3').play().catch(() => { });
    localStorage.removeItem("my_order");

    if (setCartItems) {
      setCartItems([]);
    }
    setShowToast(true);
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-10 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          {/* FIXED: Target the specific menu session of the customer's table */}
          <Link to={`/TableQr/${tableId}`}>
            <button className="bg-[#2D3748] p-3 rounded-full hover:bg-gray-700 transition">
              <ArrowLeft size={20} className="text-gray-300" />
            </button>
          </Link>

          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Your Order
            </h1>
            <p className="text-gray-400 mt-1">
              {/* FIXED: Output the dynamic table number variable */}
              Table <span className="text-[#FFBB33] font-bold">{tableId || "Unknown"}</span> •{" "}
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

      <Toast
        message="Cart cleared successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}