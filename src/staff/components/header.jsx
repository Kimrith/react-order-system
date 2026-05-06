import React from "react";
import Search from "../../share/search";
import Categories from "./categories";
import Product from "./product";

export default function PosInterface() {
  // Sample Data for the view (Can be moved to state/props)

  return (
    // Main Container (Dark background)
    <div className="min-h-screen bg-[#1A202E] font-sans">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* 1. Header Section */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">☕</span>
              <h1 className="text-white text-3xl font-extrabold tracking-tight">
                Our Menu
              </h1>
            </div>
            <p className="text-gray-400 mt-1">
              Table <span className="text-[#FFBB33] font-bold">A1</span>
            </p>
          </div>

          {/* Cafe POS Badge */}
          <div className="bg-[#2D3748] border border-[#4A5568] px-5 py-2.5 rounded-full shadow-inner">
            <h3 className="text-[#FFBB33] text-sm font-bold uppercase tracking-widest">
              CAFÉ POS
            </h3>
          </div>
        </header>

        {/* 2. Search Bar Section */}
        <Search />
        {/* 3. Category Filter Section (Matches Image structure) */}
        <Categories />
        {/* 4. Product Grid Section */}
        <Product />
      </div>
    </div>
  );
}
