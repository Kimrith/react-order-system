import React, { useEffect, useState } from "react";
import HeaderOrder from "../../share/headerOrder";
import ProductOrder from "../../share/productOrder";
import OrderSummary from "../../share/order_summary";
import { Link, useNavigate } from "react-router-dom";

export default function CartOrder() {
  const navigate = useNavigate();

  // ✅ STATE
  const [cartItems, setCartItems] = useState([]);

  // ✅ GET DATA FROM LOCAL STORAGE
  useEffect(() => {
    const savedCart = localStorage.getItem("my_order");

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      // object -> array
      setCartItems(Object.values(parsedCart));
    } else {
      alert("No items in cart!");
      navigate("/");
    }
  }, [navigate]);

  // ✅ TOTALS
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0,
  );

  const total = subtotal;

  return (
    <div className="bg-[#1A202E] min-h-screen font-sans text-white relative">
      <div className="max-w-7xl mx-auto p-6 md:p-8 pb-40">
        <HeaderOrder cartItems={cartItems} />

        <div className="grid md:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-300 mb-4">
              Review Items
            </h2>

            <ProductOrder items={cartItems} />
          </div>

          {/* RIGHT */}
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </div>

      {/* --- FIXED BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#1A202E] border-t border-gray-800 z-50 shadow-[0_-10px_25px_rgba(0,0,0,0.3)]">
        <div className="max-w-md mx-auto space-y-6">
          {/* 1. Payment Method Section */}
          <div className="space-y-3">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              Payment Method
            </h3>

            {/* KHQR Selector Card */}
            <div className="bg-[#1A202E] border-2 border-[#FFBB33] p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_15px_rgba(255,187,51,0.1)]">
              <div className="bg-[#FFBB33] p-2 rounded-lg">
                {/* Using a placeholder for the QR icon - you can use an img or Lucide icon */}
                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                  <div className="border border-[#1A202E] w-2 h-2"></div>
                  <div className="border border-[#1A202E] w-2 h-2"></div>
                  <div className="border border-[#1A202E] w-2 h-2"></div>
                  <div className="border border-[#1A202E] w-2 h-2"></div>
                </div>
              </div>
              <div>
                <h4 className="text-[#FFBB33] font-bold text-base leading-tight">
                  KHQR
                </h4>
                <p className="text-gray-500 text-xs font-medium">
                  Digital Bakong
                </p>
              </div>
            </div>
          </div>

          {/* 2. Action Buttons */}
          <div className="flex gap-4">
            {/* Add More Button */}
            <Link to="/" className="flex-1">
              <button className="w-full bg-[#2D3748] py-4 rounded-2xl text-gray-300 font-bold hover:bg-gray-700 transition-colors active:scale-95">
                Add More
              </button>
            </Link>

            {/* Pay with KHQR Button */}
            <button className="flex-[2.5] bg-[#FFBB33] hover:bg-[#FFCC66] flex items-center justify-center gap-2 py-4 rounded-2xl shadow-[0_8px_25px_rgba(255,187,51,0.2)] transition-all active:scale-95 text-[#1A202E] font-extrabold text-lg">
              Pay with KHQR · ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
