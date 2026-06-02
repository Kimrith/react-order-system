import React from 'react';
import { ShoppingBag, FilePlus, Package, LayoutGrid, LogOut } from 'lucide-react';

export default function Navbar({ activeTab = 'Orders', setActiveTab }) {
  const menuItems = [
    { name: 'Orders', icon: ShoppingBag },
    { name: 'Create Order', icon: FilePlus },
    { name: 'Products', icon: Package },
    { name: 'History', icon: LayoutGrid },
  ];

  return (
    <aside className="w-[280px] h-screen bg-[#1e2336] flex flex-col justify-between py-6 px-4 shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            ST
          </div>
          <span className="text-white text-xl font-bold tracking-wide">StaffDash</span>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab && setActiveTab(item.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left font-medium text-base ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-500' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <button className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors mt-auto text-base">
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
