import { motion } from 'framer-motion';
import { X, Printer, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  // Normalize order fields to handle different shapes (Live Orders vs History logs)
  const orderId = order.id 
    ? (typeof order.id === 'number' ? `ORD-${String(order.id).padStart(3, '0')}` : order.id) 
    : 'ORD-000';
  
  const tableName = order.table || (order.tableId ? `Table ${order.tableId}` : 'N/A');
  const dateString = order.orderDate || order.date || new Date().toISOString();
  
  const rawDate = new Date(dateString);
  const formattedDate = rawDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + ' ' + rawDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const paymentMethod = order.paymentMethod || 'CASH';
  
  // Support both isPaid (boolean) and paymentStatus (string)
  const isPaid = order.paymentStatus?.toUpperCase() === 'PAID' || order.isPaid === true;

  const items = order.items || [];
  const subtotal = order.total ?? order.totalAmount ?? order.totalAllAmount ?? 0;
  
  // Calculate subtotal, tax, grand total
  const taxAmount = subtotal * 0.1;
  const grandTotal = subtotal + taxAmount;

  // Print helper reusing and refining the admin's print design
  const handlePrint = (e) => {
    if (e) e.stopPropagation();
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print receipts.");
      return;
    }

    const itemsHtml = items.map(item => {
      const name = item.name || item.product?.name || 'Item';
      const qty = item.qty || item.quantity || 1;
      const price = item.price ?? item.product?.price ?? 0;
      return `
        <div class="receipt-row">
          <span>${qty}x ${name}</span>
          <span>$${(qty * price).toFixed(2)}</span>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${orderId}</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              padding: 20px;
              color: #000;
              background-color: #fff;
              max-width: 300px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
            }
            .header h1 {
              font-size: 18px;
              margin: 0;
              font-weight: bold;
              letter-spacing: 1px;
            }
            .header p {
              font-size: 11px;
              margin: 3px 0;
              color: #333;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              margin: 3px 0;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 5px 0;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              font-weight: bold;
              margin-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
            }
            .barcode {
              font-family: 'Libre Barcode 39', monospace;
              font-size: 32px;
              margin-top: 10px;
              letter-spacing: 2px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>COFFEE SYSTEM</h1>
            <p>Receipt & Order Ticket</p>
            <p>${tableName}</p>
          </div>
          <div class="info-row">
            <span>Order ID:</span>
            <span>${orderId}</span>
          </div>
          <div class="info-row">
            <span>Date:</span>
            <span>${formattedDate}</span>
          </div>
          <div class="info-row">
            <span>Payment:</span>
            <span>${paymentMethod} (${isPaid ? 'PAID' : 'UNPAID'})</span>
          </div>
          <div class="divider"></div>
          
          ${itemsHtml}
          
          <div class="divider"></div>
          <div class="info-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="info-row">
            <span>VAT (10%):</span>
            <span>$${taxAmount.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>TOTAL DUE:</span>
            <span>$${grandTotal.toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <div class="footer">
            <p>Thank you for your visit!</p>
            <p style="margin-top:5px; font-weight:bold;">* * * COPY * * *</p>
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay with blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-[#1e2336] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col z-10 p-5"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-orange-500 font-mono">Receipt Preview</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#131924] hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Outer Receipt Paper Roll (Virtual Thermal Slip) */}
        <div className="bg-[#FAF8F5] text-slate-800 p-6 rounded-2xl shadow-inner font-mono text-sm relative overflow-hidden select-none border border-amber-100">
          {/* Subtle thermal print shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />

          {/* Paper Jagged Top Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-repeat-x" style={{ backgroundImage: 'linear-gradient(45deg, transparent 33.333%, #1e2336 33.333%, #1e2336 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #1e2336 33.333%, #1e2336 66.667%, transparent 66.667%)', backgroundSize: '8px 8px' }}></div>

          {/* Café Info */}
          <div className="text-center mb-4 space-y-1">
            <div className="text-3xl">☕</div>
            <h4 className="font-extrabold text-base tracking-widest text-slate-900">COFFEE SYSTEM</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Premium Brews & Bakery</p>
            <p className="text-[11px] font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded w-fit mx-auto mt-1">
              {tableName}
            </p>
          </div>

          <div className="border-t border-dashed border-slate-300 my-3" />

          {/* Metadata */}
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Receipt No:</span>
              <span className="font-bold text-slate-800">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-bold text-slate-800 uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Status:</span>
              {isPaid ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded">
                  <CheckCircle size={10} strokeWidth={3} /> PAID
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600 bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded animate-pulse">
                  <AlertTriangle size={10} strokeWidth={3} /> UNPAID
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300 my-3" />

          {/* Items breakdown header */}
          <div className="grid grid-cols-[30px_1fr_60px] text-xs font-bold text-slate-500 mb-2">
            <span>QTY</span>
            <span>ITEM</span>
            <span className="text-right">TOTAL</span>
          </div>

          {/* Items List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((item, index) => {
              const name = item.name || item.product?.name || 'Item';
              const qty = item.qty || item.quantity || 1;
              const price = item.price ?? item.product?.price ?? 0;
              return (
                <div key={index} className="grid grid-cols-[30px_1fr_60px] text-xs text-slate-700 font-medium">
                  <span className="font-bold text-slate-400">x{qty}</span>
                  <span className="truncate pr-1">{name}</span>
                  <span className="text-right font-semibold text-slate-900">${(qty * price).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-dashed border-slate-300 my-3" />

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (10%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-dashed border-slate-300 my-2 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>TOTAL DUE:</span>
              <span className="text-orange-600 font-black">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300 my-3" />

          {/* Barcode representation */}
          <div className="flex flex-col items-center justify-center mt-2 space-y-1">
            {/* Draw a realistic barcode with div stripes */}
            <div className="flex items-center justify-center h-8 w-4/5 gap-[2px] opacity-75">
              {[1,3,2,1,4,1,2,3,1,2,4,2,1,3,2,1,2,3,1,4,2,1,3].map((width, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-800 h-full" 
                  style={{ width: `${width}px` }} 
                />
              ))}
            </div>
            <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
              {orderId.toLowerCase().replace(/[^a-z0-9]/g, '')}
            </span>
          </div>

          <div className="text-center mt-3 text-[10px] text-slate-500 italic">
            Thank you for choosing us!
          </div>
        </div>

        {/* Buttons container outside print slip */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-400 text-orange-950 font-bold rounded-xl transition-all shadow-lg active:scale-95 text-sm"
          >
            <Printer size={16} />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#2a2a35] hover:bg-[#32323e] border border-gray-800 text-white font-bold rounded-xl transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
