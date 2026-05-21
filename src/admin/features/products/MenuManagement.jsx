import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    Check,
    AlertTriangle
} from 'lucide-react';

// Seed products to reach 13 items as specified in the mock-up's subtitle
const SEED_PRODUCTS = [
    {
        id: 1,
        name: 'Coca-Cola',
        description: 'Classic refreshing cola, served chilled',
        category: 'Drinks',
        price: 1.50,
        available: true,
        icon: '🥤',
        iconBg: 'bg-pink-500/10 text-pink-400'
    },
    {
        id: 2,
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed, no preservatives',
        category: 'Drinks',
        price: 3.00,
        available: true,
        icon: '🍊',
        iconBg: 'bg-amber-500/10 text-amber-400'
    },
    {
        id: 3,
        name: 'Iced Coffee',
        description: 'Strong cold brew with milk',
        category: 'Drinks',
        price: 2.50,
        available: true,
        icon: '☕',
        iconBg: 'bg-amber-900/20 text-amber-600'
    },
    {
        id: 4,
        name: 'Thai Milk Tea',
        description: 'Creamy sweet tea with condensed milk',
        category: 'Drinks',
        price: 2.75,
        available: true,
        icon: '🧋',
        iconBg: 'bg-orange-500/10 text-orange-400'
    },
    {
        id: 5,
        name: 'Sparkling Water',
        description: 'Chilled sparkling mineral water',
        category: 'Drinks',
        price: 1.00,
        available: false,
        icon: '💧',
        iconBg: 'bg-blue-500/10 text-blue-400'
    },
    {
        id: 6,
        name: 'Beef Burger',
        description: 'Angus beef patty with lettuce & cheese',
        category: 'Food',
        price: 6.50,
        available: true,
        icon: '🍔',
        iconBg: 'bg-yellow-600/10 text-yellow-500'
    },
    {
        id: 7,
        name: 'Chicken Fried Rice',
        description: 'Wok-fried rice with egg & vegetables',
        category: 'Food',
        price: 4.50,
        available: true,
        icon: '🍚',
        iconBg: 'bg-red-500/10 text-red-400'
    },
    {
        id: 8,
        name: 'Grilled Salmon',
        description: 'Fresh salmon fillet with steamed vegs',
        category: 'Food',
        price: 9.00,
        available: true,
        icon: '🐟',
        iconBg: 'bg-cyan-500/10 text-cyan-400'
    },
    {
        id: 9,
        name: 'Pad Thai Noodles',
        description: 'Stir-fried rice noodles, shrimp & pean...',
        category: 'Food',
        price: 5.00,
        available: true,
        icon: '🍜',
        iconBg: 'bg-red-500/10 text-red-400'
    },
    {
        id: 10,
        name: 'Chocolate Lava Cake',
        description: 'Rich chocolate cake with a molten warm center',
        category: 'Desserts',
        price: 4.50,
        available: true,
        icon: '🍰',
        iconBg: 'bg-pink-500/10 text-pink-400'
    },
    {
        id: 11,
        name: 'Strawberry Cheesecake',
        description: 'Creamy NY cheesecake with fresh strawberries',
        category: 'Desserts',
        price: 5.00,
        available: true,
        icon: '🍰',
        iconBg: 'bg-rose-500/10 text-rose-400'
    },
    {
        id: 12,
        name: 'French Fries',
        description: 'Golden crispy potato fries, lightly salted',
        category: 'Snacks',
        price: 3.00,
        available: true,
        icon: '🍟',
        iconBg: 'bg-yellow-500/10 text-yellow-400'
    },
    {
        id: 13,
        name: 'Crispy Onion Rings',
        description: 'Deep-fried battered sweet onion rings',
        category: 'Snacks',
        price: 3.50,
        available: true,
        icon: '🧅',
        iconBg: 'bg-amber-600/10 text-amber-500'
    }
];



const EMOJI_OPTIONS = [
    { char: '🥤', bg: 'bg-pink-500/10 text-pink-400' },
    { char: '🍊', bg: 'bg-amber-500/10 text-amber-400' },
    { char: '☕', bg: 'bg-amber-900/20 text-amber-600' },
    { char: '🧋', bg: 'bg-orange-500/10 text-orange-400' },
    { char: '💧', bg: 'bg-blue-500/10 text-blue-400' },
    { char: '🍔', bg: 'bg-yellow-600/10 text-yellow-500' },
    { char: '🍚', bg: 'bg-red-500/10 text-red-400' },
    { char: '🐟', bg: 'bg-cyan-500/10 text-cyan-400' },
    { char: '🍜', bg: 'bg-red-500/10 text-red-400' },
    { char: '🍰', bg: 'bg-rose-500/10 text-rose-400' },
    { char: '🍟', bg: 'bg-yellow-500/10 text-yellow-400' },
    { char: '🧅', bg: 'bg-amber-600/10 text-amber-500' },
    { char: '🍕', bg: 'bg-red-500/10 text-red-400' },
    { char: '🥪', bg: 'bg-yellow-700/10 text-yellow-600' },
    { char: '🍩', bg: 'bg-purple-500/10 text-purple-400' },
    { char: '🍦', bg: 'bg-cyan-500/10 text-cyan-400' }
];

export default function MenuManagement() {
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('coffee_categories');
        return saved ? JSON.parse(saved) : [
            { id: 'All', name: 'All', icon: '🍽️', isSystem: true, code: 'cat-1', iconBg: 'bg-slate-500/10 text-slate-400' },
            { id: 'Drinks', name: 'Drinks', icon: '🥤', code: 'cat-2', iconBg: 'bg-pink-500/10 text-pink-400' },
            { id: 'Food', name: 'Food', icon: '🍔', code: 'cat-3', iconBg: 'bg-yellow-600/10 text-yellow-500' },
            { id: 'Desserts', name: 'Desserts', icon: '🍰', code: 'cat-4', iconBg: 'bg-rose-500/10 text-rose-400' },
            { id: 'Snacks', name: 'Snacks', icon: '🍟', code: 'cat-5', iconBg: 'bg-yellow-500/10 text-yellow-400' }
        ];
    });

    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('coffee_products');
        return saved ? JSON.parse(saved) : SEED_PRODUCTS;
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        localStorage.setItem('coffee_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('coffee_categories', JSON.stringify(categories));
    }, [categories]);

    // Sync data across tabs/pages
    useEffect(() => {
        const handleStorageChange = () => {
            const savedProds = localStorage.getItem('coffee_products');
            if (savedProds) setProducts(JSON.parse(savedProds));
            const savedCats = localStorage.getItem('coffee_categories');
            if (savedCats) setCategories(JSON.parse(savedCats));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Modals state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);

    // Form inputs state
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formCategory, setFormCategory] = useState('Drinks');
    const [formPrice, setFormPrice] = useState('');
    const [formAvailable, setFormAvailable] = useState(true);
    const [formEmoji, setFormEmoji] = useState('🥤');

    // Custom Toast notification state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    // Filtered and Searched Products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === 'All' ||
                product.category.toLowerCase() === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    // Open modal for Adding a new Item
    const handleAddNewClick = () => {
        setEditingProduct(null);
        setFormName('');
        setFormDescription('');
        setFormCategory('Drinks');
        setFormPrice('');
        setFormAvailable(true);
        setFormEmoji('🥤');
        setIsFormModalOpen(true);
    };

    // Open modal for Editing an Item
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormName(product.name);
        setFormDescription(product.description);
        setFormCategory(product.category);
        setFormPrice(product.price.toString());
        setFormAvailable(product.available);
        setFormEmoji(product.icon);
        setIsFormModalOpen(true);
    };

    // Open modal for Deleting an Item
    const handleDeleteClick = (id) => {
        setDeletingProductId(id);
        setIsDeleteModalOpen(true);
    };

    // Toggle Availability state
    const handleToggleAvailability = (id) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === id ? { ...p, available: !p.available } : p
            )
        );
        const updatedProd = products.find(p => p.id === id);
        if (updatedProd) {
            showToast(`"${updatedProd.name}" availability updated successfully!`);
        }
    };

    // Save product (Add or Update)
    const handleSaveProduct = (e) => {
        e.preventDefault();
        if (!formName || !formPrice) return;

        const matchedEmoji = EMOJI_OPTIONS.find(e => e.char === formEmoji) || EMOJI_OPTIONS[0];

        if (editingProduct) {
            // Update existing product
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === editingProduct.id
                        ? {
                            ...p,
                            name: formName,
                            description: formDescription,
                            category: formCategory,
                            price: parseFloat(formPrice),
                            available: formAvailable,
                            icon: formEmoji,
                            iconBg: matchedEmoji.bg
                        }
                        : p
                )
            );
            showToast(`"${formName}" updated successfully!`);
        } else {
            // Add new product
            const newProduct = {
                id: Date.now(),
                name: formName,
                description: formDescription,
                category: formCategory,
                price: parseFloat(formPrice),
                available: formAvailable,
                icon: formEmoji,
                iconBg: matchedEmoji.bg
            };
            setProducts(prevProducts => [newProduct, ...prevProducts]);
            showToast(`"${formName}" added successfully!`);
        }

        setIsFormModalOpen(false);
    };

    // Confirm delete product
    const handleConfirmDelete = () => {
        const deletedProduct = products.find(p => p.id === deletingProductId);
        setProducts(prevProducts => prevProducts.filter(p => p.id !== deletingProductId));
        if (deletedProduct) {
            showToast(`"${deletedProduct.name}" removed from menu.`);
        }
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
                    <h1 className="text-3xl font-bold text-white tracking-tight">Menu Management</h1>
                    <p className="text-gray-400 mt-1">{products.length} items — manage availability & details</p>
                </div>

                {/* Add Item Button */}
                <button
                    onClick={handleAddNewClick}
                    className="flex items-center gap-2 px-5 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-black rounded-xl font-bold transition-all duration-200 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 text-[15px]"
                >
                    <Plus size={20} className="stroke-[2.5]" />
                    Add Item
                </button>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#1C2536] text-white placeholder-gray-500 border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.name;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-200 text-sm ${isActive
                                    ? 'bg-[#F59E0B] text-black shadow-lg shadow-amber-500/5'
                                    : 'bg-[#1C2536]/80 text-gray-400 hover:bg-[#1C2536] hover:text-gray-200 border border-gray-800'
                                    }`}
                            >
                                <span>{isActive && cat.activeIcon ? cat.activeIcon : cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Products Table Card */}
            <div className="bg-[#1C2536]/40 backdrop-blur-md rounded-2xl border border-gray-800/60 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-800/80 bg-[#1C2536]/60 text-xs font-bold uppercase tracking-wider text-gray-400">
                                <th className="px-6 py-4.5">Item</th>
                                <th className="px-6 py-4.5">Category</th>
                                <th className="px-6 py-4.5">Price</th>
                                <th className="px-6 py-4.5">Available</th>
                                <th className="px-6 py-4.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/40">
                            <AnimatePresence initial={false}>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            layoutId={`product-row-${product.id}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-[#1C2536]/20 transition-colors"
                                        >
                                            {/* Name & Details Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-11 h-11 rounded-xl ${product.iconBg} flex items-center justify-center text-2xl shadow-inner`}>
                                                        {product.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-[15px] group-hover:text-blue-400 transition-colors">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-gray-400 text-xs mt-0.5 max-w-[320px] truncate">
                                                            {product.description || 'No description available'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category Badge Column */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 bg-[#1E2533] border border-gray-800/80 rounded-md text-[10px] font-bold text-gray-300 tracking-widest uppercase">
                                                    {product.category}
                                                </span>
                                            </td>

                                            {/* Price Column */}
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-[#F59E0B] text-[15px]">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            </td>

                                            {/* Availability Toggle Switch */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleAvailability(product.id)}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${product.available ? 'bg-[#10B981]' : 'bg-gray-700/60'
                                                        }`}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${product.available ? 'translate-x-5' : 'translate-x-0'
                                                            }`}
                                                    />
                                                </button>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <button
                                                        onClick={() => handleEditClick(product)}
                                                        className="p-2 bg-[#1E2533] hover:bg-[#2C374D] text-gray-300 rounded-lg transition-colors border border-gray-800"
                                                        title="Edit Product"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(product.id)}
                                                        className="p-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors shadow-lg shadow-red-500/10"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <AlertTriangle className="text-gray-500" size={32} />
                                                <div className="text-gray-400 font-bold">No products found</div>
                                                <div className="text-gray-500 text-sm">Try searching for something else or add a new item</div>
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
                            className="relative w-full max-w-lg bg-[#1C2536] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800">
                                <h3 className="text-xl font-bold text-white">
                                    {editingProduct ? 'Edit Menu Item' : 'Add New Item'}
                                </h3>
                                <button
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">

                                {/* Item Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Mocha Chilled Brew"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#131924] text-white border border-gray-850 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Category Selection */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Category
                                        </label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#131924] text-white border border-gray-850 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            {categories
                                                .filter(cat => cat.id !== 'All')
                                                .map(cat => (
                                                    <option key={cat.id} value={cat.name}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Price ($) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            step="0.01"
                                            min="0"
                                            placeholder="e.g. 3.50"
                                            value={formPrice}
                                            onChange={(e) => setFormPrice(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#131924] text-white border border-gray-850 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Emoji Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                                        Choose Icon/Emoji
                                    </label>
                                    <div className="grid grid-cols-8 gap-2 p-3 bg-[#131924] rounded-xl border border-gray-850 max-h-[120px] overflow-y-auto">
                                        {EMOJI_OPTIONS.map((emoji) => (
                                            <button
                                                key={emoji.char}
                                                type="button"
                                                onClick={() => setFormEmoji(emoji.char)}
                                                className={`text-2xl p-1.5 rounded-lg hover:bg-gray-800 transition-colors ${formEmoji === emoji.char ? 'bg-[#1E65FF]/20 border border-[#1E65FF]' : 'border border-transparent'
                                                    }`}
                                            >
                                                {emoji.char}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        placeholder="Short description of ingredients, size, preparation..."
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#131924] text-white border border-gray-850 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    />
                                </div>

                                {/* Availability Toggle */}
                                <div className="flex items-center justify-between p-3.5 bg-[#131924] rounded-xl border border-gray-850">
                                    <div>
                                        <div className="font-bold text-white text-sm">Available for Order</div>
                                        <div className="text-gray-500 text-xs mt-0.5">Toggle to set in/out of stock instantly</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormAvailable(!formAvailable)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formAvailable ? 'bg-[#10B981]' : 'bg-gray-700'
                                            }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formAvailable ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-gray-850">
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
                                        {editingProduct ? 'Save Changes' : 'Create Item'}
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
                                <h3 className="text-lg font-bold text-white">Delete Menu Item</h3>
                            </div>

                            <p className="text-gray-400 text-[15px] leading-relaxed">
                                Are you sure you want to delete this menu item? This action is permanent and cannot be undone.
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
                                    Delete Item
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
