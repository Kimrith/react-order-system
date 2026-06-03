import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  TableProperties,
  History,
  Percent,
  LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={22} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={22} /> },
    { name: 'Table Managements', path: '/admin/tables', icon: <TableProperties size={22} /> },
    { name: 'History', path: '/admin/history', icon: <History size={22} /> },
    { name: 'Discount Manage', path: '/admin/discounts', icon: <Percent size={22} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0B0E14] text-gray-300 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1C2536] flex flex-col justify-between py-8 px-6 border-r border-gray-800/50">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="bg-[#1E65FF] w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/20">
              AD
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AdminDash</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'text-[#1E65FF] font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                  }`
                }
              >
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="text-[15px]">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="px-4">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg active:scale-95">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0B0E14]">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;