import React, { useEffect, useState } from "react";
import { Check, Home, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("my_order");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const itemsArray = Object.values(parsedCart);
        setCartItems(itemsArray);
      } catch (error) {
        console.error("Failed to parse cart:", error);
      }
    }
  }, []);

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0,
  );

  const clearlocalStorage = () => {
    localStorage.removeItem("my_order");
  };

  return (
    /* 🛠️ FIX 1: Changed h-100% to min-h-screen so it covers mobile viewports fully. Fixed justify-centet typo. Added p-4 so it doesn't touch phone edges awkwardly. */
    <div className="w-full min-h-screen bg-[#1A202E] flex items-center justify-center p-4 font-sans text-white">
      {/* 🛠️ FIX 2: Changed w-full max-w-md to md:max-w-md. On mobile, it will now naturally take full available width. */}
      <div className="bg-[#242C45] w-full md:max-w-md p-6 sm:p-8 border border-white/5 shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-500">
        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-transparent border-4 border-[#10B981] rounded-full flex items-center justify-center">
            <Check size={48} className="text-[#10B981]" strokeWidth={3} />
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-black tracking-tight">Order Placed!</h1>
          <p className="text-gray-400 text-sm px-6 leading-relaxed">
            Payment confirmed. Your order is heading to the kitchen! 🍳
          </p>
        </div>

        {/* TABLE INFO */}
        <div className="bg-[#1E253A] rounded-2xl p-5 mb-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-medium">Table</span>
            <span className="text-white font-bold text-xl">A1</span>
          </div>
          <div className="h-[1px] bg-white/5 w-full" />
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-medium">Payment</span>
            <span className="bg-[#D1FAE5] text-[#065F46] px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
              <Check size={12} strokeWidth={4} /> KHQR PAID
            </span>
          </div>
        </div>

        {/* ORDER RECEIPT */}
        <div className="bg-[#1E253A] rounded-3xl overflow-hidden border border-white/5 mb-8">
          <div className="p-5 border-b border-white/5 bg-white/5 flex items-center gap-2">
            <ShoppingBag size={16} className="text-gray-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Your Order
            </span>
          </div>

          <div className="p-5 space-y-4 max-h-60 overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.emoji || "🍽️"}</span>
                    <span className="text-gray-200 font-medium">
                      {item.productName || item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 mr-4">
                      ×{item.quantity}
                    </span>
                    <span className="font-bold">
                      ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No items found
              </p>
            )}
          </div>

          <div className="bg-white/5 p-5 flex justify-between items-center">
            <span className="text-[#FFBB33] font-bold text-lg">Total</span>
            <span className="text-[#FFBB33] font-black text-2xl">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* STATUS INDICATOR */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-1.5 mb-3">
            <div className="w-2 h-2 bg-[#FFBB33] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#FFBB33] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-[#FFBB33] rounded-full animate-bounce [animation-delay:-0.3s]" />
          </div>
          <p className="text-gray-500 text-xs font-medium">
            Waiting for kitchen to accept your order...
          </p>
        </div>

        {/* BACK BUTTON */}
        <Link to="/">
          <button
            onClick={clearlocalStorage}
            className="w-full bg-transparent border border-white/10 hover:bg-white/5 py-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 group"
          >
            <Home size={18} className="text-gray-400 group-hover:text-white" />
            <span className="font-bold text-gray-300 group-hover:text-white">
              Back to Menu
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
