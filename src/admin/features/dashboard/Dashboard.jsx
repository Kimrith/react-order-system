import React, { useState, useEffect } from "react";
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
  Pie,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchOrderAnalytics } from "../api/orderApi";
import { fetchTopProducts } from "../api/productApi";


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
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
        {title}
      </p>
      {subtitle && <p className="text-gray-500 text-xs mt-2">{subtitle}</p>}
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [days, setDays] = useState(7);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("qty");
  const [topProducts, setTopProducts] = useState([]);
  const [topProductsLoading, setTopProductsLoading] = useState(true);
  const [topProductsError, setTopProductsError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchOrderAnalytics(days)
      .then((data) => {
        if (active) {
          setAnalyticsData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [days]);

  useEffect(() => {
    let active = true;
    setTopProductsLoading(true);
    setTopProductsError(null);
    fetchTopProducts(5, sortBy)
      .then((data) => {
        if (active) {
          const colors = ["#F97316", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"];
          const formatted = data.map((item, idx) => ({
            ...item,
            color: colors[idx % colors.length],
          }));
          setTopProducts(formatted);
          setTopProductsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setTopProductsError(err.message);
          setTopProductsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [sortBy]);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Sales Analytics
          </h1>
          <p className="text-gray-400 mt-1">
            Revenue breakdown by payment method
          </p>
        </div>
        <div className="flex bg-[#1C2536] p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setDays(7)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${days === 7
              ? "bg-[#4F46E5] text-white shadow-lg"
              : "text-gray-400 hover:text-gray-200"
              }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDays(14)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${days === 14
              ? "bg-[#4F46E5] text-white shadow-lg"
              : "text-gray-400 hover:text-gray-200"
              }`}
          >
            14 Days
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title={`Revenue (${days}D)`}
          value={loading ? "..." : `$${analyticsData?.totalRevenue ?? 0}`}
          icon={<DollarSign />}
          color={{ bg: "bg-yellow-500", text: "text-yellow-500" }}
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : `${analyticsData?.totalOrders ?? 0}`}
          icon={<ShoppingBag />}
          color={{ bg: "bg-emerald-500", text: "text-emerald-500" }}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-[#1C2536] p-8 rounded-2xl border border-gray-800/50 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">
              Daily Revenue Order Rate
            </h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                <span className="text-sm text-gray-400">Total Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                <span className="text-sm text-gray-400">Total Amount ($)</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                Loading analytics data...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-500">
                Error loading data: {error}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData?.dailyRates || []}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#334155"
                  />
                  <XAxis
                    dataKey="dateLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "#1C2536",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="totalOrder"
                    name="Total Orders"
                    fill="#F97316"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="totalAmount"
                    name="Total Amount ($)"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>


      </div>

      {/* Bottom Section */}
      <div className="bg-[#1C2536] p-8 rounded-2xl border border-gray-800/50 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Top Products</h2>
            <p className="text-gray-500 text-sm">
              Based on all {analyticsData?.totalOrders ?? 0} orders
            </p>
          </div>
          <div className="flex bg-[#0B0E14] p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setSortBy("qty")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${sortBy === "qty"
                ? "bg-yellow-500 text-black"
                : "text-gray-400 hover:text-gray-200"
                }`}
            >
              Qty
            </button>
            <button
              onClick={() => setSortBy("revenue")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${sortBy === "revenue"
                ? "bg-yellow-500 text-black"
                : "text-gray-400 hover:text-gray-200"
                }`}
            >
              Revenue
            </button>
          </div>
        </div>

        {topProductsLoading ? (
          <div className="flex items-center justify-center h-[400px] text-gray-400">
            Loading top products...
          </div>
        ) : topProductsError ? (
          <div className="flex items-center justify-center h-[400px] text-red-500">
            Error loading top products: {topProductsError}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Horizontal Bar Chart for Products */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topProducts}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 13 }}
                    width={150}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "#1C2536",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="displayValue" radius={[0, 4, 4, 0]} barSize={24}>
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Product List */}
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id || index}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#0B0E14] transition-colors border border-transparent hover:border-gray-800/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-bold text-sm w-6">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                      {product.productImg ? (
                        <img
                          src={`${import.meta.env.VITE_IMAGE_URL}${product.productImg}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-6 h-6 rounded bg-opacity-20 flex items-center justify-center"
                          style={{ backgroundColor: product.color }}
                        >
                          <ShoppingBag size={14} style={{ color: product.color }} />
                        </div>
                      )}
                    </div>
                    <span className="text-white font-medium">{product.name}</span>
                  </div>
                  <div className="text-gray-400 font-bold">
                    {sortBy === "qty" ? `x${product.displayValue}` : `$${product.displayValue.toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
