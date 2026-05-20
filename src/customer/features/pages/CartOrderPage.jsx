import React, { useEffect, useState } from "react";
import HeaderOrder from "../../common/HeaderOrder";
import ProductOrder from "../components/ProductOrder";
import OrderSummary from "../components/OrderSummary";
import { Link, useNavigate } from "react-router-dom";
import Bakong from "../components/BakongPayment";
import { generateKHQR, getQrCode, postOrder } from "../services/customerApi";

export default function CartOrder() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [invoice, setInvoice] = useState(null);

  // ✅ 1. INITIAL LOAD
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

  // ✅ 2. REACTIVE STATE AND LOCALSTORAGE REMOVAL
  const handleUpdateQty = (id, newQty) => {
    // Instantly remove item from UI view state array if quantity drops to 0
    const updatedItems =
      newQty === 0
        ? cartItems.filter((item) => item.productId !== id)
        : cartItems.map((item) =>
            item.productId === id ? { ...item, quantity: newQty } : item,
          );

    setCartItems(updatedItems);

    // Synchronize directly with localStorage
    const savedCart = JSON.parse(localStorage.getItem("my_order") || "{}");
    if (savedCart[id]) {
      if (newQty === 0) {
        delete savedCart[id];
      } else {
        savedCart[id].quantity = newQty;
      }
      localStorage.setItem("my_order", JSON.stringify(savedCart));
    }
  };

  // ✅ 3. DISCOUNTS AND FINANCIAL CALCULATIONS
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );

  const totalDiscountDeduction = cartItems.reduce((acc, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 0);
    const pct = Number(item.discountPercentage || 0);
    return acc + price * (pct / 100) * qty;
  }, 0);

  const total = subtotal - totalDiscountDeduction;

  const overallDiscountPercentage =
    subtotal > 0 ? (totalDiscountDeduction / subtotal) * 100 : 0;

  // ✅ 4. SECURE KHQR GENERATION FLOW
  const paymentBtn = async () => {
    // Core Gatekeeper check: Protect system from processing empty calculations
    if (!cartItems || cartItems.length === 0 || total <= 0) {
      alert(
        "Your cart is empty! Please buy a product before making a payment.",
      );
      return; // Stop execution immediately
    }

    try {
      const paymentData = {
        orderId: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        amount: Number(total.toFixed(2)), // Clean float constraint
        currency: "USD",
        expiryDate: new Date(Date.now() + 5 * 60000).toISOString(),
      };

      const response = await generateKHQR(paymentData);
      const inv = response.invoice;

      if (!inv) {
        alert("Invoice not generated");
        return;
      }

      const qrBlob = await getQrCode(inv);
      const qrUrl = URL.createObjectURL(qrBlob);

      setInvoice(inv);
      setQrCode(qrUrl);
      setIsOpen(true);
    } catch (err) {
      alert("Could not generate QR");
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const orderPayload = {
        invoiceNumber: invoice,
        items: cartItems,
        totalAmount: Number(total.toFixed(2)),
        status: "Paid",
        createdAt: new Date().toISOString(),
      };

      await postOrder(orderPayload);

      alert("🎉 Payment Successful! Your order has been placed.");
      navigate("/payment-success");
    } catch (err) {
      console.error("Database save error:", err);
      alert(
        "Payment was received, but we failed to save the order. Please contact support.",
      );
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
            <ProductOrder items={cartItems} onUpdateQty={handleUpdateQty} />
          </div>

          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            total={total}
            discountPercentage={overallDiscountPercentage}
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
          invoice={invoice}
          onClose={() => setIsOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
