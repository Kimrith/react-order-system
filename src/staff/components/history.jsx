import React, { useState, useEffect } from 'react';
import { Search, FileText, Printer, TriangleAlert, Check, StickyNote } from 'lucide-react';
import { fetchOrderHistory } from '../api/orders';

export default function History() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('today');

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      let from = null;
      let to = null;
      
      const now = new Date();
      if (dateFilter === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        from = startOfDay.toISOString();
        to = now.toISOString();
      } else if (dateFilter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        from = startOfWeek.toISOString();
        to = now.toISOString();
      } else if (dateFilter === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        from = startOfMonth.toISOString();
        to = now.toISOString();
      }

      const response = await fetchOrderHistory(from, to);
      if (response) {
        // Handle array response or object response based on backend structure
        let fetchedOrders = [];
        let fetchedRevenue = 0;
        let fetchedCount = 0;

        if (response.orders) {
          fetchedOrders = response.orders;
          fetchedCount = response.totalCount || fetchedOrders.length;
          fetchedRevenue = response.totalAllAmount || 0;
        } else if (Array.isArray(response)) {
          fetchedOrders = response;
          fetchedCount = fetchedOrders.length;
          fetchedRevenue = fetchedOrders.filter(o => o.isPaid).reduce((sum, o) => sum + o.totalAmount, 0);
        }
        
        // Sort orders by id descending (newest first)
        fetchedOrders.sort((a, b) => b.id - a.id);
        
        setOrders(fetchedOrders);
        setStats({ totalOrders: fetchedCount, totalRevenue: fetchedRevenue });
      } else {
        setOrders([]);
        setStats({ totalOrders: 0, totalRevenue: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [dateFilter]);

  // Filtering based on search (ID or Table)
  const filteredOrders = orders.filter(order => {
    const orderIdMatch = `ORD-${String(order.id).padStart(3, '0')}`.toLowerCase().includes(searchQuery.toLowerCase());
    const tableMatch = `TABLE ${order.tableId || '?'}`.toLowerCase().includes(searchQuery.toLowerCase());
    return orderIdMatch || tableMatch;
  });

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Pending': return 'NOT YET ACCEPTED';
      case 'Accepted': return 'ACCEPTED';
      case 'Completed': return 'COMPLETED';
      default: return status?.toUpperCase() || 'UNKNOWN';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 shrink-0">
        <div className="flex gap-4">
          <div className="bg-[#1e2336] p-3 rounded-xl border border-[#2a2a35] h-fit">
            <FileText className="text-gray-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Order History</h1>
            <p className="text-gray-500 text-sm">
              View recent transactions and reprint receipts
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#1e2336] border border-[#2a2a35] rounded-xl px-6 py-3 flex flex-col justify-center min-w-[120px]">
            <span className="text-2xl font-black">{stats.totalOrders}</span>
            <span className="text-gray-500 text-[10px] font-bold tracking-wider uppercase mt-1">Orders</span>
          </div>
          <div className="bg-[#1e2336] border border-[#2a2a35] rounded-xl px-6 py-3 flex flex-col justify-center min-w-[140px]">
            <span className="text-2xl font-black">${stats.totalRevenue.toFixed(2)}</span>
            <span className="text-gray-500 text-[10px] font-bold tracking-wider uppercase mt-1">Paid Revenue</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 shrink-0 gap-4">
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Order ID or Table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e2336] border border-transparent focus:border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-12 pr-4 outline-none transition-all text-sm"
          />
        </div>

        <select 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-[#1e2336] border border-[#2a2a35] focus:border-gray-600 text-white text-sm rounded-xl px-4 py-3 outline-none transition-colors appearance-none min-w-[150px]"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden bg-[#1e2336] rounded-2xl flex flex-col border border-[#2a2a35]/50">
        <div className="grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] px-6 py-4 border-b border-[#2a2a35] shrink-0 items-center">
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase">Order Info</div>
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase">Items</div>
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase">Status</div>
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase">Total</div>
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase text-right">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              No orders found for this period.
            </div>
          ) : (
            filteredOrders.map(order => {
              const orderIdString = `ORD-${String(order.id).padStart(3, '0')}`;
              const orderTime = new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const paymentMethodText = order.paymentMethod === 'Cash' ? 'via CASH' : 'via KHQR';

              return (
                <div key={order.id} className="grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] px-6 py-5 border-b border-[#2a2a35] hover:bg-[#232942] transition-colors group items-start">
                  {/* Order Info */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-white text-sm">{orderIdString}</span>
                    <span className="text-gray-400 text-xs">{orderTime}</span>
                    <span className="bg-[#15192b] border border-[#2a2a35] text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase w-max mt-1 tracking-wide">
                      TABLE {order.tableId}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-1">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <span className="text-gray-500 font-bold">{item.quantity}x</span>
                        <span className="text-gray-300">{item.product?.name || 'Unknown Item'}</span>
                      </div>
                    ))}
                    {order.specialInstruction && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <StickyNote size={12} className="text-gray-500 mt-0.5" />
                        <span className="text-gray-400 text-xs italic">{order.specialInstruction}</span>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2 items-start">
                    {order.isPaid ? (
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/20">
                        <Check size={12} strokeWidth={3} />
                        PAID
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/20">
                        <TriangleAlert size={12} strokeWidth={3} />
                        UNPAID
                      </div>
                    )}
                    <span className="bg-[#15192b] border border-[#2a2a35] text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
                      {getStatusDisplay(order.status)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white text-sm">${order.totalAmount?.toFixed(2)}</span>
                    <span className="text-gray-500 text-xs">{paymentMethodText}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <button className="flex items-center gap-2 bg-[#15192b] hover:bg-[#2a2a35] border border-[#2a2a35] hover:border-gray-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                      <Printer size={14} />
                      Print
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
