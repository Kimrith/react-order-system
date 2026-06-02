import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getCategoryById, getProduct } from "../services/customerApi";

export default function CategoriesId() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Safely pick up search query context passing down from layout template
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";

  // Initialize Cart state from LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("my_order");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // Cross-reference category information with global products data array
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    if (id === "all") {
      getProduct()
        .then((allProducts) => {
          setCategory({
            categoryName: "All Items",
            products: allProducts,
          });
        })
        .catch((err) => {
          console.error("Error loading all products:", err);
          setCategory(null);
        })
        .finally(() => setLoading(false));
    } else {
      // Fetch the category information and all products concurrently
      Promise.all([getCategoryById(id), getProduct()])
        .then(([categoryDetails, allProducts]) => {
          // Filter the products manually since the backend doesn't nest them
          const matchedProducts = allProducts.filter(
            (p) => String(p.categoryId) === String(id),
          );

          setCategory({
            categoryName: categoryDetails.categoryName,
            products: matchedProducts, // Inject filtered array here
          });
        })
        .catch((err) => {
          console.error("Error cross-referencing category data:", err);
          setCategory(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Sync state modifications to local storage engines
  useEffect(() => {
    localStorage.setItem("my_order", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // ✅ MATCHED WITH PRODUCT CARD DESIGN ADD LOGIC
  const handleAdd = (product) => {
    new Audio('/public/sound/add_to_cart.mp3').play()
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
          discountPercentage: product.discountPercentage,
          description: product.description,
          image: `${import.meta.env.VITE_IMAGE_URL}${product.productImg}`,
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-[#FFBB33] font-medium animate-pulse tracking-wide">
          Loading menu items...
        </p>
      </div>
    );
  }

  const filteredProducts =
    category?.products?.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;

      const matchesId = String(p.id).includes(query);
      const matchesName = p.name?.toLowerCase().includes(query);

      return matchesId || matchesName;
    }) || [];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-black text-white mb-8 tracking-tight uppercase border-l-4 border-[#FFBB33] pl-4">
        {category?.categoryName || "Menu Section"}
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const productId = String(p.id);
            const qty = cart[productId]?.quantity || 0;
            const {
              name,
              description,
              price,
              isAvailable,
              productImg,
              discountPercentage,
            } = p;

            return (
              <div
                key={p.id}
                className="group bg-[#2D3748] rounded-2xl p-4 border border-[#4A5568] flex flex-col transition-all hover:shadow-2xl hover:border-[#FFBB33]/50 hover:-translate-y-1 relative"
              >
                {/* Image Core Frame */}
                <div className="relative aspect-square mb-4 rounded-xl bg-[#1A202E]/50 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={
                      productImg
                        ? `${import.meta.env.VITE_IMAGE_URL.replace(/\/$/, "")}/${productImg.replace(/^\//, "")}`
                        : "https://placehold.co/300x300/2d3748/ffffff?text=No+Image"
                    }
                    alt={name}
                    className={`w-full h-full object-contain transition-transform duration-300 ${isAvailable && "group-hover:scale-110"}`}
                  />

                  {/* ✅ Premium Discount Tag (Top Left Corner) */}
                  {Number(p.discountPercentage) > 0 && p.isAvailable && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white font-extrabold text-[12px] tracking-wide uppercase px-2 py-0.5 rounded-md shadow-md z-10 animate-pulse">
                      {discountPercentage}% OFF
                    </div>
                  )}

                  {/* Quantity Tracker Badge */}
                  {qty > 0 && (
                    <div className="absolute top-2 right-2 bg-[#FFBB33] text-[#1A202E] font-bold text-xs px-2 py-1 rounded-lg shadow-md">
                      {qty}
                    </div>
                  )}

                  {/* Stock Boundary Status Block */}
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold uppercase tracking-widest text-xs bg-red-600 px-3 py-1.5 rounded-full shadow-lg">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-white font-bold text-base line-clamp-1">
                      {name}
                    </h4>
                    <span className="text-gray-500 text-[10px] shrink-0 mt-1">
                      #{p.id}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                    {description || "No description available."}
                  </p>
                </div>

                {/* Pricing & CTA Action Row */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#4A5568]/50">
                  <div className="flex flex-col">
                    {discountPercentage > 0 ? (
                      <>
                        {/* Strike-through original price */}
                        <span className="text-gray-500 line-through text-base font-medium">
                          ${price.toFixed(2)}
                        </span>
                        {/* New Discounted Price */}
                        <span className="text-[#FFBB33] font-black text-xl">
                          ${(price * (1 - discountPercentage / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      /* Regular Price if no discount */
                      <span className="text-[#FFBB33] font-black text-xl">
                        ${price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Add Action Button */}
                  <button
                    onClick={() => handleAdd(p)}
                    disabled={!isAvailable}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-[#1A202E] transition-all duration-200 active:scale-95 ${isAvailable
                        ? "bg-[#FFBB33] hover:bg-[#ffca5c] shadow-md hover:shadow-[#FFBB33]/20"
                        : "bg-[#4A5568] opacity-40 cursor-not-allowed text-gray-400"
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
        <div className="text-center py-20 text-gray-500 bg-[#2D3748]/30 rounded-2xl border border-dashed border-gray-800">
          {searchQuery
            ? `No items found matching "${searchQuery}"`
            : "No products available in this category yet."}
        </div>
      )}
    </div>
  );
}
