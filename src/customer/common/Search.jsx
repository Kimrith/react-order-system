import React from "react";

export default function Search({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {/* Minimal Search Icon (Can use an SVG or '🔍') */}
        <span className="text-gray-500 text-lg">🔍</span>
      </div>
      <input
        type="search"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Updates parent state
        className="w-full bg-[#2D3748] border border-[#4A5568] text-white
         rounded-full py-3.5 pl-12 pr-4 shadow-inner placeholder-gray-500 
         focus:ring-2 focus:ring-[#FFBB33] focus:border-[#FFBB33] outline-none"
      />
    </div>
  );
}
