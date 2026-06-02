import React from "react";
import { Plus, Minus } from "lucide-react";

export default function ProductOrder({ items = [], onUpdateQty }) {
  const handleDecreaseQty = (productId, currentQty) => {
    if (currentQty > 0 && onUpdateQty) {
      onUpdateQty(productId, currentQty - 1);
    }
  };

  const handleIncreaseQty = (productId, currentQty) => {
    if (onUpdateQty) {
      onUpdateQty(productId, currentQty + 1);
    }
  };

  // ✅ FILTER: Only display items that have a quantity greater than 0
  const activeItems = items.filter((item) => Number(item.quantity || 0) > 0);

  if (activeItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-[#2D3748]/30 rounded-2xl border border-dashed border-gray-800">
        Your cart is currently empty.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ✅ Map through activeItems instead of items */}
      {activeItems.map((item, index) => {
        const originalPrice = Number(item.price || 0);
        const qty = Number(item.quantity || 0);
        const discountPercentage = Number(item.discountPercentage || 0);

        const singleDiscountedPrice =
          discountPercentage > 0
            ? originalPrice * (1 - discountPercentage / 100)
            : originalPrice;

        const totalLinePrice = singleDiscountedPrice * qty;

        return (
          <div
            key={item.productId || index}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#4A5568]/40 bg-[#2D3748] p-4 shadow-lg transition-all hover:border-[#FFBB33]/30"
          >
            {/* IMAGE CONTAINER WITH PREMIUM BADGE FRAME */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#4A5568]/30 bg-[#1A202E]">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.productName}
                className="w-20 h-20 rounded-xl object-cover bg-[#1A202E] shrink-0"
              />

              {discountPercentage > 0 && (
                <div className="absolute top-1 left-1 z-10 animate-pulse rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* PRODUCT METADATA INFO */}
            <div className="flex h-20 flex-1 flex-col justify-between min-w-0 py-0.5">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate text-base font-bold text-white transition-colors group-hover:text-[#FFBB33]">
                    {item.productName
                      ? item.productName.length > 13
                        ? `${item.productName.slice(0, 13)}...`
                        : item.productName
                      : "No Name"}
                  </h3>
                  <span className="mt-0.5 shrink-0 text-[10px] text-gray-500">
                    #{item.productId}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                  {item.description
                    ? item.description.length > 10
                      ? `${item.description.slice(0, 10)}...`
                      : item.description
                    : "No desc..."}
                </p>
              </div>

              {/* PRICING BLOCK */}
              <div className="flex flex-col justify-end">
                {discountPercentage > 0 ? (
                  <>
                    <span className="mb-0.5 text-xs font-medium text-gray-500 line-through leading-none">
                      ${(originalPrice * qty).toFixed(2)}
                    </span>
                    <p className="text-lg font-black text-[#FFBB33] leading-none">
                      ${totalLinePrice.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-black text-[#FFBB33] leading-none">
                    ${totalLinePrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* QUANTITY CONTROLS */}
            <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#4A5568]/60 bg-[#1A202E] p-1.5 shadow-inner">
              <button
                onClick={() => handleDecreaseQty(item.productId, qty)}
                className="rounded-full bg-[#2D3748] p-1.5 text-gray-400 transition hover:text-white active:scale-90"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>

              <span className="w-5 text-center text-sm font-extrabold text-white select-none">
                {qty}
              </span>

              <button
                onClick={() => handleIncreaseQty(item.productId, qty)}
                className="rounded-full bg-[#FFBB33] p-1.5 text-[#1A202E] shadow-sm transition hover:bg-[#ffca5c] active:scale-90"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
