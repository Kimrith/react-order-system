import React from "react";

export default function Product() {
  const products = [
    {
      emoji: "🥤",
      name: "Coca-Cola",
      description: "Classic refreshing cola, served chilled",
      price: 1.5,
    },
    {
      emoji: "🍊",
      name: "Fresh Orange Juice",
      description: "Freshly squeezed, no preservatives",
      price: 3.0,
    },
    {
      emoji: "☕",
      name: "Iced Coffee",
      description: "Strong cold brew with milk",
      price: 2.5,
    },
    {
      emoji: "🧋",
      name: "Thai Milk Tea",
      description: "Creamy sweet tea with condensed milk",
      price: 2.75,
    },
    {
      emoji: "💧",
      name: "Sparkling Water",
      description: "Chilled sparkling mineral water",
      price: 1.0,
      isSoldOut: true,
    },
    {
      emoji: "🍔",
      name: "Beef Burger",
      description: "Angus beef patty with lettuce & cheese",
      price: 6.5,
    },
    {
      emoji: "🍚",
      name: "Chicken Fried Rice",
      description: "Wok-fried rice with egg & vegetables",
      price: 4.5,
    },
    {
      emoji: "🐟",
      name: "Grilled Salmon",
      description: "Fresh salmon fillet with steamed vegs",
      price: 9.0,
    },
  ];
  const ProductCard = ({ emoji, name, description, price, isSoldOut }) => {
    return (
      <div
        className={`bg-[#2D3748] rounded-xl p-5 border border-[#4A5568] flex flex-col justify-between relative ${isSoldOut ? "opacity-60" : ""}`}
      >
        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-10">
            Sold Out
          </div>
        )}

        {/* Product Image (Emoji) */}
        <div className="text-5xl flex justify-center items-center h-20 mb-3">
          {emoji}
        </div>

        <div>
          <h4 className="text-white font-semibold text-lg">{name}</h4>
          <p className="text-gray-400 text-sm mt-1 mb-4 h-10 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Price and Add Button */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-[#FFBB33] font-bold text-xl">
            ${price.toFixed(2)}
          </span>

          {/* Yellow Add Button */}
          <button
            className={`w-10 h-10 flex items-center justify-center rounded-full text-2xl font-bold transition ${isSoldOut ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-[#FFBB33] text-[#1A202E] hover:bg-[#E6A800]"}`}
            disabled={isSoldOut}
          >
            +
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={index} {...product} />
      ))}
    </div>
  );
}
