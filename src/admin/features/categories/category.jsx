import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import { fetchProducts } from '../api/productApi';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';


export default function Category() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Modal control state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  // Form input state
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formEmoji, setFormEmoji] = useState('🥤');

  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    try {
      const [catsData, prodsData] = await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);

      const mappedCats = catsData.map(c => ({
        ...c,
        name: c.categoryName,
        code: `cat-${c.id}`,

      }));

      // Find best emoji matching from previous local storage if we want, or just fallback
      // For simplicity, we just use a default one for now unless imageUrl is available.

      setCategories(mappedCats);
      setProducts(prodsData);
    } catch (err) {
      console.error(err);
      showToast('Error loading data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const totalProductCount = useMemo(() => {
    return products.length;
  }, [products]);

  const handleAddNewClick = () => {
    setEditingCategory(null);
    setFormName('');
    const customCats = categories.filter(c => !c.isSystem);
    const nextNum = customCats.length + 2;
    setFormCode(`cat-${nextNum}`);
    setFormEmoji('🥤');
    setIsFormModalOpen(true);
  };

  const handleEditClick = (category) => {
    if (category.isSystem) return;
    setEditingCategory(category);
    setFormName(category.name);
    setFormCode(category.code);
    setFormEmoji(category.icon);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    const catToDelete = categories.find(c => c.id === id);
    if (catToDelete?.isSystem) return;
    setDeletingCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formName) return;

    try {
      if (editingCategory) {
        // Update Category
        const updated = await updateCategory(editingCategory.id, { categoryName: formName });
        const oldName = editingCategory.name;

        setCategories(prev =>
          prev.map(c =>
            c.id === editingCategory.id
              ? { ...c, categoryName: formName, name: formName }
              : c
          )
        );

        // Ideally you would update products here or re-fetch
        loadData();
        showToast(`Category "${formName}" updated successfully!`);
      } else {
        // Create new Category
        const newCat = await createCategory({ categoryName: formName });

        const newMapped = {
          ...newCat,
          name: newCat.categoryName
        };

        setCategories(prev => [...prev, newMapped]);
        showToast(`Category "${formName}" created successfully!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving category');
    }

    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    const catToDelete = categories.find(c => c.id === deletingCategoryId);
    if (!catToDelete) return;

    try {
      await deleteCategory(deletingCategoryId);
      setCategories(prev => prev.filter(c => c.id !== deletingCategoryId));

      // Refresh products 
      loadData();
      showToast(`Category "${catToDelete.name}" removed successfully.`);
    } catch (err) {
      console.error(err);
      showToast('Error deleting category');
    }
    setIsDeleteModalOpen(false);
  };

  // Helper to count products inside a category
  const getProductCount = (category) => {
    if (category.id === 'All') {
      return 0; // matching mockup card 1 exactly which shows "0 products"
    }
    // API returns categoryName in product object
    return products.filter(p => p.categoryName?.toLowerCase() === category.name?.toLowerCase()).length;
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
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-gray-900 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl shadow-2xl shadow-emerald-950/20 backdrop-blur-md"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check size={14} className="text-emerald-400" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Category Management</h1>
          <p className="text-gray-400 mt-1">
            {categories.length - 1} categories — used across {totalProductCount} products
          </p>
        </div>

        {/* Add Category Button */}
        <button
          onClick={handleAddNewClick}
          className="flex items-center gap-2 px-5 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-black rounded-xl font-bold transition-all duration-200 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 text-[15px]"
        >
          <Plus size={20} className="stroke-[2.5]" />
          Add Category
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categories.map((cat) => {
          const productCount = getProductCount(cat);
          return (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1C2536]/40 hover:bg-[#1C2536]/70 backdrop-blur-md rounded-2xl border border-gray-800/60 p-3 relative flex flex-col hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all group"
            >
              <div>
                {/* Top Section with Icon and Buttons/Badge */}
                <div className="flex justify-between items-start w-full">
                  {/* <div className={`w-14 h-14 rounded-2xl ${cat.iconBg || 'bg-slate-500/10 text-slate-400'} flex items-center justify-center text-3xl shadow-inner border border-gray-800/40`}>
                    {cat.imageUrl ? (
                      <img src={`${API_BASE_URL}${cat.imageUrl}`} alt={cat.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      cat.icon
                    )}
                  </div> */}

                  {cat.isSystem ? (
                    <span className="px-2 py-0.5 bg-gray-800/60 text-gray-500 border border-gray-700/30 text-[9px] font-bold rounded uppercase tracking-wider">
                      SYSTEM
                    </span>
                  ) : (
                    <div className="flex justify-between items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Details Section */}
                      <div>
                        <h3 className="text-xl font-bold text-white mt-5 tracking-tight group-hover:text-[#F59E0B] transition-colors duration-200">
                          {cat.name}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1 font-medium">
                          {productCount} {productCount === 1 ? 'product' : 'products'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="p-1.5 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 rounded-lg transition-colors border border-gray-800"
                        title="Edit Category"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat.id)}
                        className="p-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors shadow-lg shadow-red-500/10"
                        title="Delete Category"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>


              </div>

              {/* Code Badge Pill */}
              <div className="mt-5 flex">
                <span className="inline-flex text-[10px] font-semibold text-gray-500 bg-[#0B0E14] border border-gray-800/50 px-2.5 py-0.5 rounded-full font-mono">
                  {cat.code}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add / Edit Category Form Modal */}
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
              className="relative w-full max-w-md bg-[#1C2536] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white font-sans">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveCategory} className="p-6 space-y-5">

                {/* Category Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Beverages"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#131924] text-white border border-gray-800 rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>


                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="flex-1 py-3 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 font-bold rounded-xl transition-colors border border-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/5 active:scale-98"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
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
                <h3 className="text-lg font-bold text-white font-sans">Delete Category</h3>
              </div>

              <p className="text-gray-400 text-[15px] leading-relaxed">
                Are you sure you want to delete this category?
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
                  Delete Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

