import React from "react";

export default function PopupBakong({
    isVisible = true,
    onClose,
}) {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-[#1E2746] w-full max-w-sm rounded-[38px] p-8 text-center shadow-2xl border border-white/5 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                {/* GIF */}
                <div className="flex justify-center mt-2">
                    <div className="relative w-40 h-40 bg-gradient-to-b from-amber-500/10 to-transparent rounded-full flex items-center justify-center overflow-hidden border border-white/5">
                        <img
                            src="/sound/thank.gif"
                            alt="Thank you animation"
                            className="w-full h-full object-cover scale-105"
                        />
                    </div>
                </div>
                {/* Text */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Thank You!
                    </h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-[260px] mx-auto">
                        Your payment was processed successfully.
                        Your order is now being prepared!
                    </p>
                </div>
                {/* Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-[#FFBB33] hover:bg-[#FFCC66] text-[#1A202E] font-black py-4 rounded-2xl shadow-[0_8px_25px_rgba(255,187,51,0.25)] transition-all active:scale-[0.98] text-lg"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}