import React from "react";
import Search from "./Search";
import Categories from "../features/components/Categories";
import { Outlet } from "react-router-dom";
import Order from "../features/components/Order";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-[#1A202E] min-h-screen font-sans relative">
      {" "}
      {/* Added relative */}
      <div className="max-w-7xl mx-auto p-6 md:p-8 pb-32">
        {" "}
        {/* Added bottom padding so content isn't hidden behind the bar */}
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

          <div className="bg-[#2D3748] border border-[#4A5568] px-5 py-2.5 rounded-full">
            <h3 className="text-[#FFBB33] text-sm font-bold uppercase tracking-widest">
              CAFÉ POS
            </h3>
          </div>
        </header>
        {/* 2. Search & Categories */}
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Categories />
        {/* 3. Product List / Nested Routes */}
        <Outlet context={{ searchQuery }} />
      </div>
      {/* 4. Order Section (Moved outside the padding container) */}
      <div className="justify-center text-center">
        <Link to="/cart">
          <Order />
        </Link>
      </div>
    </div>
  );
}
