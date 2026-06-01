import { useEffect } from "react";

export default function Toast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    /* We removed -translate-x-1/2 because the CSS animation handle centering natively now */
    <div className="fixed bottom-40 left-1/2 z-[100] animate-toast-slide">
      <div className="flex items-center gap-3 bg-[#1E2538]/90 backdrop-blur-md border border-gray-700/50 text-gray-200 px-5 py-3.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] font-medium text-sm whitespace-nowrap tracking-wide">
        {/* Status indicator dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>

        {/* Toast Message */}
        <span>{message}</span>
      </div>
    </div>
  );
}
