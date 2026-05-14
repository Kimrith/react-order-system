const API_URL = import.meta.env.VITE_API_URL;

// list all categories
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/Categories`);

  console.log("URL:", `${API_URL}/Categories`); // DEBUG

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json();
};

// single category by id
export const getCategoryById = async (id) => {
  const res = await fetch(`${API_URL}/Categories/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch category");
  }

  return res.json();
};

// list all product
export const getProduct = async () => {
  const res = await fetch(`${API_URL}/Product`);

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

export const postOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/Orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "text/plain",
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    throw new Error("Failed to create order");
  }

  return await res.json();
};

// export const getOrders = async () => {
//   const res = await fetch(`${API_URL}/Orders`);
//   if (!res.ok) {
//     throw new Error("Failed to fetch orders");
//   }
//   return await res.json();
// };
