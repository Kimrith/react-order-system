import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { checkPaymentStatus } from "../services/customerApi";

const TOTAL_TIME = 60; // 60 seconds countdown limit

export default function Bakong({
  total,
  onClose,
  qrCode,
  invoice,
  onPaymentSuccess,
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const percentageWidth = (timeLeft / TOTAL_TIME) * 100;

  // 1. Manage the 1-second dynamic countdown interval
  useEffect(() => {
    if (!isChecking || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isChecking]);

  // 2. Clear view fallback if clock hits zero
  useEffect(() => {
    if (timeLeft === 0 && isChecking) {
      alert("⏱️ Payment window expired. Please try again.");
      onClose();
    }
  }, [timeLeft, isChecking, onClose]);

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
        <div className="mt-8 space-y-3">
          {/* Header Row: Label & Time Counter */}
          <div className="flex items-center justify-between text-sm min-h-[20px]">
            {isChecking ? (
              <>
                <div className="flex items-center gap-2 text-gray-400 font-medium">
                  <Loader2 className="animate-spin text-[#FFBB33]" size={15} />
                  <span>Waiting for payment...</span>
                </div>
                <span className="font-mono text-[#FFBB33] bg-[#FFBB33]/10 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider">
                  {timeLeft}s
                </span>
              </>
            ) : (
              <div className="flex items-center gap-2 text-green-400 font-bold mx-auto animate-fade-in">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Success! Processing order...
              </div>
            )}
          </div>

          {/* Progress Track */}
          <div className="w-full h-2 bg-[#2B355C] rounded-full overflow-hidden p-[1px]">
            <div
              className={`h-full bg-[#FFBB33] rounded-full transition-all duration-1000 ease-linear ${isChecking ? "animate-pulse shadow-[0_0_12px_rgba(255,187,51,0.5)]" : "bg-green-500"
                }`}
              style={{ width: `${percentageWidth}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
