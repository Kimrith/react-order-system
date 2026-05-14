import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams to sync active state
import { getCategories } from "../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id: activeId } = useParams(); // Get current category ID from URL

  useEffect(() => {
    getCategories()
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item.id.toString(), // Ensure IDs are strings for comparison
          label: item.categoryName,
        }));

        // ADD "All" button at the beginning of the array
        setCategories([{ id: "all", label: "All" }, ...formatted]);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (id) => {
    if (id === "all") {
      navigate("/"); // Go back to main product list
    } else {
      navigate(`/categories/${id}`); // Go to specific category
    }
  };

  const CategoryButton = ({ id, label }) => {
    // Determine active state:
    // If no ID in URL, "All" is active. Otherwise, match the ID.
    const isActive = (!activeId && id === "all") || activeId === id;

    const baseClasses =
      "flex items-center gap-2 px-4 py-2 rounded-full border transition whitespace-nowrap text-sm";

    const activeClasses =
      "bg-[#FFBB33] text-[#1A202E] border-[#FFBB33] font-semibold";

    const inactiveClasses =
      "bg-[#2D3748] text-gray-300 border-[#4A5568] hover:border-gray-400";

    return (
      <button
        onClick={() => handleClick(id)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-10 hide-scrollbar">
        {categories.map((cat) => (
          <CategoryButton key={cat.id} id={cat.id} label={cat.label} />
        ))}
      </div>
    </div>
  );
}
