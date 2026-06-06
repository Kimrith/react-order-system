import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, ShoppingCart, Coffee, Wine, Pizza, IceCream, Cookie, ArrowLeft, Trash2, Wallet, QrCode } from 'lucide-react';
import { getProduct, postOrder, getCategories, getTables } from '../../customer/features/services/customerApi';



export default function CreateOrder() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All', icon: <div className="w-2 h-2 rounded-full bg-white mr-2" /> }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState({}); // { [productId]: quantity }
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checkout state
  const [isCheckoutView, setIsCheckoutView] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData, tablesData] = await Promise.all([
          getProduct(),
          getCategories(),
          getTables()
        ]);

        setProducts(productsData || []);
        
        if (tablesData && tablesData.length > 0) {
          setTables(tablesData);
          setSelectedTable(tablesData[0].tableId);
        }

        const categoryIcons = {
          'Drinks': <Wine size={14} className="mr-2 text-pink-400" />,
          'Food': <Pizza size={14} className="mr-2 text-orange-400" />,
          'Desserts': <IceCream size={14} className="mr-2 text-yellow-100" />,
          'Snacks': <Cookie size={14} className="mr-2 text-yellow-600" />,
        };

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
    fetchData();
  }, []);

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) return;
    setIsCheckoutView(true);
  };

  const handleSubmitOrder = async () => {
    if (Object.keys(cart).length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        tableId: selectedTable, // Keep as string or whatever the API returned
        items: Object.entries(cart).map(([productId, quantity]) => ({
          productId: Number(productId),
          quantity,
          specialInstructions: specialInstructions,
        })),
      };

      await postOrder(payload);
      alert("Order created successfully!");
      setCart({});
      setIsCheckoutView(false);
      setSpecialInstructions('');
    } catch (err) {
      console.error(err);
      alert("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (product) => {
    setCart((prev) => {
      const currentQty = prev[product.id] || 0;
      if (currentQty <= 1) {
        const newCart = { ...prev };
        delete newCart[product.id];
        // If cart is empty, go back to menu
        if (Object.keys(newCart).length === 0) {
          setIsCheckoutView(false);
        }
        return newCart;
      }
      return {
        ...prev,
        [product.id]: currentQty - 1,
      };
    });
  };

  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => String(p.id) === String(id));
    return sum + (product?.price || 0) * qty;
  }, 0);

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || String(p.categoryId) === String(activeCategory);
    return matchesSearch && matchesCategory;
  });

  if (isCheckoutView) {
    return (
      <div className="flex h-full gap-8 relative">
        {/* Left Column - Order Details */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center mb-8 shrink-0">
            <button
              onClick={() => setIsCheckoutView(false)}
              className="mr-4 text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Your Order</h1>
              <p className="text-gray-500 text-sm">
                Table <span className="text-yellow-500 font-bold">{selectedTable}</span>
              </p>
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar pr-2 pb-8">
            {Object.entries(cart).map(([productId, qty]) => {
              const product = products.find(p => String(p.id) === productId);
              if (!product) return null;
              const imageUrl = `${import.meta.env.VITE_IMAGE_URL || ""}${product.productImg}`;

              return (
                <div key={productId} className="flex items-center justify-between py-4 border-b border-[#2a2a35] group">
                  <div className="flex items-center gap-4">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#1e2336] p-1"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/2a2a35/a0a0a0?text=No+Img'; }}
                    />
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1">{product.name}</h3>
                      <p className="text-gray-500 text-[11px]">${product.price?.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 bg-[#1e2336] rounded-full p-1.5 px-3 border border-[#2a2a35]">
                      <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {qty <= 1 ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={3} />}
                      </button>
                      <span className="text-white font-bold text-sm w-4 text-center">{qty}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                    <span className="text-yellow-500 font-bold text-base w-16 text-right">
                      ${(product.price * qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Special Instructions */}
            <div className="mt-8">
              <h3 className="text-gray-500 font-bold text-[10px] tracking-wider uppercase mb-3">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any allergies, preferences, or special requests..."
                className="w-full bg-[#1e2336] border border-transparent focus:border-gray-700 text-white placeholder-gray-600 rounded-xl p-4 h-32 outline-none resize-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Payment */}
        <div className="w-[340px] shrink-0 flex flex-col h-full pb-8">
          <div className="bg-[#1e2336] rounded-2xl p-6 flex flex-col h-fit border border-[#2a2a35]/50">
            {/* Total */}
            <div className="flex justify-between items-center mb-8 border-b border-[#2a2a35] pb-6">
              <span className="text-gray-400 font-bold text-sm">Total</span>
              <span className="text-yellow-500 text-2xl font-black">${cartTotal.toFixed(2)}</span>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-gray-500 font-bold text-[10px] tracking-wider uppercase mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-start p-4 rounded-xl border transition-all ${paymentMethod === 'cash' ? 'border-yellow-500 bg-yellow-500/10' : 'border-[#2a2a35] bg-[#15192b] hover:border-gray-600'}`}
                >
                  <div className={`mb-3 ${paymentMethod === 'cash' ? 'text-yellow-500' : 'text-gray-400'}`}>
                    <Wallet size={20} />
                  </div>
                  <span className={`font-bold text-sm mb-1 ${paymentMethod === 'cash' ? 'text-yellow-500' : 'text-gray-300'}`}>Cash</span>
                  <span className="text-gray-500 text-[10px]">Pay at the table</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('khqr')}
                  className={`flex flex-col items-start p-4 rounded-xl border transition-all ${paymentMethod === 'khqr' ? 'border-yellow-500 bg-yellow-500/10' : 'border-[#2a2a35] bg-[#15192b] hover:border-gray-600'}`}
                >
                  <div className={`mb-3 ${paymentMethod === 'khqr' ? 'text-yellow-500' : 'text-gray-400'}`}>
                    <QrCode size={20} />
                  </div>
                  <span className={`font-bold text-sm mb-1 ${paymentMethod === 'khqr' ? 'text-yellow-500' : 'text-gray-300'}`}>KHQR</span>
                  <span className="text-gray-500 text-[10px]">Digital Bakong</span>
                </button>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-black py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-70 flex justify-center items-center hover:-translate-y-1"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-950"></div>
              ) : (
                `Place Order - $${cartTotal.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Coffee size={24} className="text-gray-300" />
              <h1 className="text-2xl font-bold text-white">Our Menu</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Table</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-[#1e2336] text-yellow-500 font-bold border-none outline-none cursor-pointer appearance-none px-1"
              >
                {tables.map(t => (
                  <option key={t.tableId} value={t.tableId}>{t.tableId}</option>
                ))}
              </select>
              <span className="text-yellow-500 font-bold text-xs">▼</span>
            </div>
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

        <div className="bg-[#2a2a35]/60 border border-[#32323e] px-4 py-1.5 rounded-full">
          <span className="text-[#a0a0a0] font-bold text-xs tracking-widest">CAFÉ POS</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto hide-scrollbar shrink-0 pb-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${isActive
                ? 'bg-yellow-500 text-yellow-950'
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

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              const qty = cart[product.id] || 0;
              const isAvailable = product.isAvailable !== false; // Default to true if undefined
              const imageUrl = `${import.meta.env.VITE_IMAGE_URL || ""}${product.productImg}`;

              return (
                <div
                  key={product.id}
                  className={`bg-[#1e2336] rounded-2xl p-4 flex flex-col relative group transition-all duration-300 ${!isAvailable ? 'opacity-50 grayscale' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20'}`}
                >
                  {/* Image Container */}
                  <div className="w-full aspect-square rounded-xl bg-[#15192b]/50 mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x400/2a2a35/a0a0a0?text=No+Image';
                      }}
                    />
                    {!isAvailable && (
                      <div className="absolute top-2 bg-red-500/90 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                        Sold Out
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-sm leading-tight mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-[10px] leading-snug line-clamp-2 mb-3 flex-1">
                      {product.description || 'Classic refreshing beverage'}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-yellow-500 font-black text-base">${product.price?.toFixed(2)}</span>

                      {isAvailable ? (
                        qty > 0 ? (
                          <div className="flex items-center gap-2 bg-[#15192b] rounded-full p-1 border border-[#2a2a35]">
                            <button
                              onClick={() => handleRemoveFromCart(product)}
                              className="w-6 h-6 rounded-full bg-[#2a2a35] text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                            >
                              <Minus size={12} strokeWidth={3} />
                            </button>
                            <span className="text-white font-bold text-xs w-3 text-center">{qty}</span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-6 h-6 rounded-full bg-yellow-500 text-yellow-950 flex items-center justify-center hover:bg-yellow-400 transition-colors"
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-8 h-8 rounded-full bg-yellow-500 text-yellow-950 flex items-center justify-center hover:bg-yellow-400 hover:scale-110 transition-all shadow-lg shadow-yellow-500/20"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        )
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#2a2a35] text-gray-500 flex items-center justify-center cursor-not-allowed">
                          <Plus size={16} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-75 disabled:cursor-not-allowed text-yellow-950 px-6 py-3.5 rounded-full font-black text-sm flex items-center gap-3 shadow-2xl shadow-yellow-500/20 hover:scale-105 transition-all group"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-950"></div>
            ) : (
              <ShoppingCart size={18} />
            )}
            <span className="bg-yellow-950/10 w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {cartItemsCount}
            </span>
            <span>${cartTotal.toFixed(2)}</span>
            <span className="ml-1 group-hover:translate-x-1 transition-transform">❯</span>
          </button>
        </div>
      )}
    </div>
  );
}
