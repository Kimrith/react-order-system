import React from "react";

// Add the props here in the parentheses
export default function OrderSummary({
  cartItems = [],
  subtotal = 0,
  total = 0,
}) {
  return (
    <div>
      <aside className="bg-[#2D3748] p-8 rounded-3xl h-fit shadow-2xl border border-gray-800 space-y-6">
        <h2 className="text-2xl font-bold">Payment Summary</h2>

        <div className="space-y-4 text-gray-300">
          <div className="flex justify-between items-center">
            {/* Now cartItems is defined from props */}
            <span>Subtotal ({cartItems.length} items)</span>
            <span className="text-white font-medium">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Estimated Tax </span>
            <span className="text-[#A0AEC0] font-medium italic">Free</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Service Fee</span>
            <span className="text-[#A0AEC0] font-medium italic">Free</span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6 flex justify-between items-end">
          <span className="text-lg text-gray-400">Total</span>
          <span className="text-4xl font-extrabold text-[#FFBB33] tracking-tight">
            ${total.toFixed(2)}
          </span>
        </div>
      </aside>
    </div>
  );
}
