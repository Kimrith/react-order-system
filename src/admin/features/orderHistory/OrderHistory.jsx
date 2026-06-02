import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Trash2,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  X,
  Check
} from 'lucide-react';

// Pre-seeded transactions exactly matching the user's mockup image
const SEED_ORDERS = [
  {
    id: 'ORD-005',
    date: '2026-03-14T11:03:00Z',
    table: 'A5',
    items: [
      { name: 'Pad Thai Noodles', qty: 1, price: 5.00 },
      { name: 'Mango Sticky Rice', qty: 1, price: 3.50 },
      { name: 'Coca-Cola', qty: 3, price: 1.50 }
    ],
    status: 'NOT YET ACCEPTED', // order state
    paymentStatus: 'UNPAID', // payment state
    paymentMethod: 'CASH',
    total: 13.00
  },
  {
    id: 'ORD-001',
    date: '2026-03-14T11:00:00Z',
    table: 'A1',
    items: [
      { name: 'Coca-Cola', qty: 2, price: 1.50 },
      { name: 'Beef Burger', qty: 1, price: 6.50 }
    ],
    status: 'NOT YET ACCEPTED',
    paymentStatus: 'UNPAID',
    paymentMethod: 'CASH',
    total: 9.50
  },
  {
    id: 'ORD-002',
    date: '2026-03-14T10:53:00Z',
    table: 'B3',
    items: [
      { name: 'Iced Coffee', qty: 2, price: 2.50 },
      { name: 'Crispy Spring Rolls', qty: 1, price: 3.00 }
    ],
    status: 'ACCEPTED',
    paymentStatus: 'PAID',
    paymentMethod: 'KHQR',
    total: 8.00
  },
  {
    id: 'ORD-003',
    date: '2026-03-14T10:25:00Z',
    table: 'A3',
    items: [
      { name: 'Grilled Salmon', qty: 1, price: 9.00 },
      { name: 'Fresh Orange Juice', qty: 1, price: 3.00 }
    ],
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'KHQR',
    total: 12.00
  },
  {
    id: 'ORD-004',
    date: '2026-03-14T10:05:00Z',
    table: 'B2',
    items: [
      { name: 'Chicken Fried Rice', qty: 2, price: 4.50 },
      { name: 'Thai Milk Tea', qty: 2, price: 2.75 }
    ],
    status: 'COMPLETED',
    paymentStatus: 'UNPAID',
    paymentMethod: 'CASH',
    total: 14.50
  }
];

export default function OrderHistory() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('coffee_orders');
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('7_DAYS');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('coffee_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stats Calculations
  const stats = useMemo(() => {
    // We base stats on ALL orders (or you can do filtered, but mockup shows constant 5 orders, 20$ paid revenue)
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
    const totalPaidRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      totalCount: orders.length,
      paidRevenue: totalPaidRevenue.toFixed(2)
    };
  }, [orders]);

  // Format Helper for dates matching the mockup (e.g. Mar 14, 11:03 AM)
  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search Query Match (Order ID or Table)
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Status Match
      let matchesStatus = true;
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'PAID') matchesStatus = order.paymentStatus === 'PAID';
        else if (statusFilter === 'UNPAID') matchesStatus = order.paymentStatus === 'UNPAID';
        else matchesStatus = order.status === statusFilter;
      }

      // 3. Date Range Match (Simulated for this demo dataset)
      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        const today = new Date().toDateString();
        matchesDate = new Date(order.date).toDateString() === today;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Print Receipt handler
  const handlePrintReceipt = (order, e) => {
    if (e) e.stopPropagation();
    
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.items.map(item => `
      <div class="receipt-row">
        <span>${item.qty}x ${item.name}</span>
        <span>$${(item.qty * item.price).toFixed(2)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              padding: 20px;
              color: #000;
              background-color: #fff;
              max-width: 320px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 20px;
              margin: 0;
              font-weight: bold;
            }
            .header p {
              font-size: 12px;
              margin: 4px 0;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 12px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 4px 0;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              margin: 6px 0;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              font-weight: bold;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 25px;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CAFÉ POS SYSTEM</h1>
            <p>Admin Order Copy</p>
            <p>Table ${order.table}</p>
          </div>
          <div class="info-row">
            <span>Order ID:</span>
            <span>${order.id}</span>
          </div>
          <div class="info-row">
            <span>Date:</span>
            <span>${new Date(order.date).toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span>Payment Method:</span>
            <span>${order.paymentMethod}</span>
          </div>
          <div class="info-row">
            <span>Payment Status:</span>
            <span>${order.paymentStatus}</span>
          </div>
          <div class="divider"></div>
          
          ${itemsHtml}
          
          <div class="divider"></div>
          <div class="total-row">
            <span>TOTAL DUE:</span>
            <span>$${order.total.toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <div class="footer">
            <p>Thank you for choosing us!</p>
            <p>Internal Record ID: ${order.id.toLowerCase()}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast(`Receipt for ${order.id} sent to printer.`);
  };

  // State Transition handlers
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
    showToast(`Order status updated to ${newStatus}`);
  };

  const handleUpdatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o));
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, paymentStatus: newPaymentStatus } : prev);
    showToast(`Payment status updated to ${newPaymentStatus}`);
  };

  const handleDeleteClick = (orderId, e) => {
    if (e) e.stopPropagation();
    setDeletingOrderId(orderId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setOrders(prev => prev.filter(o => o.id !== deletingOrderId));
    if (selectedOrder && selectedOrder.id === deletingOrderId) {
      setSelectedOrder(null);
    }
    showToast(`Transaction ${deletingOrderId} deleted successfully.`);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-gray-900 border border-blue-500/30 text-blue-400 font-semibold rounded-xl shadow-2xl shadow-blue-950/20 backdrop-blur-md"
          >
            <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Check size={14} className="text-blue-400" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with Stats Cards integrated dynamically */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock size={22} className="animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-sans">All Transactions</h1>
          </div>
          <p className="text-gray-400 mt-1.5 ml-1">
            Admin view: Extended history and filtering
          </p>
        </div>

        {/* Small premium stats cards aligned to top right */}
        <div className="flex gap-4 w-full md:w-auto">
          {/* Orders count */}
          <div className="bg-[#1C2536] border border-gray-800 px-6 py-4 rounded-xl flex-1 md:flex-initial md:w-36 text-center shadow-lg">
            <div className="text-2xl font-extrabold text-white tracking-tight">{stats.totalCount}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Orders</div>
          </div>
          {/* Paid revenue */}
          <div className="bg-[#1C2536] border border-gray-800 px-6 py-4 rounded-xl flex-1 md:flex-initial md:w-44 text-center shadow-lg">
            <div className="text-2xl font-extrabold text-white tracking-tight">${stats.paidRevenue}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Paid Revenue</div>
          </div>
        </div>
      </div>

      {/* Filter toolbar perfectly matching mock search block */}
      <div className="bg-[#1C2536]/40 backdrop-blur-md rounded-2xl border border-gray-800/60 p-5 flex flex-col md:flex-row justify-between gap-4 items-center">
        {/* Search input with left icon */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID or Table..."
            className="w-full pl-11 pr-4 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-sans text-sm placeholder:text-gray-600"
          />
        </div>

        {/* Action filter pills matching style */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          {/* Status Select dropdown styled beautifully */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-sans text-sm cursor-pointer select-none"
            >
              <option value="ALL">All Status</option>
              <option value="PAID">Paid Only</option>
              <option value="UNPAID">Unpaid Only</option>
              <option value="NOT YET ACCEPTED">Not Yet Accepted</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Date Selector dropdown styled beautifully */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-sans text-sm cursor-pointer select-none"
            >
              <option value="7_DAYS">Last 7 Days</option>
              <option value="TODAY">Today</option>
              <option value="ALL">All Time</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table Card Layout */}
      <div className="bg-[#1C2536]/30 border border-gray-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-800/70 bg-[#131924]/40">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Order Info</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Items</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono text-center">Total</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              <AnimatePresence>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-gray-500 text-sm">
                      <AlertTriangle className="mx-auto mb-3 text-gray-600" size={32} />
                      No matching transaction history found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-[#1C2536]/20 transition-all duration-150 cursor-pointer group"
                    >
                      {/* Order Info Column */}
                      <td className="px-6 py-5 space-y-1.5">
                        <div className="text-white font-bold text-[15px] group-hover:text-blue-400 transition-colors">
                          {order.id}
                        </div>
                        <div className="text-gray-400 text-xs font-medium">
                          {formatOrderDate(order.date)}
                        </div>
                        <div>
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-blue-950/40 border border-blue-900/50 text-blue-400">
                            Table ${order.table}
                          </span>
                        </div>
                      </td>

                      {/* Items Column */}
                      <td className="px-6 py-5 max-w-[280px]">
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
                              <span className="text-gray-500 text-xs font-mono font-bold w-4">
                                {item.qty}x
                              </span>
                              <span className="truncate">{item.name}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-5 space-y-2">
                        {/* Stacked Payment Badge + Order State Pill */}
                        <div>
                          {order.paymentStatus === 'PAID' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold rounded-full tracking-wide">
                              ✓ PAID
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-extrabold rounded-full tracking-wide">
                              ▲ UNPAID
                            </span>
                          )}
                        </div>

                        <div>
                          <span className={`inline-flex px-3 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            order.status === 'COMPLETED' 
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                              : order.status === 'ACCEPTED'
                              ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40'
                              : 'bg-gray-800/50 text-gray-400 border border-gray-700/30'
                          }`}>
                            {order.status === 'NOT YET ACCEPTED' ? 'NOT YET ACCEPTED' : order.status}
                          </span>
                        </div>
                      </td>

                      {/* Total Column */}
                      <td className="px-6 py-5 text-center space-y-1">
                        <div className="text-white font-extrabold text-[15px]">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-gray-500 text-[11px] font-medium font-mono uppercase tracking-wide">
                          via ${order.paymentMethod}
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handlePrintReceipt(order, e)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2533] hover:bg-[#2C374D] border border-gray-800 hover:border-gray-700 text-gray-300 rounded-lg text-xs font-bold transition-all active:scale-95 whitespace-nowrap shadow-sm"
                            title="Print receipt ticket"
                          >
                            <Printer size={12} />
                            Print
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(order.id, e)}
                            className="p-1.5 bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete record"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Slide-Over Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-40 overflow-hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-[#070A0F]/80 backdrop-blur-md"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-[#1C2536] border-l border-gray-800 shadow-2xl flex flex-col justify-between"
              >
                {/* Header detail */}
                <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-[#131924]/50">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <span className="text-blue-500">Order details</span>
                      <span className="text-gray-500 font-normal text-xs font-mono">({selectedOrder.id})</span>
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      Placed on {formatOrderDate(selectedOrder.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 bg-[#131924] hover:bg-[#2C374D] border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-xl transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body detail scroll container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Summary card Table */}
                  <div className="bg-[#131924]/60 border border-gray-800/80 p-5 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Physical Table</div>
                      <div className="text-xl font-extrabold text-white mt-1">Table {selectedOrder.table}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-bold text-right">Method</div>
                      <div className="text-sm font-extrabold text-blue-400 mt-1 text-right bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                        {selectedOrder.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Quick Payment and Order Status Toggles */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Management Actions</h4>
                    
                    <div className="grid grid-cols-2 gap-3 bg-[#131924]/40 border border-gray-800/50 p-4 rounded-2xl">
                      {/* Payment Status toggle */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase block">Payment Status</span>
                        {selectedOrder.paymentStatus === 'PAID' ? (
                          <button
                            onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'UNPAID')}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500/10 hover:bg-red-500/10 hover:text-red-400 border border-emerald-500/20 hover:border-red-500/20 text-emerald-400 rounded-xl text-xs font-bold transition-all"
                            title="Click to toggle status to unpaid"
                          >
                            <Check size={14} />
                            Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'PAID')}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-rose-500/10 hover:bg-emerald-500/10 hover:text-emerald-400 border border-rose-500/20 hover:border-emerald-500/20 text-rose-400 rounded-xl text-xs font-bold transition-all"
                            title="Click to mark as paid"
                          >
                            <AlertTriangle size={14} />
                            Unpaid
                          </button>
                        )}
                      </div>

                      {/* Order State transitions */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase block">Order State</span>
                        <div className="relative">
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 bg-[#131924] border border-gray-800 text-white rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                          >
                            <option value="NOT YET ACCEPTED">Not Yet Accepted</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items breakdown list */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Items</h4>
                      <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">
                        {selectedOrder.items.reduce((sum, i) => sum + i.qty, 0)} Items
                      </span>
                    </div>

                    <div className="bg-[#131924]/40 border border-gray-800/40 rounded-2xl divide-y divide-gray-800/40">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-xs text-blue-400 font-mono">
                              x{item.qty}
                            </span>
                            <div>
                              <div className="text-sm font-bold text-white">{item.name}</div>
                              <div className="text-[11px] text-gray-500 font-medium">${item.price.toFixed(2)} each</div>
                            </div>
                          </div>
                          <div className="text-sm font-extrabold text-white">
                            ${(item.qty * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial summary */}
                  <div className="bg-[#131924]/60 border border-gray-800/80 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                      <span>Subtotal</span>
                      <span>${(selectedOrder.total * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                      <span>Service Tax (10%)</span>
                      <span>${(selectedOrder.total * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-800/80 my-2 pt-3 flex justify-between text-base font-extrabold text-white">
                      <span>Grand Total</span>
                      <span className="text-blue-400">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Print and Delete Actions Footer */}
                <div className="p-6 border-t border-gray-800 bg-[#131924]/40 flex gap-3">
                  <button
                    onClick={() => handlePrintReceipt(selectedOrder)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1E65FF] hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-98"
                  >
                    <Printer size={16} />
                    Print Receipt
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(selectedOrder.id, e)}
                    className="p-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-colors border border-red-500/20 hover:border-transparent"
                    title="Delete record"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-[#070A0F]/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#1C2536] border border-gray-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center gap-3 text-red-500">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle size={22} />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">Delete Transaction</h3>
              </div>

              <p className="text-gray-400 text-[15px] leading-relaxed">
                Are you sure you want to delete the record of transaction **{deletingOrderId}**? 
                This action is permanent and will remove it from the historical sales database and local store.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 font-bold rounded-xl transition-colors border border-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold rounded-xl transition-all shadow-lg active:scale-98"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
