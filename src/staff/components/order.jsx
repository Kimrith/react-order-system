import React, { useEffect, useState } from "react";
import { ShoppingCart, ChevronRight } from "lucide-react";

export default function Order() {
  const [totalCountProduct, setTotalCountProduct] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateCart = () => {
    const savedCart = localStorage.getItem("my_order");

    if (!savedCart) {
      setTotalCountProduct(0);
      setTotalPrice(0);
      return;
    }

    const cartObj = JSON.parse(savedCart);
    const items = Object.values(cartObj);

    setTotalCountProduct(items.reduce((t, i) => t + (i.quantity || 0), 0));

    setTotalPrice(
      items.reduce((t, i) => t + (i.price || 0) * (i.quantity || 0), 0),
    );
  };

  useEffect(() => {
    calculateCart(); // initial load

    window.addEventListener("cartUpdated", calculateCart);

    return () => {
      window.removeEventListener("cartUpdated", calculateCart);
    };
  }, []);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
      <button className="w-64 pointer-events-auto bg-gradient-to-r from-[#FFBB33] to-[#FF8C33] flex items-center justify-between py-4 px-8 rounded-full shadow-[0_10px_25px_rgba(255,187,51,0.4)]">
        <div className="flex items-center gap-3">
          <div className="bg-[#1A202E]/20 p-2 rounded-lg">
            <ShoppingCart size={20} className="text-[#1A202E]" />
          </div>

          <div className="bg-[#1A202E] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#FFBB33]">
            {totalCountProduct}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#1A202E] font-extrabold text-lg">
            ${totalPrice.toFixed(2)}
          </span>
          <ChevronRight size={20} className="text-[#1A202E]" />
        </div>
      </button>
    </div>
  );
}
