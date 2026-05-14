import React, { useEffect, useState } from "react";
import HeaderOrder from "../../share/headerOrder";
import ProductOrder from "../../share/productOrder";
import OrderSummary from "../../share/order_summary";
import { Link, useNavigate } from "react-router-dom";
import Bakong from "../../share/bakong";
import { generateKHQR, getQrCode } from "../api/api";

export default function CartOrder() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  // ✅ 1. LOAD DATA
  useEffect(() => {
    const savedCart = localStorage.getItem("my_order");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(Object.values(parsedCart));
    } else {
      alert("No items in cart!");
      navigate("/");
    }
  }, [navigate]);

  // ✅ 2. UPDATE QUANTITY & PERSIST TO LOCALSTORAGE
  const handleUpdateQty = (id, newQty) => {
    // Update local state for UI
    const updatedItems = cartItems.map((item) =>
      item.productId === id ? { ...item, quantity: newQty } : item,
    );

    setCartItems(updatedItems);

    // Sync back to LocalStorage so data isn't lost on refresh
    const savedCart = JSON.parse(localStorage.getItem("my_order") || "{}");
    if (savedCart[id]) {
      if (newQty === 0) {
        delete savedCart[id]; // Remove item if qty is 0
      } else {
        savedCart[id].quantity = newQty;
      }
      localStorage.setItem("my_order", JSON.stringify(savedCart));
    }
  };

  // ✅ 3. TOTALS
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0,
  );
  const total = subtotal;

  const paymentBtn = async () => {
    try {
      const paymentData = {
        orderId: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        amount: total,
        currency: "USD",
        expiryDate: new Date(Date.now() + 5 * 60000).toISOString(),
      };

      // 1️⃣ Generate KHQR
      const response = await generateKHQR(paymentData);
      console.log("KHQR response:", response);

      const invoice = response.invoice;

      if (!invoice) {
        alert("Invoice not found");
        return;
      }

      // 2️⃣ Get QR IMAGE
      const qrBlob = await getQrCode(invoice);

      // 3️⃣ Convert blob → image URL
      const qrUrl = URL.createObjectURL(qrBlob);

      setQrCode(qrUrl);
      setIsOpen(true);
    } catch (err) {
      console.error(err);
      alert("Could not generate QR");
    }
  };

  return (
    <div className="bg-[#1A202E] min-h-screen font-sans text-white relative">
      <div className="max-w-7xl mx-auto p-6 md:p-8 pb-40">
        <HeaderOrder cartItems={cartItems} />

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-300 mb-4">
              Review Items
            </h2>
            {/* ✅ onUpdateQty is now correctly passed */}
            <ProductOrder items={cartItems} onUpdateQty={handleUpdateQty} />
          </div>

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
          <div className="space-y-3">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              Payment Method
            </h3>
            <div className="bg-[#1A202E] border-2 border-[#FFBB33] p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_15px_rgba(255,187,51,0.1)]">
              <div className="bg-[#FFBB33] p-2 rounded-lg">
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

          <div className="flex gap-4">
            <Link to="/" className="flex-1">
              <button className="w-full bg-[#2D3748] py-4 rounded-2xl text-gray-300 font-bold hover:bg-gray-700 transition">
                Add More
              </button>
            </Link>

            <button
              onClick={paymentBtn}
              className="flex-[2.5] bg-[#FFBB33] hover:bg-[#FFCC66] flex items-center justify-center gap-2 py-4 rounded-2xl shadow-[0_8px_25px_rgba(255,187,51,0.2)] transition text-[#1A202E] font-extrabold text-lg"
            >
              Pay with KHQR · ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
      {/* --- BAKONG MODAL --- */}
      {isOpen && (
        <Bakong
          cartItems={cartItems}
          total={total}
          qrCode={qrCode}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
