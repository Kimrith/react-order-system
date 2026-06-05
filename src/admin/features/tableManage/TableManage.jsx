import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Trash2,
  Copy,
  Download,
  Printer,
  Check,
  AlertTriangle,
  Plus,
  ExternalLink,
  Info
} from 'lucide-react';

export default function TableManage() {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal for viewing QR details
  const [selectedTable, setSelectedTable] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTableId, setDeletingTableId] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('https://localhost:7293/api/TableQr');
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (err) {
      console.error('Failed to fetch tables:', err);
      showToast('Failed to load tables');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    const trimmed = tableNumber.trim();
    if (!trimmed) {
      showToast('Please enter a valid table number!');
      return;
    }

    if (tables.some(t => t.tableId.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Table "${trimmed}" already exists!`);
      return;
    }

    try {
      const res = await fetch(`https://localhost:7293/api/TableQr/generate/${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const newTable = await res.json();
        setTables(prev => [newTable, ...prev]);
        setTableNumber('');
        showToast(`Table "${trimmed}" QR code generated successfully!`);
      } else {
        showToast(`Failed to generate table!`);
      }
    } catch (err) {
      console.error('Failed to generate table:', err);
      showToast('Error generating table');
    }
  };

  const handleCopyLink = (url, label) => {
    navigator.clipboard.writeText(url);
    showToast(`Link for Table ${label} copied to clipboard!`);
  };

  const handleDownloadQR = (table) => {
    const qrUrl = table.qrCodeImageBase64;
    if (!qrUrl) return;

    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `Table_${table.tableId}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded Table ${table.tableId} QR code!`);
  };

  const handlePrintQR = (table) => {
    const qrUrl = table.qrCodeImageBase64;
    if (!qrUrl) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - Table ${table.tableId}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              background-color: #ffffff;
              color: #111827;
            }
            .container {
              text-align: center;
              border: 3px double #e5e7eb;
              padding: 40px;
              border-radius: 24px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            }
            img {
              width: 320px;
              height: 320px;
              margin: 20px 0;
            }
            h1 {
              font-size: 36px;
              font-weight: 800;
              margin: 0;
              letter-spacing: -0.025em;
            }
            p {
              color: #4b5563;
              font-size: 18px;
              font-weight: 500;
              margin: 0;
            }
            .footer-url {
              font-family: monospace;
              color: #9ca3af;
              font-size: 12px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>CAFÉ POS SYSTEM</p>
            <h1>Table ${table.tableId}</h1>
            <img src="${qrUrl}" />
            <p>Scan to View Menu & Place Order</p>
            <div class="footer-url">${table.encryptedUrl}</div>
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

  const handleDeleteClick = (id) => {
    setDeletingTableId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const tableToDelete = tables.find(t => t.tableId === deletingTableId);
    if (!tableToDelete) return;

    try {
      const res = await fetch(`https://localhost:7293/api/TableQr/${encodeURIComponent(deletingTableId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTables(prev => prev.filter(t => t.tableId !== deletingTableId));
        showToast(`Table "${tableToDelete.tableId}" setup deleted.`);
      } else {
        showToast('Failed to delete table');
      }
    } catch (err) {
      console.error('Failed to delete table:', err);
      showToast('Error deleting table');
    } finally {
      setIsDeleteModalOpen(false);
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-sans">System & Table Setup</h1>
          <p className="text-gray-400 mt-1">
            Generate and manage contactless QR codes for physical tables.
          </p>
        </div>
      </div>

      {/* QR Link Generator Card - Matching UI mock precisely */}
      <div className="bg-[#1C2536]/40 backdrop-blur-md rounded-2xl border border-gray-800/60 p-6 shadow-xl relative overflow-hidden">
        <div className="text-sm font-semibold text-white mb-4">QR Link Generator</div>

        <form onSubmit={handleGenerateQR} className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="text-gray-400 text-[14px] font-sans font-medium">
            Generator unique URLs for scanning :
          </div>

          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter Table Number (e.g. A5)"
              className="flex-1 px-4 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-sans text-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Generator QR
            </button>
          </div>
        </form>
      </div>

      {/* Active Tables Dashboard */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <QrCode className="text-blue-500" size={20} />
            Active Tables ({tables.length})
          </h2>
          <span className="text-xs font-semibold text-gray-500 uppercase bg-[#0B0E14] border border-gray-800/50 px-3 py-1 rounded-full font-mono">
            API Synced
          </span>
        </div>

        {/* Empty State */}
        {tables.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-[#1C2536]/20 border border-dashed border-gray-800 rounded-2xl">
            <QrCode className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-300">No active tables found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mt-1">
              Create a new table using the generator above to instantly print QR menus.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {tables.map((table) => {
              const qrSrc = table.qrCodeImageBase64;
              const isOccupied = table.orders?.length > 0;

              return (
                <motion.div
                  key={table.tableId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#1C2536]/40 hover:bg-[#1C2536]/60 backdrop-blur-md rounded-2xl border border-gray-800/60 p-5 flex flex-col justify-between hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          Table {table.tableId}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${isOccupied
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                        {isOccupied ? 'Occupied' : 'Available'}
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div
                      onClick={() => setSelectedTable(table)}
                      className="aspect-square bg-white rounded-xl p-3 flex items-center justify-center cursor-pointer border border-gray-800/20 shadow-inner hover:scale-[1.02] active:scale-98 transition-transform duration-200"
                      title="Click to expand QR Code"
                    >
                      {qrSrc ? (
                        <img
                          src={qrSrc}
                          alt={`Table ${table.tableId} QR`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {/* URL Link Section */}
                    <div className="bg-[#0B0E14]/80 border border-gray-800/60 px-3 py-2 rounded-xl flex items-center justify-between text-xs text-gray-400 font-mono overflow-hidden">
                      <span className="truncate flex-1 pr-2">{table.encryptedUrl}</span>
                      <button
                        onClick={() => handleCopyLink(table.encryptedUrl, table.tableId)}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Copy scan link"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-5 pt-4 border-t border-gray-800/60 flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadQR(table)}
                        className="p-2 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 rounded-lg transition-colors border border-gray-800"
                        title="Download QR Image"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => handlePrintQR(table)}
                        className="p-2 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 rounded-lg transition-colors border border-gray-800"
                        title="Print QR Menu Card"
                      >
                        <Printer size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteClick(table.tableId)}
                      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/20 hover:border-transparent"
                      title="Delete Table"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Expanded QR Modal Details */}
      <AnimatePresence>
        {selectedTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTable(null)}
              className="absolute inset-0 bg-[#070A0F]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#1C2536] border border-gray-800 rounded-2xl p-6 shadow-2xl z-10 flex flex-col items-center space-y-6"
            >
              {/* Header */}
              <div className="w-full flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white">Table {selectedTable.tableId} QR Code</h3>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  &times;
                </button>
              </div>

              {/* Big QR Preview */}
              <div className="w-64 h-64 bg-white rounded-2xl p-4 flex items-center justify-center shadow-2xl">
                <img
                  src={selectedTable.qrCodeImageBase64}
                  alt={`Table ${selectedTable.tableId}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center space-y-1.5 w-full">
                <span className="text-gray-400 text-xs">Customer Scan URL</span>
                <div className="bg-[#0B0E14] border border-gray-800/80 p-2.5 rounded-xl text-xs text-blue-400 font-mono break-all text-center selection:bg-blue-500/20 select-all">
                  {selectedTable.encryptedUrl}
                </div>
              </div>

              {/* Action grid */}
              <div className="grid grid-cols-2 gap-3 w-full pt-2">
                <button
                  onClick={() => handleDownloadQR(selectedTable)}
                  className="flex items-center justify-center gap-2 py-3 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 font-bold rounded-xl transition-all border border-gray-800 active:scale-98"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={() => handlePrintQR(selectedTable)}
                  className="flex items-center justify-center gap-2 py-3 bg-[#1E65FF] hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-98 shadow-lg shadow-blue-500/10"
                >
                  <Printer size={16} />
                  Print QR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
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
                <h3 className="text-lg font-bold text-white font-sans">Delete Table</h3>
              </div>

              <p className="text-gray-400 text-[15px] leading-relaxed">
                Are you sure you want to delete this table?
                Customers will no longer be able to scan this QR code to access the POS ordering menu.
                This action cannot be undone.
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
                  Delete Table
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
