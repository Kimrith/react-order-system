import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Percent,
  Calendar,
  Tag,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Play,
  Pause,
  Clock,
  TrendingDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Seed products (matching MenuManagement.jsx SEED_PRODUCTS) in case local storage is empty
const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Coca-Cola', category: 'Drinks', price: 1.50, icon: '🥤', iconBg: 'bg-pink-500/10 text-pink-400' },
  { id: 2, name: 'Fresh Orange Juice', category: 'Drinks', price: 3.00, icon: '🍊', iconBg: 'bg-amber-500/10 text-amber-400' },
  { id: 3, name: 'Iced Coffee', category: 'Drinks', price: 2.50, icon: '☕', iconBg: 'bg-amber-900/20 text-amber-600' },
  { id: 4, name: 'Thai Milk Tea', category: 'Drinks', price: 2.75, icon: '🧋', iconBg: 'bg-orange-500/10 text-orange-400' },
  { id: 5, name: 'Sparkling Water', category: 'Drinks', price: 1.00, icon: '💧', iconBg: 'bg-blue-500/10 text-blue-400' },
  { id: 6, name: 'Beef Burger', category: 'Food', price: 6.50, icon: '🍔', iconBg: 'bg-yellow-600/10 text-yellow-500' },
  { id: 7, name: 'Chicken Fried Rice', category: 'Food', price: 4.50, icon: '🍚', iconBg: 'bg-red-500/10 text-red-400' },
  { id: 8, name: 'Grilled Salmon', category: 'Food', price: 9.00, icon: '🐟', iconBg: 'bg-cyan-500/10 text-cyan-400' },
  { id: 9, name: 'Pad Thai Noodles', category: 'Food', price: 5.00, icon: '🍜', iconBg: 'bg-red-500/10 text-red-400' },
  { id: 10, name: 'Chocolate Lava Cake', category: 'Desserts', price: 4.50, icon: '🍰', iconBg: 'bg-pink-500/10 text-pink-400' },
  { id: 11, name: 'Strawberry Cheesecake', category: 'Desserts', price: 5.00, icon: '🍰', iconBg: 'bg-rose-500/10 text-rose-400' },
  { id: 12, name: 'French Fries', category: 'Snacks', price: 3.00, icon: '🍟', iconBg: 'bg-yellow-500/10 text-yellow-400' },
  { id: 13, name: 'Crispy Onion Rings', category: 'Snacks', price: 3.50, icon: '🧅', iconBg: 'bg-amber-600/10 text-amber-500' }
];

// Seed initial discounts for previewing the feature beautifully
const getInitialDiscounts = () => {
  const today = new Date();

  // Format date helper
  const formatDate = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  };

  const activeStart = new Date();
  activeStart.setDate(today.getDate() - 3);
  const activeEnd = new Date();
  activeEnd.setDate(today.getDate() + 4);

  const scheduledStart = new Date();
  scheduledStart.setDate(today.getDate() + 2);
  const scheduledEnd = new Date();
  scheduledEnd.setDate(today.getDate() + 8);

  const expiredStart = new Date();
  expiredStart.setDate(today.getDate() - 10);
  const expiredEnd = new Date();
  expiredEnd.setDate(today.getDate() - 2);

  return [
    {
      id: 'd1',
      productId: 6, // Beef Burger
      percentage: 20,
      startDate: formatDate(activeStart),
      endDate: formatDate(activeEnd),
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'd2',
      productId: 3, // Iced Coffee
      percentage: 15,
      startDate: formatDate(scheduledStart),
      endDate: formatDate(scheduledEnd),
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'd3',
      productId: 10, // Chocolate Lava Cake
      percentage: 30,
      startDate: formatDate(expiredStart),
      endDate: formatDate(expiredEnd),
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];
};

export default function DiscountManage() {
  // Load products from localStorage or use defaults
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('coffee_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  // Load discounts from localStorage or seed
  const [discounts, setDiscounts] = useState(() => {
    const saved = localStorage.getItem('coffee_discounts');
    return saved ? JSON.parse(saved) : getInitialDiscounts();
  });

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, scheduled, expired, suspended

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [deletingDiscountId, setDeletingDiscountId] = useState(null);

  // Form states
  const [formProductId, setFormProductId] = useState('');
  const [formPercentage, setFormPercentage] = useState(10);
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Custom Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync products and discounts with localStorage
  useEffect(() => {
    localStorage.setItem('coffee_discounts', JSON.stringify(discounts));
  }, [discounts]);

  // Read updates if menu products change on other tabs/pages
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProds = localStorage.getItem('coffee_products');
      if (savedProds) setProducts(JSON.parse(savedProds));
      const savedDiscounts = localStorage.getItem('coffee_discounts');
      if (savedDiscounts) setDiscounts(JSON.parse(savedDiscounts));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Map product information easily by id
  const productMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [products]);

  // Date comparison helper using midnight local time
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Compute status for an individual discount
  const getDiscountStatus = (discount) => {
    if (!discount.isActive) {
      if (discount.endDate < todayStr) return 'expired';
      return 'suspended';
    }
    if (todayStr > discount.endDate) return 'expired';
    if (todayStr < discount.startDate) return 'scheduled';
    return 'active';
  };

  // Compute overall dashboard statistics
  const stats = useMemo(() => {
    let activeCount = 0;
    let scheduledCount = 0;
    let expiredCount = 0;
    let suspendedCount = 0;
    let totalDiscountPercent = 0;
    let activeDiscountsCount = 0;
    let highestDiscount = 0;

    discounts.forEach((d) => {
      const status = getDiscountStatus(d);
      if (status === 'active') {
        activeCount++;
        totalDiscountPercent += d.percentage;
        activeDiscountsCount++;
      } else if (status === 'scheduled') {
        scheduledCount++;
      } else if (status === 'expired') {
        expiredCount++;
      } else if (status === 'suspended') {
        suspendedCount++;
      }

      if (d.percentage > highestDiscount) {
        highestDiscount = d.percentage;
      }
    });

    const averageSaving = activeDiscountsCount > 0
      ? Math.round(totalDiscountPercent / activeDiscountsCount)
      : 0;

    return {
      active: activeCount,
      scheduled: scheduledCount,
      expired: expiredCount,
      suspended: suspendedCount,
      total: discounts.length,
      averageSaving,
      highestDiscount
    };
  }, [discounts, todayStr]);

  // Filtered & Searched Discounts
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((d) => {
      const product = productMap[d.productId];
      const productName = product ? product.name.toLowerCase() : '';
      const matchesSearch = productName.includes(searchQuery.toLowerCase());

      const status = getDiscountStatus(d);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [discounts, searchQuery, statusFilter, productMap, todayStr]);

  // Handle opening form modal to ADD a discount
  const handleAddNewClick = () => {
    setEditingDiscount(null);
    // Select first product from the list initially if available
    setFormProductId(products[0]?.id.toString() || '');
    setFormPercentage(15);
    setFormStartDate(todayStr);

    // Default end date is 7 days from now
    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);
    setFormEndDate(weekLater.toISOString().split('T')[0]);

    setFormIsActive(true);
    setIsFormModalOpen(true);
  };

  // Handle opening form modal to EDIT an existing discount
  const handleEditClick = (discount) => {
    setEditingDiscount(discount);
    setFormProductId(discount.productId.toString());
    setFormPercentage(discount.percentage);
    setFormStartDate(discount.startDate);
    setFormEndDate(discount.endDate);
    setFormIsActive(discount.isActive);
    setIsFormModalOpen(true);
  };

  // Toggle active status directly from row switch
  const handleToggleStatus = (id) => {
    setDiscounts(prev =>
      prev.map((d) => {
        if (d.id === id) {
          const newStatus = !d.isActive;
          const prod = productMap[d.productId];
          showToast(`"${prod?.name || 'Discount'}" promotion ${newStatus ? 'activated' : 'paused'}!`);
          return { ...d, isActive: newStatus };
        }
        return d;
      })
    );
  };

  // Handle deleting discount
  const handleDeleteClick = (id) => {
    setDeletingDiscountId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const target = discounts.find(d => d.id === deletingDiscountId);
    const prod = target ? productMap[target.productId] : null;
    setDiscounts(prev => prev.filter(d => d.id !== deletingDiscountId));
    showToast(`Promotion for "${prod?.name || 'product'}" deleted successfully.`);
    setIsDeleteModalOpen(false);
  };

  // Save (Create/Update) Discount logic
  const handleSaveDiscount = (e) => {
    e.preventDefault();
    if (!formProductId || !formPercentage || !formStartDate || !formEndDate) {
      showToast('Please fill in all required fields.');
      return;
    }

    if (formStartDate > formEndDate) {
      showToast('Start Date cannot be after End Date!');
      return;
    }

    const prodIdNum = parseInt(formProductId);
    const percentNum = parseInt(formPercentage);

    // Check if an overlapping discount already exists for the same product
    const isOverlapping = discounts.some((d) => {
      // Skip current discount if editing
      if (editingDiscount && d.id === editingDiscount.id) return false;
      if (d.productId !== prodIdNum) return false;

      // Dates overlap if: (StartA <= EndB) and (EndA >= StartB)
      return (formStartDate <= d.endDate) && (formEndDate >= d.startDate);
    });

    if (isOverlapping) {
      if (!window.confirm('Warning: This product already has a configured discount that overlaps with these dates. Do you want to save anyway?')) {
        return;
      }
    }

    const prod = productMap[prodIdNum];

    if (editingDiscount) {
      // UPDATE
      setDiscounts(prev =>
        prev.map((d) =>
          d.id === editingDiscount.id
            ? {
              ...d,
              productId: prodIdNum,
              percentage: percentNum,
              startDate: formStartDate,
              endDate: formEndDate,
              isActive: formIsActive
            }
            : d
        )
      );
      showToast(`Promotion for "${prod?.name || 'product'}" updated!`);
    } else {
      // ADD
      const newDiscount = {
        id: `d-${Date.now()}`,
        productId: prodIdNum,
        percentage: percentNum,
        startDate: formStartDate,
        endDate: formEndDate,
        isActive: formIsActive,
        createdAt: new Date().toISOString()
      };
      setDiscounts(prev => [newDiscount, ...prev]);
      showToast(`Promotion for "${prod?.name || 'product'}" added!`);
    }

    setIsFormModalOpen(false);
  };

  // Live Calculator Visualizer Helper values
  const currentSelectedProduct = useMemo(() => {
    if (!formProductId) return null;
    return productMap[parseInt(formProductId)];
  }, [formProductId, productMap]);

  const liveCalculation = useMemo(() => {
    if (!currentSelectedProduct) return { price: 0, discount: 0, final: 0 };
    const originalPrice = currentSelectedProduct.price;
    const discountAmount = originalPrice * (formPercentage / 100);
    const finalPrice = Math.max(0, originalPrice - discountAmount);
    return {
      price: originalPrice,
      discount: discountAmount,
      final: finalPrice
    };
  }, [currentSelectedProduct, formPercentage]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">

      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-gray-900 border border-violet-500/30 text-violet-400 font-semibold rounded-xl shadow-2xl shadow-violet-950/20 backdrop-blur-md"
          >
            <div className="w-5 h-5 rounded-full bg-violet-500/10 flex items-center justify-center">
              <Check size={14} className="text-violet-400" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-violet-500" size={28} />
            Discount Management
          </h1>
          <p className="text-gray-400 mt-1">Configure automated seasonal percentages and dates for each product menu item</p>
        </div>

        {/* Add Discount Button */}
        <button
          onClick={handleAddNewClick}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-95 text-[15px]"
        >
          <Plus size={20} className="stroke-[2.5]" />
          Create Discount
        </button>
      </div>



      {/* Filters, Tabs & Search */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search discounted products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1C2536] text-white placeholder-gray-500 border border-gray-800 rounded-xl focus:outline-none focus:border-violet-500 transition-colors font-sans"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', name: 'All Promos', icon: <Tag size={14} /> },
            { id: 'active', name: 'Active Now', icon: <Play size={14} className="fill-current" /> },
            { id: 'scheduled', name: 'Scheduled', icon: <Clock size={14} /> },
            { id: 'expired', name: 'Expired', icon: <AlertTriangle size={14} /> },
            { id: 'suspended', name: 'Suspended', icon: <Pause size={14} /> }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-200 text-sm ${isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10'
                  : 'bg-[#1C2536]/80 text-gray-400 hover:bg-[#1C2536] hover:text-gray-200 border border-gray-800'
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Discounts Grid/Table */}
      <div className="bg-[#1C2536]/40 backdrop-blur-md rounded-2xl border border-gray-800/60 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-800/80 bg-[#1C2536]/60 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4.5">Menu Item</th>
                <th className="px-6 py-4.5">Regular Price</th>
                <th className="px-6 py-4.5">Discount Rate</th>
                <th className="px-6 py-4.5">Promo Price</th>
                <th className="px-6 py-4.5">Duration Window</th>
                <th className="px-6 py-4.5">Override Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              <AnimatePresence initial={false}>
                {filteredDiscounts.length > 0 ? (
                  filteredDiscounts.map((discount) => {
                    const product = productMap[discount.productId];
                    if (!product) return null;

                    const status = getDiscountStatus(discount);
                    const originalPrice = product.price;
                    const finalPrice = Math.max(0, originalPrice - (originalPrice * (discount.percentage / 100)));

                    // Choose badge colors based on computed dynamic state
                    let badgeClass = '';
                    let badgeLabel = '';

                    switch (status) {
                      case 'active':
                        badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                        badgeLabel = 'Active Now';
                        break;
                      case 'scheduled':
                        badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                        badgeLabel = 'Scheduled';
                        break;
                      case 'expired':
                        badgeClass = 'bg-red-500/10 text-red-400 border-red-500/20';
                        badgeLabel = 'Expired';
                        break;
                      case 'suspended':
                        badgeClass = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
                        badgeLabel = 'Suspended';
                        break;
                      default:
                        break;
                    }

                    return (
                      <motion.tr
                        key={discount.id}
                        layoutId={`discount-row-${discount.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-[#1C2536]/20 transition-colors"
                      >
                        {/* Name Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl ${product.iconBg || 'bg-slate-500/10 text-slate-400'} flex items-center justify-center text-2xl shadow-inner`}>
                              {product.icon || '🍽️'}
                            </div>
                            <div>
                              <div className="font-bold text-white text-[15px] group-hover:text-violet-400 transition-colors">
                                {product.name}
                              </div>
                              <div className="text-gray-500 text-xs mt-0.5">
                                Category: {product.category}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Regular Price */}
                        <td className="px-6 py-4">
                          <span className="text-gray-400 font-medium line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        </td>

                        {/* Discount Rate */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-bold text-violet-400">
                            <TrendingDown size={14} />
                            <span>{discount.percentage}% OFF</span>
                          </div>
                        </td>

                        {/* Promo Price */}
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-[#F59E0B] text-lg">
                            ${finalPrice.toFixed(2)}
                          </span>
                        </td>

                        {/* Time Duration Window */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 max-w-[200px]">
                            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                              <Calendar size={13} className="text-gray-500" />
                              <span>{discount.startDate}</span>
                              <ArrowRight size={10} className="text-gray-500" />
                              <span>{discount.endDate}</span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 border rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                              {badgeLabel}
                            </span>
                          </div>
                        </td>

                        {/* Active Switch Toggle */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(discount.id)}
                            disabled={status === 'expired'}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${status === 'expired'
                                ? 'bg-gray-800 opacity-40 cursor-not-allowed'
                                : discount.isActive ? 'bg-[#10B981]' : 'bg-gray-700/60'
                              }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${discount.isActive && status !== 'expired' ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => handleEditClick(discount)}
                              className="p-2 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 rounded-lg transition-colors border border-gray-800"
                              title="Edit Promotion"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(discount.id)}
                              className="p-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors shadow-lg shadow-red-500/10"
                              title="Delete Promotion"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-850 flex items-center justify-center border border-gray-800">
                          <Tag className="text-gray-500" size={22} />
                        </div>
                        <div>
                          <div className="text-gray-400 font-bold">No promotion campaigns found</div>
                          <div className="text-gray-500 text-sm mt-0.5">Try widening filters or creating a new campaign rule</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-[#070A0F]/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#1C2536] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800 bg-[#1C2536]/80">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Percent size={20} className="text-violet-500" />
                  {editingDiscount ? 'Modify Promotion Campaign' : 'Configure New Promotion'}
                </h3>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveDiscount} className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Select Menu Product */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                    Target Menu Product *
                  </label>
                  <select
                    value={formProductId}
                    onChange={(e) => setFormProductId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
                    required
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.icon || '🍽️'} {p.name} (Reg: ${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Percentage Configuration */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Discount Rate percentage *
                    </label>
                    <span className="text-lg font-black text-violet-400 bg-violet-500/10 px-3 py-1 rounded-lg">
                      {formPercentage}% OFF
                    </span>
                  </div>

                  {/* Slider + Input synced */}
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={formPercentage}
                      onChange={(e) => setFormPercentage(parseInt(e.target.value))}
                      className="flex-1 accent-violet-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
                    />
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={formPercentage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setFormPercentage(Math.max(1, Math.min(99, val)));
                      }}
                      className="w-16 text-center px-2 py-1.5 bg-[#131924] text-white border border-gray-800 rounded-lg focus:outline-none focus:border-violet-500 font-bold"
                    />
                  </div>
                </div>

                {/* Interactive Dynamic Price Calculator Comparison Widget */}
                {currentSelectedProduct && (
                  <div className="bg-[#131924] border border-gray-800/80 rounded-2xl p-4.5 space-y-3.5 relative overflow-hidden">
                    {/* Visual glowing bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-amber-500" />

                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span>Real-time Promo Calculation</span>
                    </div>

                    <div className="grid grid-cols-3 items-center text-center gap-2 pt-1">
                      {/* Price A */}
                      <div className="space-y-1 border-r border-gray-800/60">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Regular Price</span>
                        <div className="text-base text-gray-400 font-semibold line-through">
                          ${liveCalculation.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Savings B */}
                      <div className="space-y-1 border-r border-gray-800/60">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Customer Saves</span>
                        <div className="text-base text-violet-400 font-bold">
                          -${liveCalculation.discount.toFixed(2)}
                        </div>
                      </div>

                      {/* Promo C */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Promotional Price</span>
                        <div className="text-lg text-amber-400 font-black">
                          ${liveCalculation.final.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Duration Dates Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                      Start Active Date *
                    </label>
                    <input
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                      End Active Date *
                    </label>
                    <input
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full px-4 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Overriding Active Override switch */}
                <div className="flex items-center justify-between p-4 bg-[#131924] rounded-xl border border-gray-800">
                  <div>
                    <div className="font-bold text-white text-sm">Campaign Active Override</div>
                    <div className="text-gray-500 text-xs mt-0.5">Pause this promotion immediately without deleting date records</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormIsActive(!formIsActive)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formIsActive ? 'bg-[#10B981]' : 'bg-gray-700'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formIsActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>

                {/* Modal actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-800/80">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="flex-1 py-3 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 font-bold rounded-xl transition-colors border border-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-98"
                  >
                    {editingDiscount ? 'Apply Changes' : 'Create Promotion'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-[#070A0F]/80 backdrop-blur-md"
            />

            {/* Modal Box */}
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
                <h3 className="text-lg font-bold text-white">Delete Discount Rule</h3>
              </div>

              <p className="text-gray-400 text-[15px] leading-relaxed">
                Are you sure you want to delete this discount campaign rule? It will be removed from your systems instantly. This action cannot be undone.
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
                  Delete Campaign
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
