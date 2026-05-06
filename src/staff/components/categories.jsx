import React from "react";

export default function Categories() {
  const categories = [
    { emoji: "🌟", label: "All", isActive: true },
    { emoji: "🥤", label: "Drinks", isActive: false },
    { emoji: "🍔", label: "Food", isActive: false },
    { emoji: "🍰", label: "Desserts", isActive: false },
    { emoji: "🍟", label: "Snacks", isActive: false },
  ];
  const CategoryButton = ({ emoji, label, isActive }) => {
    const baseClasses =
      "flex items-center gap-2 px-4 py-2 rounded-full border transition whitespace-nowrap text-sm";
    const activeClasses =
      "bg-[#FFBB33] text-[#1A202E] border-[#FFBB33] font-semibold";
    const inactiveClasses =
      "bg-[#2D3748] text-gray-300 border-[#4A5568] hover:border-gray-400";

    return (
      <button
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <span>{emoji}</span>
        {label}
      </button>
    );
  };
  return (
    <div>
      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-10 hide-scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {categories.map((cat, index) => (
          <CategoryButton key={index} {...cat} />
        ))}
      </div>
    </div>
  );
}
