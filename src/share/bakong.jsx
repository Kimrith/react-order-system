import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { checkPaymentStatus } from "../customer/api/api";

export default function Bakong({
  total,
  onClose,
  qrCode,
  invoice,
  onPaymentSuccess,
}) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!invoice) return;

    // Start polling every 3 seconds
    const interval = setInterval(async () => {
      try {
        const data = await checkPaymentStatus(invoice);

        if (data && data.status === "PAID") {
          clearInterval(interval); // Stop the loop
          setIsChecking(false);

          // ✅ Run the success logic safely
          if (typeof onPaymentSuccess === "function") {
            onPaymentSuccess();
          } else {
            console.error("The onPaymentSuccess prop is missing!");
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval); // Cleanup if user closes modal
  }, [invoice, onPaymentSuccess]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[#1E2746] w-full max-w-md rounded-t-[38px] sm:rounded-[38px] p-7 relative shadow-2xl border border-white/5">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400"
        >
          <X size={18} />
        </button>

        <div className="text-center mt-2">
          <h1 className="text-3xl font-black text-white">Scan to Pay</h1>
          <p className="text-gray-400 text-sm mt-1">
            Use your Bakong / ABA / Wing app
          </p>
        </div>

        <div className="text-center mt-7">
          <h2 className="text-5xl font-black text-[#FFBB33]">
            ${total.toFixed(2)}
          </h2>
        </div>

        {/* QR CODE SECTION */}
        <div className="flex justify-center mt-8">
          <div className="bg-white p-5 rounded-[28px] relative">
            <img src={qrCode} alt="QR Code" className="w-56 h-56 rounded-2xl" />

            {/* Success Overlay */}
            {!isChecking && (
              <div className="absolute inset-0 bg-white/90 rounded-[28px] flex flex-col items-center justify-center text-[#1E2746]">
                <div className="bg-green-500 text-white p-2 rounded-full mb-2">
                  ✓
                </div>
                <span className="font-bold">Payment Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* STATUS BAR */}
        <div className="mt-8">
          <div className="w-full h-1.5 bg-[#2B355C] rounded-full overflow-hidden">
            <div
              className={`h-full bg-[#FFBB33] transition-all duration-500 ${
                isChecking ? "w-2/3 animate-pulse" : "w-full"
              }`}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-3 flex items-center justify-center gap-2">
            {isChecking ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Waiting for payment...
              </>
            ) : (
              <span className="text-green-400 font-bold">
                Success! Processing order...
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
