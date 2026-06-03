import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Coffee, Wine, Pizza, IceCream, Cookie, X } from 'lucide-react';
import { getCategories } from '../../customer/features/services/customerApi';
import { getProducts, updateProductAvailability, deleteProduct, createProduct } from '../api/product';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All', icon: <div className="w-2 h-2 rounded-full bg-white mr-2" /> }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Price: '',
    IsAvailable: true,
    CategoryId: ''
  });
  const [file, setFile] = useState(null);

  // Define category icons
  const categoryIcons = {
    'Drinks': <Wine size={14} className="mr-2 text-pink-400" />,
    'Food': <Pizza size={14} className="mr-2 text-orange-400" />,
    'Desserts': <IceCream size={14} className="mr-2 text-yellow-100" />,
    'Snacks': <Cookie size={14} className="mr-2 text-yellow-600" />,
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      
      // Assume all products are available if isAvailable is undefined
      const formattedProducts = (productsData || []).map(p => ({
        ...p,
        isAvailable: p.isAvailable !== false
      }));
      setProducts(formattedProducts);

      const apiCategories = (categoriesData || []).map(cat => ({
        id: String(cat.id),
        name: cat.categoryName,
        icon: categoryIcons[cat.categoryName] || <Coffee size={14} className="mr-2 text-gray-400" />
      }));

      setCategories([
        { id: 'all', name: 'All', icon: <div className="w-2 h-2 rounded-full bg-white mr-2" /> },
        ...apiCategories
      ]);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailability = async (product) => {
    // Optimistic UI update
    const newStatus = !product.isAvailable;
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isAvailable: newStatus } : p));
    
    try {
      // The API endpoint might take just the boolean or a JSON patch. 
      // Assuming api.js sends JSON.stringify(isAvailable) as configured.
      await updateProductAvailability(product.id, newStatus);
    } catch (err) {
      console.error('Failed to update availability', err);
      alert('Failed to update availability');
      // Revert on error
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isAvailable: !newStatus } : p));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    // Optimistic UI update
    const previousProducts = [...products];
    setProducts(prev => prev.filter(p => p.id !== id));
    
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error('Failed to delete product', err);
      alert('Failed to delete product');
      // Revert on error
      setProducts(previousProducts);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Name || !formData.Price || !formData.CategoryId || !file) {
      alert("Please fill all required fields including image");
      return;
    }

    setIsAdding(true);
    const fd = new FormData();
    fd.append("Name", formData.Name);
    fd.append("Description", formData.Description);
    fd.append("Price", formData.Price);
    fd.append("IsAvailable", formData.IsAvailable);
    fd.append("CategoryId", formData.CategoryId);
    fd.append("ProductImg", file);

    try {
      await createProduct(fd);
      setIsAddModalOpen(false);
      setFormData({ Name: '', Description: '', Price: '', IsAvailable: true, CategoryId: '' });
      setFile(null);
      loadData(); // refresh the list
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setIsAdding(false);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || String(p.categoryId) === String(activeCategory);
    return matchesSearch && matchesCategory;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Helper to get category name by ID
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === String(categoryId));
    return cat ? cat.name : 'Uncategorized';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* <Coffee size={24} className="text-gray-300" /> */}
              <h1 className="text-2xl font-bold text-white">Menu Management</h1>
            </div>
            <p className="text-gray-500 text-sm">
              {products.length} items — manage availability & details
            </p>
          </div>
          {/* Search Bar */}
          <div className="relative shrink-0 ">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e2336] border border-transparent focus:border-gray-700 text-white placeholder-gray-500 rounded-xl py-2.5 pl-12 pr-4 outline-none transition-all"
            />
          </div></div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-yellow-500/20 hover:-translate-y-0.5"
        >
          <Plus size={16} strokeWidth={3} /> Add Item
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-yellow-500 text-yellow-950 shadow-md shadow-yellow-500/20' 
                    : 'bg-[#1e2336] text-gray-400 hover:bg-[#232942] hover:text-gray-300'
                }`}
              >
                {React.cloneElement(cat.icon, { 
                  className: `mr-2 ${isActive ? 'text-yellow-900' : cat.icon.props.className}` 
                })}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden bg-[#1e2336] rounded-2xl flex flex-col border border-[#2a2a35]/50">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-b border-[#2a2a35] shrink-0 items-center">
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase">Item</div>
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase">Category</div>
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase">Price</div>
          <div className="text-gray-500 font-bold text-[10px] tracking-wider uppercase">Available</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              No products found.
            </div>
          ) : (
            currentItems.map((product) => {
              const imageUrl = `${import.meta.env.VITE_IMAGE_URL || 'https://localhost:7293/uploads/'}${product.productImg}`;
              
              return (
                <div 
                  key={product.id} 
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-b border-[#2a2a35] hover:bg-[#232942] transition-colors items-center group"
                >
                  {/* ITEM */}
                  <div className="flex items-center gap-4 min-w-0 pr-4">
                    <img 
                      src={imageUrl} 
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#15192b] p-1 shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/40x40/15192b/a0a0a0?text=No+Img';
                      }}
                    />
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-white font-bold text-sm truncate">{product.name}</h3>
                      <p className="text-gray-500 text-[11px] truncate">
                        {product.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <span className="bg-[#15192b] border border-[#2a2a35] text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                      {getCategoryName(product.categoryId)}
                    </span>
                  </div>

                  {/* PRICE */}
                  <div>
                    <span className="text-yellow-500 font-black text-sm">
                      ${product.price?.toFixed(2)}
                    </span>
                  </div>

                  {/* AVAILABLE */}
                  <div>
                    <button
                      onClick={() => handleToggleAvailability(product)}
                      className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${
                        product.isAvailable ? 'bg-green-500' : 'bg-[#15192b] border border-[#2a2a35]'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300 ${
                          product.isAvailable 
                            ? 'translate-x-5 bg-white' 
                            : 'translate-x-0 bg-gray-500'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-[#2a2a35] bg-[#1e2336] shrink-0 rounded-b-2xl mt-auto">
          <span className="text-gray-500 text-sm font-medium">
            Showing {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} items
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#15192b] text-gray-400 rounded-lg hover:bg-white hover:text-[#15192b] disabled:hover:bg-[#15192b] disabled:hover:text-gray-400 disabled:opacity-50 transition-all duration-200 text-sm font-bold shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center px-4 py-2 bg-[#15192b] text-yellow-500 rounded-lg font-bold text-sm shadow-sm border border-[#2a2a35]">
              Page {currentPage} of {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-[#15192b] text-gray-400 rounded-lg hover:bg-white hover:text-[#15192b] disabled:hover:bg-[#15192b] disabled:hover:text-gray-400 disabled:opacity-50 transition-all duration-200 text-sm font-bold shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e2336] border border-[#2a2a35] rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-[#2a2a35]">
              <h2 className="text-xl font-bold text-white">Add New Item</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-gray-400 text-[11px] font-bold tracking-wider uppercase mb-2">Product Image *</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-yellow-500/10 file:text-yellow-500 hover:file:bg-yellow-500/20 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] font-bold tracking-wider uppercase mb-2">Name *</label>
                <input 
                  type="text" 
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  className="w-full bg-[#15192b] border border-[#2a2a35] focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                  placeholder="e.g. Mocha"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] font-bold tracking-wider uppercase mb-2">Description</label>
                <input 
                  type="text" 
                  value={formData.Description}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  className="w-full bg-[#15192b] border border-[#2a2a35] focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                  placeholder="Item details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-[11px] font-bold tracking-wider uppercase mb-2">Price *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.Price}
                    onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                    className="w-full bg-[#15192b] border border-[#2a2a35] focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-[11px] font-bold tracking-wider uppercase mb-2">Category *</label>
                  <select
                    value={formData.CategoryId}
                    onChange={(e) => setFormData({ ...formData, CategoryId: e.target.value })}
                    className="w-full bg-[#15192b] border border-[#2a2a35] focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors appearance-none"
                    required
                  >
                    <option value="" disabled>Select...</option>
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, IsAvailable: !formData.IsAvailable })}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${
                    formData.IsAvailable ? 'bg-green-500' : 'bg-[#15192b] border border-[#2a2a35]'
                  }`}
                >
                  <div 
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300 ${
                      formData.IsAvailable ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'
                    }`}
                  />
                </button>
                <span className="text-sm font-bold text-gray-300">Available</span>
              </div>

              <button 
                type="submit"
                disabled={isAdding}
                className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-black py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-70 flex justify-center items-center hover:-translate-y-1"
              >
                {isAdding ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-950"></div>
                ) : "Save Item"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
