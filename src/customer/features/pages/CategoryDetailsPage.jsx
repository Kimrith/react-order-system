import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom"; // Hook into the outlet context
import { getCategoryById } from "../services/customerApi";

export default function CategoriesId() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  // 1. Grab the global searchQuery passed from the parent layout's <Outlet />
  const { searchQuery } = useOutletContext();

  // ✅ 1. Initialize Cart state from LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("my_order");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    getCategoryById(id)
      .then((data) => setCategory(data))
      .catch((err) => console.error(err));
  }, [id]);

  // ✅ 2. Save to LocalStorage and notify other components when cart changes
  useEffect(() => {
    localStorage.setItem("my_order", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // ✅ 3. Add to Cart Function
  const handleAdd = (product) => {
    const productId = String(product.id);

    setCart((prev) => {
      const currentQty = prev[productId]?.quantity || 0;
      return {
        ...prev,
        [productId]: {
          productId,
          productName: product.name,
          quantity: currentQty + 1,
          price: product.price,
          isAvailable: product.isAvailable,
          description: product.description,
        },
      };
    });
  };

  // 2. Filter products dynamically based on Name OR ID from the API data
  const filteredProducts =
    category?.products?.filter((p) => {
      // If context isn't ready or search is completely empty, show all items
      const query = searchQuery?.toLowerCase().trim() || "";
      if (!query) return true;

      const matchesId = String(p.id).includes(query);
      const matchesName = p.name?.toLowerCase().includes(query);

      return matchesId || matchesName;
    }) || [];

  if (!category)
    return <p className="text-white text-center py-10">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-8 tracking-tight uppercase border-l-4 border-[#FFBB33] pl-4">
        {category.categoryName}
      </h2>

      {/* 3. Render filteredProducts if items exist, otherwise show an empty-state message */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            // ✅ 4. Check current quantity for this specific product
            const qty = cart[String(p.id)]?.quantity || 0;

            return (
              <div
                key={p.id}
                className="group bg-[#2D3748] rounded-2xl p-4 border border-[#4A5568] flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-[#FFBB33]/50 hover:-translate-y-1 relative"
              >
                <div className="relative aspect-square mb-4 rounded-xl bg-[#1A202E]/50 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_URL.replace(/\/$/, "")}/uploads/${p.productImg.replace(/^\//, "")}`}
                    alt={p.name}
                    className="w-full h-full object-contain"
                  />

                  {/* ✅ 5. Quantity Badge UI */}
                  {qty > 0 && (
                    <div className="absolute top-2 right-2 bg-[#FFBB33] text-[#1A202E] font-bold text-xs px-2 py-1 rounded-lg shadow-md">
                      {qty}
                    </div>
                  )}

                  {/* SOLD OUT OVERLAY */}
                  {!p.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold uppercase tracking-widest text-xs bg-red-600 px-3 py-4 rounded-full shadow-lg">
                        Solid Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-white font-bold text-base leading-tight line-clamp-1">
                      {p.name}
                    </h4>
                    <span className="text-gray-500 text-[10px]">#{p.id}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 min-h-[32px] leading-relaxed">
                    {p.description || "No description available."}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#4A5568]/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                      Price
                    </span>
                    <span className="text-[#FFBB33] font-black text-lg">
                      ${p.price}
                    </span>
                  </div>

                  <button
                    // ✅ 6. Attach the handleAdd function
                    onClick={() => handleAdd(p)}
                    disabled={!p.isAvailable}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-[#1A202E] transition
                    ${
                      p.isAvailable
                        ? "bg-[#FFBB33]"
                        : "bg-[#FFBB33] opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No items found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
