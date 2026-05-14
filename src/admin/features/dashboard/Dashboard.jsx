import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data
const dailyRevenueData = [
  { name: 'Sun, Mar 8', cash: 85, khqr: 95 },
  { name: 'Mon, Mar 9', cash: 65, khqr: 180 },
  { name: 'Tue, Mar 10', cash: 45, khqr: 75 },
  { name: 'Wed, Mar 11', cash: 35, khqr: 155 },
  { name: 'Thu, Mar 12', cash: 110, khqr: 85 },
  { name: 'Fri, Mar 13', cash: 75, khqr: 85 },
  { name: 'Sat, Mar 14', cash: 75, khqr: 95 },
];

const topProductsData = [
  { name: 'Coca-Cola', value: 5, color: '#F97316' },
  { name: 'Iced Coffee', value: 2, color: '#10B981' },
  { name: 'Chicken Fried Rice', value: 2, color: '#3B82F6' },
  { name: 'Thai Milk Tea', value: 2, color: '#EC4899' },
  { name: 'Beef Burger', value: 1, color: '#8B5CF6' },
  { name: 'Crispy Spring Rolls', value: 1, color: '#F59E0B' },
  { name: 'Grilled Salmon', value: 1, color: '#06B6D4' },
  { name: 'Fresh Orange Juice', value: 1, color: '#EF4444' },
];

const StatCard = ({ title, value, icon, subtitle, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1C2536] p-6 rounded-2xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 shadow-lg"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-opacity-10 ${color.bg}`}>
        {React.cloneElement(icon, { className: color.text, size: 24 })}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-2">{subtitle}</p>}
    </div>
  </motion.div>
);

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sales Analytics</h1>
          <p className="text-gray-400 mt-1">Revenue breakdown by payment method</p>
        </div>
        <div className="flex bg-[#1C2536] p-1 rounded-xl border border-gray-800">
          <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-semibold shadow-lg">7 Days</button>
          <button className="px-4 py-2 text-gray-400 text-sm font-medium hover:text-gray-200">14 Days</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue (7D)"
          value="$1186"
          icon={<DollarSign />}
          color={{ bg: 'bg-yellow-500', text: 'text-yellow-500' }}
        />
        <StatCard
          title="Total Orders"
          value="5"
          icon={<ShoppingBag />}
          color={{ bg: 'bg-emerald-500', text: 'text-emerald-500' }}
        />
        <StatCard
          title="Avg Order Value"
          value="$11.40"
          icon={<TrendingUp />}
          color={{ bg: 'bg-blue-500', text: 'text-blue-500' }}
        />
        <StatCard
          title="KHQR Revenue"
          value="$726"
          icon={<CreditCard />}
          color={{ bg: 'bg-purple-500', text: 'text-purple-500' }}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Chart */}
        <div className="lg:col-span-2 bg-[#1C2536] p-8 rounded-2xl border border-gray-800/50 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Daily Revenue — Cash vs KHQR</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                <span className="text-sm text-gray-400">Cash</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                <span className="text-sm text-gray-400">KHQR</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{
                    backgroundColor: '#1C2536',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="cash" fill="#F97316" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="khqr" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Split */}
        <div className="bg-[#1C2536] p-8 rounded-2xl border border-gray-800/50 shadow-xl flex flex-col justify-between">
          <h2 className="text-xl font-bold text-white mb-6">Revenue Split</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 font-medium">Cash</span>
                <span className="text-white font-bold">$459.78</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '38%' }}
                  transition={{ duration: 1 }}
                  className="h-full bg-[#F97316]"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 font-medium">KHQR</span>
                <span className="text-white font-bold">$725.88</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '62%' }}
                  transition={{ duration: 1 }}
                  className="h-full bg-[#10B981]"
                />
              </div>
            </div>
          </div>
          <div className="mt-10 pt-10 border-t border-gray-800">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F97316]">34.8%</div>
                <div className="text-xs text-gray-500 uppercase">Cash</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10B981]">65.2%</div>
                <div className="text-xs text-gray-500 uppercase">KHQR</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#1C2536] p-8 rounded-2xl border border-gray-800/50 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Top Products</h2>
            <p className="text-gray-500 text-sm">Based on all 5 orders</p>
          </div>
          <div className="flex bg-[#0B0E14] p-1 rounded-lg border border-gray-800">
            <button className="px-3 py-1 bg-yellow-500 text-black rounded text-xs font-bold">Qty</button>
            <button className="px-3 py-1 text-gray-400 text-xs font-bold">Revenue</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Horizontal Bar Chart for Products */}
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topProductsData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 13 }}
                  width={150}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{
                    backgroundColor: '#1C2536',
                    border: '1px solid #334155',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Product List */}
          <div className="space-y-4">
            {topProductsData.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#0B0E14] transition-colors border border-transparent hover:border-gray-800/50">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-bold text-sm w-6">#{index + 1}</span>
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                    {/* Simplified icon representation */}
                    <div className="w-6 h-6 rounded bg-opacity-20 flex items-center justify-center" style={{ backgroundColor: product.color }}>
                      <ShoppingBag size={14} style={{ color: product.color }} />
                    </div>
                  </div>
                  <span className="text-white font-medium">{product.name}</span>
                </div>
                <div className="text-gray-400 font-bold">x{product.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
