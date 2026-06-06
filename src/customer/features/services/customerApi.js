const API_URL = import.meta.env.VITE_API_URL || "http://3.27.242.36/api";

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

export const generateKHQR = async (paymentData) => {
  try {
    const res = await fetch(`${API_URL}/generate-khqr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", // Tell the server you expect JSON back
      },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("KHQR Generation Error:", error);
    throw error; // Re-throw so the UI can show an error message
  }
};

// get QR Code image from invoice
export const getQrCode = async (invoice) => {
  const res = await fetch(`${API_URL}/qr-image/${invoice}`);
  if (!res.ok) {
    throw new Error("Failed to fetch QR image");
  }
  return await res.blob(); // ✅ FIX HERE
};

// Check payment status
export const checkPaymentStatus = async (invoice) => {
  const res = await fetch(`${API_URL}/check-payment/${invoice}`);
  if (!res.ok) return null; // Handle 404/errors gracefully
  return await res.json();
};

// Search products by name
export const searchProductsByName = async (name) => {
  const res = await fetch(
    `${API_URL}/Product?name=${encodeURIComponent(name)}`,
  );
  if (!res.ok) {
    throw new Error("Failed to search products");
  }
  return res.json();
};

export const getTableByToken = async (token) => {
  // If your backend has an endpoint that accepts the token directly:
  const res = await fetch(`${API_URL}/api/TableQr/${encodeURIComponent(token)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch table data");
  }
  return res.json();
};

// get all tables
export const getTables = async () => {
  const res = await fetch(`${API_URL}/TableQr`);
  if (!res.ok) {
    throw new Error("Failed to fetch tables");
  }
  return res.json();
};
