import React from "react";
import { X } from "lucide-react";

export default function Bakong({ total, onClose, qrCode }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center">
      {/* CARD */}
      <div className="bg-[#1E2746] w-full max-w-md rounded-t-[38px] sm:rounded-[38px] p-7 relative shadow-2xl border border-white/5 animate-in slide-in-from-bottom duration-300">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="text-center mt-2">
          <h1 className="text-3xl font-black text-white">Scan to Pay</h1>

          <p className="text-gray-400 text-sm mt-1">
            Use your Bakong / ABA / Wing app
          </p>
        </div>

        {/* AMOUNT */}
        <div className="text-center mt-7">
          <h2 className="text-5xl font-black text-[#FFBB33] tracking-tight">
            ${total.toFixed(2)}
          </h2>
        </div>

        {/* QR */}
        <div className="flex justify-center mt-8">
          <div className="bg-white p-5 rounded-[28px] shadow-inner">
            <img src={qrCode} alt="QR Code" className="w-56 h-56 rounded-2xl" />
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-8">
          <div className="w-full h-1.5 bg-[#2B355C] rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-[#FFBB33] rounded-full animate-pulse"></div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-3">
            Simulating payment in{" "}
            <span className="text-[#FFBB33] font-bold">2s...</span>
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={onClose}
          className="w-full mt-8 bg-[#FFBB33] hover:bg-[#ffca57] text-[#1A202E] font-black py-4 rounded-2xl transition active:scale-95"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}
