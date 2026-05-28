import React, { useEffect, useState } from "react";
import HeaderOrder from "../../common/HeaderOrder";
import ProductOrder from "../components/ProductOrder";
import OrderSummary from "../components/OrderSummary";
import { Link, useNavigate, useParams } from "react-router-dom"; // 1. Added useParams
import Bakong from "../components/BakongPayment";
import PopupBakong from "./PopupBakong";
import Toast from "../components/ToastPayment";

import {
  generateKHQR,
  getQrCode,
  postOrder,
} from "../services/customerApi";

export default function CartOrder() {
  const navigate = useNavigate();
  const { tableId } = useParams(); // 2. Grab tableId from URL path segment

  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  // Load cart
  useEffect(() => {
    const savedCart = localStorage.getItem("my_order");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(Object.values(parsedCart));
    } else {
      // FIXED: Redirect back to the specific table menu layout if cart is empty
      navigate(`/TableQr/${tableId}`);
    }
  }, [navigate, tableId]);

  // Update qty
  const handleUpdateQty = (id, newQty) => {
    const updatedItems =
      newQty === 0
        ? cartItems.filter((item) => item.productId !== id)
        : cartItems.map((item) =>
          item.productId === id ? { ...item, quantity: newQty } : item
        );

    setCartItems(updatedItems);

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

  // Financial calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const totalDiscountDeduction = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    const pct = Number(item.discountPercentage) || 0;
    return acc + price * (pct / 100) * qty;
  }, 0);

  const total = subtotal - totalDiscountDeduction;

  const overallDiscountPercentage =
    subtotal > 0 ? (totalDiscountDeduction / subtotal) * 100 : 0;

  // Generate QR
  const paymentBtn = async () => {
    if (!cartItems || cartItems.length === 0 || total <= 0) {
      setToastMessage("⚠️ Your cart is empty! Please add a product before paying.");
      setShowToast(true);
      return;
    }

    try {
      const paymentData = {
        orderId: `ORD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        amount: Number(total.toFixed(2)),
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
      console.error(err);
      alert("Could not generate QR");
    }
  };

  // Payment success
  const handlePaymentSuccess = async () => {
    try {
      const orderPayload = {
        tableId: tableId, // FIXED: Sending dynamic table variable to your ASP.NET backend!
        invoiceNumber: invoice,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: Number(total.toFixed(2)),
        status: "Paid",
        createdAt: new Date().toISOString(),
      };

      await postOrder(orderPayload);

      setIsOpen(false);

      // Play audio instantly
      new Audio('/public/sound/thank.mp3').play().catch(() => { });
      setShowPopup(true);

    } catch (err) {
      console.error("Database save error:", err);
      alert("Payment was received but saving failed.");
    }
  };

  return (
    <div className="bg-[#1A202E] min-h-screen text-white relative">
      <div className="max-w-7xl mx-auto p-6 md:p-8 pb-40">
        <HeaderOrder cartItems={cartItems} setCartItems={setCartItems} />

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-300 mb-4">Review Items</h2>
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

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#1A202E] border-t border-gray-800 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex gap-4">
            {/* FIXED: Target the dynamic menu path structure */}
            <Link to={`/TableQr/${tableId}`} className="flex-1">
              <button className="w-full bg-[#2D3748] py-4 rounded-2xl text-gray-300">
                Add More
              </button>
            </Link>

            <button
              onClick={paymentBtn}
              className="flex-[2.5] bg-[#FFBB33] py-4 rounded-2xl text-[#1A202E] font-bold"
            >
              Pay with KHQR · ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {isOpen && (
        <Bakong
          total={total}
          qrCode={qrCode}
          invoice={invoice}
          onClose={() => setIsOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Success popup */}
      {showPopup && (
        <PopupBakong
          onClose={() => {
            setShowPopup(false);
            navigate(`/TableQr/${tableId}/payment-success`, {
              state: { items: cartItems, totalAmount: total }
            });
          }}
        />
      )}

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}