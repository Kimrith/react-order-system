import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"; // Import this hook
import { getProduct, postOrder } from "../services/customerApi";

export default function Product() {
  const [products, setProducts] = useState([]);

  // 1. Grab the searchQuery passed from the Header's <Outlet />
  const { searchQuery } = useOutletContext();

  // Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("my_order");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // Fetch products
  useEffect(() => {
    getProduct()
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("my_order", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // ADD TO CART
  const handleAdd = (product) => {
    const productId = String(product.id);
    setCart((prev) => {
      const currentQty = prev[productId]?.quantity || 0;
      return {
        ...prev,
        [productId]: {
          productId,
          productName: product.name,
          quantity: currentQty + 1,
          price: product.price,
          description: product.description,
          image: `${import.meta.env.VITE_IMAGE_URL}${product.productImg}`,
        },
      };
    });
  };

  // CHECKOUT POST
  const handleCheckout = async () => {
    try {
      const payload = {
        tableId: 3,
        items: Object.values(cart).map((item) => ({
          productId: Number(item.productId),
          quantity: item.quantity,
          specialInstructions: "",
        })),
      };
      await postOrder(payload);
      alert("Order created successfully!");
      setCart({});
      localStorage.removeItem("my_order");
    } catch (err) {
      console.error(err);
      alert("Failed to create order");
    }
  };

  // 2. Filter products dynamically based on Name OR ID
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // Show everything if search is empty

    const matchesId = String(product.id).includes(query);
    const matchesName = product.name?.toLowerCase().includes(query);

    return matchesId || matchesName;
  });

  // PRODUCT CARD COMPONENT
  const ProductCard = ({ product }) => {
    const productId = String(product.id);
    const qty = cart[productId]?.quantity || 0;
    const { name, description, price, isAvailable, productImg } = product;

    return (
      <div className="group bg-[#2D3748] rounded-2xl p-4 border border-[#4A5568] flex flex-col transition-all hover:shadow-2xl hover:border-[#FFBB33]/50 hover:-translate-y-1 relative">
        <div className="relative aspect-square mb-4 rounded-xl bg-[#1A202E]/50 overflow-hidden flex items-center justify-center p-4">
          <img
            src={`${import.meta.env.VITE_IMAGE_URL}${productImg}`}
            alt={name}
            className={`w-full h-full object-contain transition-transform duration-300 ${isAvailable && "group-hover:scale-110"}`}
          />
          {qty > 0 && (
            <div className="absolute top-2 right-2 bg-[#FFBB33] text-[#1A202E] font-bold text-xs px-2 py-1 rounded-lg shadow-md">
              {qty}
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold uppercase tracking-widest text-xs bg-red-600 px-3 py-4 rounded-full shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-1">
            <h4 className="text-white font-bold text-base">{name}</h4>
            {/* Added small visual label for ID to assist testing */}
            <span className="text-gray-500 text-[10px]">#{product.id}</span>
          </div>
          <p className="text-gray-400 text-xs mt-1.5xl line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#4A5568]/50">
          <span className="text-[#FFBB33] font-black text-lg">${price}</span>
          <button
            onClick={() => handleAdd(product)}
            disabled={!isAvailable}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-[#1A202E] transition ${
              isAvailable
                ? "bg-[#FFBB33]"
                : "bg-[#FFBB33] opacity-50 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/xl"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 3. Render filteredProducts instead of products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No items found matching "{searchQuery}"
        </div>
      )}

      {/* CHECKOUT BUTTON */}
      <div className="fixed bottom-5 right-5">
        <button
          onClick={handleCheckout}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-2xl shadow-xl"
        >
          Cash (Testing)
        </button>
      </div>
    </div>
  );
}
