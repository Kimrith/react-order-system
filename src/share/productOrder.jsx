import React from "react";
import { Plus, Minus } from "lucide-react";

// 1. Destructure onUpdateQty from props
export default function ProductOrder({ items = [], onUpdateQty }) {
  const handleDecreaseQty = (productId, currentQty) => {
    if (currentQty > 0) {
      onUpdateQty(productId, currentQty - 1);
    }
  };

  const handleIncreaseQty = (productId, currentQty) => {
    onUpdateQty(productId, currentQty + 1);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const price = Number(item.price || 0);
        const qty = Number(item.quantity || 0);

        return (
          <div
            key={item.productId}
            className="bg-[#2D3748] p-5 rounded-2xl flex items-center gap-5 shadow-lg border border-gray-800"
          >
            {/* IMAGE */}
            <img
              src={item.image || "/placeholder.png"}
              alt={item.productName}
              className="w-20 h-20 rounded-xl object-cover bg-[#1A202E]"
            />

            {/* INFO */}
            <div className="flex-1">
              <h3 className="font-bold text-lg text-white">
                {item.productName}
              </h3>
              <p className="text-sm text-gray-400">
                {item.description || "No description"}
              </p>
              <p className="text-[#FFBB33] font-extrabold text-xl mt-2">
                ${price.toFixed(2)}
              </p>
            </div>

            {/* QUANTITY CONTROLS */}
            <div className="flex items-center gap-3 bg-[#1A202E] p-2 rounded-full border border-gray-700">
              <button
                // 2. Use an arrow function to pass arguments
                onClick={() => handleDecreaseQty(item.productId, qty)}
                className="bg-[#2D3748] p-1.5 rounded-full text-gray-400 hover:text-white transition disabled:opacity-30"
                disabled={qty === 0}
              >
                <Minus size={16} />
              </button>

              <span className="font-bold text-lg w-6 text-center text-white">
                {qty}
              </span>

              <button
                // 2. Use an arrow function to pass arguments
                onClick={() => handleIncreaseQty(item.productId, qty)}
                className="bg-[#FFBB33] p-1.5 rounded-full text-[#1A202E] hover:bg-[#FFCC66] transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
