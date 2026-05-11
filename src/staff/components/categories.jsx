import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id: activeId } = useParams();

  useEffect(() => {
    getCategories()
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item.id.toString(),
          label: item.categoryName,
          // Store whether it has products
          hasProducts: item.products && item.products.length > 0,
        }));

        // "All" is always enabled (assuming there's at least one product in the shop)
        setCategories([
          { id: "all", label: "All", hasProducts: true },
          ...formatted,
        ]);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (id, hasProducts) => {
    // Prevent navigation if there are no products
    if (!hasProducts) return;

    if (id === "all") {
      navigate("/");
    } else {
      navigate(`/categories/${id}`);
    }
  };

  const CategoryButton = ({ id, label, hasProducts }) => {
    const isActive = (!activeId && id === "all") || activeId === id;

    const baseClasses =
      "flex items-center gap-2 px-4 py-2 rounded-full border transition whitespace-nowrap text-sm";

    // Style for Active state
    const activeClasses =
      "bg-[#FFBB33] text-[#1A202E] border-[#FFBB33] font-semibold";

    // Style for Inactive (but available) state
    const inactiveClasses =
      "bg-[#2D3748] text-gray-300 border-[#4A5568] hover:border-gray-400";

    // Style for Disabled state
    const disabledClasses =
      "bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed opacity-50";

    return (
      <button
        onClick={() => handleClick(id, hasProducts)}
        disabled={!hasProducts} // Native HTML disabled attribute
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
    <div>
      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-10 hide-scrollbar">
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
