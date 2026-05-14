import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Optional: for nice icons

export default function OrderSummary({
  cartItems = [],
  subtotal = 0,
  total = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSummary = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      {/* --- MOBILE TOGGLE BUTTON --- */}
      {/* Only visible on small screens (hidden md:hidden) */}
      <div className="md:hidden mb-4">
        <button
          onClick={toggleSummary}
          className="w-full bg-[#2D3748] border border-gray-700 p-4 rounded-2xl flex justify-between items-center text-white active:bg-gray-700 transition-colors"
        >
          <span className="font-bold">View Order Details</span>
          <div className="flex items-center gap-2">
            <span className="text-[#FFBB33] font-bold">
              ${total.toFixed(2)}
            </span>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
      </div>
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } md:block bg-[#2D3748] p-6 md:p-8 rounded-3xl h-fit shadow-2xl border border-gray-800 space-y-6 transition-all duration-300`}
      >
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Payment Summary
        </h2>

        <div className="space-y-4 text-gray-300">
          <div className="flex justify-between items-center text-sm md:text-base">
            <span>Subtotal ({cartItems.length} items)</span>
            <span className="text-white font-medium">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm md:text-base">
            <span>Estimated Tax </span>
            <span className="text-[#A0AEC0] font-medium italic">Free</span>
          </div>

          <div className="flex justify-between items-center text-sm md:text-base">
            <span>Service Fee</span>
            <span className="text-[#A0AEC0] font-medium italic">Free</span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-sm md:text-lg text-gray-400">Total</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              USD Currency
            </span>
          </div>
          <span className="text-3xl md:text-4xl font-extrabold text-[#FFBB33] tracking-tight">
            ${total.toFixed(2)}
          </span>
        </div>
      </aside>
    </div>
  );
}
