import React, { useState, useEffect } from "react";
import Search from "./Search";
import Categories from "../features/components/Categories";
import { Outlet, Link, useParams } from "react-router-dom"; // 1. Added useParams
import Order from "../features/components/Order";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Extract tableId directly from the URL path parameter
  const { tableId } = useParams();

  const [tableDisplay, setTableDisplay] = useState("Loading...");

  // 3. Update tableDisplay whenever the URL param changes
  useEffect(() => {
    if (tableId) {
      setTableDisplay(tableId);
    } else {
      setTableDisplay("Unknown");
    }
  }, [tableId]);

  return (
    <div className="bg-[#1A202E] min-h-screen font-sans relative">
      <div className="max-w-7xl mx-auto p-6 md:p-8 pb-32">

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
              {/* Displays the dynamic table number */}
              Table <span className="text-[#FFBB33] font-bold">{tableDisplay}</span>
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
        {/* Added tableDisplay to context so child components (like checkout) can read the table number */}
        <Outlet context={{ searchQuery, tableId: tableDisplay }} />
      </div>

      {/* 4. Order Section */}
      <div className="justify-center text-center">
        {/* <Link to={`/TableQr/${tableId}/cart`}> */}
        <Order />
        {/* </Link> */}
      </div>
    </div>
  );
}