import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getCategories, getProduct } from "../services/customerApi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Cleaned up here: Destructure both parameters smoothly in one single line
  const { tableId, id: routeId } = useParams();

  // Safely extract active target category parameter across raw structural paths
  let activeId = "all";
  if (location.pathname.includes("/categories/")) {
    activeId = routeId || location.pathname.split("/").pop();
  } else {
    activeId = "all";
  }

  useEffect(() => {
    Promise.all([getCategories(), getProduct()])
      .then(([categoryData, productData]) => {

        // 1. Filter out Suspended & Expired products
        const isInactiveDiscount = (badge) =>
          ["suspended", "expired"].includes((badge || "").toLowerCase());

        const activeProducts = productData.filter(
          (p) => !isInactiveDiscount(p.discountStatusBadge)
        );

        // 2. Identify categories using only ACTIVE products
        const activeCategoryIds = new Set(
          activeProducts.map((p) => p.categoryId.toString()),
        );

        // 3. Check statuses only against active products
        const hasDiscountProducts = activeProducts.some(p => p.discountStatusBadge === "Active");
        const hasUpcomingProducts = activeProducts.some(p => p.discountStatusBadge === "Upcoming");

        const formatted = categoryData.map((item) => {
          const stringId = item.id.toString();
          return {
            id: stringId,
            label: item.categoryName,
            // hasProducts is now based on active products only
            hasProducts: activeCategoryIds.has(stringId),
          };
        });

        setCategories([
          { id: "all", label: "All", hasProducts: true },
          { id: "discount", label: "Discount", hasProducts: hasDiscountProducts },
          { id: "upcoming", label: "Upcoming", hasProducts: hasUpcomingProducts },
          ...formatted,
        ]);
      })
      .catch((err) => console.error("Error loading header categories:", err));
  }, []);

  const handleClick = (id, hasProducts) => {
    if (!hasProducts) return;

    if (id === "all") {
      navigate(`/TableQr/${tableId}`);
    } else {
      navigate(`/TableQr/${tableId}/categories/${id}`);
    }
  };

  const CategoryButton = ({ id, label, hasProducts }) => {
    const isActive = String(activeId) === String(id);

    const baseClasses =
      "flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium tracking-wide transition-all duration-200 select-none whitespace-nowrap";

    const activeClasses =
      "bg-[#FFBB33] text-[#1A202E] border-[#FFBB33] font-semibold shadow-md cursor-pointer";

    const inactiveClasses =
      "bg-[#2D3748] text-gray-300 border-[#4A5568] hover:border-gray-400 cursor-pointer active:scale-98";

    const disabledClasses =
      "bg-gray-800/50 text-gray-600 border-gray-700/60 cursor-not-allowed opacity-40";

    return (
      <button
        onClick={() => handleClick(id, hasProducts)}
        disabled={!hasProducts}
        className={`
          ${baseClasses} 
          ${!hasProducts ? disabledClasses : isActive ? activeClasses : inactiveClasses}
        `}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full bg-[#1A202E] border-b border-gray-800/80 py-4 px-6">
      <div className="flex items-center gap-3 overflow-x-auto pb-1 max-w-full scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <CategoryButton
            key={cat.id}
            id={cat.id}
            label={cat.label}
            hasProducts={cat.hasProducts}
          />
        ))}
      </div>
    </div>
  );
}
