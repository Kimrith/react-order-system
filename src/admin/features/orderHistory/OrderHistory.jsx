import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Printer,
  Clock,
  ChevronDown,
  X,
  Check,
  AlertTriangle,
  Trash2,
  Loader2,
  RefreshCw
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7293/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(0); // 0=AllTime, 1=Today, 2=Last7Days
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Debounce timer ref
  const debounceRef = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch orders from API
  const fetchOrders = useCallback(async (dateFilterVal, searchTermVal) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('DateFilter', dateFilterVal.toString());
      if (searchTermVal.trim()) {
        params.set('SearchTerm', searchTermVal.trim());
      }
      const res = await fetch(`${BASE_URL}/Orders/admin/history?${params.toString()}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load order history');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch & refetch on dateFilter change
  useEffect(() => {
    fetchOrders(dateFilter, searchTerm);
  }, [dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchOrders(dateFilter, value);
    }, 400);
  };

  // Format Helper for dates (e.g. Jun 02, 10:34 AM)
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

  // Date filter label map
  const dateFilterLabels = {
    0: 'All Time',
    1: 'Today',
    2: 'Last 7 Days'
  };

  // Print Receipt handler
  const handlePrintReceipt = (order, e) => {
    if (e) e.stopPropagation();

    const itemsHtml = (order.items || []).map(item => `
      <div class="receipt-row">
        <span>${item.qty || item.quantity || 1}x ${item.name || item.productName || 'Item'}</span>
        <span>$${((item.qty || item.quantity || 1) * (item.price || item.unitPrice || 0)).toFixed(2)}</span>
      </div>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.orderId}</title>
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
            <p>Table ${order.tableId}</p>
          </div>
          <div class="info-row">
            <span>Order ID:</span>
            <span>${order.orderId}</span>
          </div>
          <div class="info-row">
            <span>Date:</span>
            <span>${new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span>Payment Method:</span>
            <span>${order.paymentMethod || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span>Payment Status:</span>
            <span>${order.paymentStatus}</span>
          </div>
          <div class="divider"></div>
          
          ${itemsHtml || '<div class="info-row"><span>No item details available</span></div>'}
          
          <div class="divider"></div>
          <div class="total-row">
            <span>TOTAL DUE:</span>
            <span>$${(order.totalAmount || 0).toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <div class="footer">
            <p>Thank you for choosing us!</p>
            <p>Internal Record ID: ${order.orderId.toLowerCase()}</p>
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
    showToast(`Receipt for ${order.orderId} sent to printer.`);
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

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock size={22} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-sans">Order History</h1>
          </div>
          <p className="text-gray-400 mt-1.5 ml-1">
            Browse and search completed order records
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-[#1C2536]/40 backdrop-blur-md rounded-2xl border border-gray-800/60 p-5 flex flex-col md:flex-row justify-between gap-4 items-center">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Order ID or Table ID..."
            className="w-full pl-11 pr-4 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-sans text-sm placeholder:text-gray-600"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          {/* Date Selector dropdown */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(Number(e.target.value))}
              className="appearance-none pl-4 pr-10 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-sans text-sm cursor-pointer select-none"
            >
              <option value={0}>All Time</option>
              <option value={1}>Today</option>
              <option value={2}>Last 7 Days</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Refresh button */}
          <button
            onClick={() => fetchOrders(dateFilter, searchTerm)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-[#131924] text-gray-300 border border-gray-800 rounded-xl hover:border-blue-500 hover:text-blue-400 focus:outline-none transition-all font-sans text-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Table Card Layout */}
      <div className="bg-[#1C2536]/30 border border-gray-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-800/70 bg-[#131924]/40">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Order Info</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono text-center">Total</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={32} />
                      <span className="text-gray-500 text-sm">Loading order history...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle className="text-red-400" size={32} />
                      <span className="text-red-400 text-sm">{error}</span>
                      <button
                        onClick={() => fetchOrders(dateFilter, searchTerm)}
                        className="mt-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-500/20 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-gray-500 text-sm">
                    <AlertTriangle className="mx-auto mb-3 text-gray-600" size={32} />
                    No matching order history found.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {orders.map((order) => (
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
                          {order.orderId}
                        </div>
                        <div className="text-gray-400 text-xs font-medium">
                          {formatOrderDate(order.createdAt)}
                        </div>
                        <div>
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-blue-950/40 border border-blue-900/50 text-blue-400">
                            Table {order.tableId}
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-5 space-y-2">
                        {/* Payment Status Badge */}
                        <div>
                          {order.paymentStatus === 'Paid' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold rounded-full tracking-wide">
                              ✓ PAID
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-extrabold rounded-full tracking-wide">
                              ▲ UNPAID
                            </span>
                          )}
                        </div>

                        {/* Order Status Badge */}
                        <div>
                          <span className={`inline-flex px-3 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${order.status === 'Completed'
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                              : order.status === 'Accepted'
                                ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40'
                                : order.status === 'Pending'
                                  ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40'
                                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/30'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                      </td>

                      {/* Total Column */}
                      <td className="px-6 py-5 text-center space-y-1">
                        <div className="text-white font-extrabold text-[15px]">
                          ${(order.totalAmount || 0).toFixed(2)}
                        </div>
                        {order.paymentMethod && (
                          <div className="text-gray-500 text-[11px] font-medium font-mono uppercase tracking-wide">
                            via {order.paymentMethod}
                          </div>
                        )}
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
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
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
                      <span className="text-gray-500 font-normal text-xs font-mono">({selectedOrder.orderId})</span>
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      Placed on {formatOrderDate(selectedOrder.createdAt)}
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
                  {/* Summary card */}
                  <div className="bg-[#131924]/60 border border-gray-800/80 p-5 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Table</div>
                      <div className="text-xl font-extrabold text-white mt-1">Table {selectedOrder.tableId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-bold text-right">Method</div>
                      <div className="text-sm font-extrabold text-blue-400 mt-1 text-right bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                        {selectedOrder.paymentMethod || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Status info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Status</h4>

                    <div className="grid grid-cols-2 gap-3 bg-[#131924]/40 border border-gray-800/50 p-4 rounded-2xl">
                      {/* Payment Status */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase block">Payment</span>
                        <div className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold ${selectedOrder.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                          }`}>
                          {selectedOrder.paymentStatus === 'Paid' ? <Check size={14} /> : <AlertTriangle size={14} />}
                          {selectedOrder.paymentStatus}
                        </div>
                      </div>

                      {/* Order State */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase block">Order State</span>
                        <div className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold ${selectedOrder.status === 'Completed'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : selectedOrder.status === 'Accepted'
                              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                              : selectedOrder.status === 'Pending'
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                : 'bg-gray-800/50 border border-gray-700/30 text-gray-400'
                          }`}>
                          {selectedOrder.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items breakdown list */}
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Items</h4>
                        <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">
                          {selectedOrder.items.reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0)} Items
                        </span>
                      </div>

                      <div className="bg-[#131924]/40 border border-gray-800/40 rounded-2xl divide-y divide-gray-800/40">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-xs text-blue-400 font-mono">
                                x{item.qty || item.quantity || 1}
                              </span>
                              <div>
                                <div className="text-sm font-bold text-white">{item.name || item.productName || 'Item'}</div>
                                <div className="text-[11px] text-gray-500 font-medium">${(item.price || item.unitPrice || 0).toFixed(2)} each</div>
                              </div>
                            </div>
                            <div className="text-sm font-extrabold text-white">
                              ${((item.qty || item.quantity || 1) * (item.price || item.unitPrice || 0)).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Financial summary */}
                  <div className="bg-[#131924]/60 border border-gray-800/80 p-5 rounded-2xl space-y-3">
                    <div className="border-b border-gray-800/80 pb-3 flex justify-between text-base font-extrabold text-white">
                      <span>Total Amount</span>
                      <span className="text-blue-400">${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Print Action Footer */}
                <div className="p-6 border-t border-gray-800 bg-[#131924]/40 flex gap-3">
                  <button
                    onClick={() => handlePrintReceipt(selectedOrder)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1E65FF] hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-98"
                  >
                    <Printer size={16} />
                    Print Receipt
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
