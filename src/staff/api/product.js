const API_URL = import.meta.env.VITE_API_URL || '/api';

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/Product`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const createProduct = async (productData) => {
  // If productData is FormData, fetch will automatically set the correct Content-Type (multipart/form-data) with boundary
  const isFormData = productData instanceof FormData;
  
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}/Product`, {
    method: "POST",
    headers,
    body: isFormData ? productData : JSON.stringify(productData),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
};

export const updateProduct = async (id, productData) => {
  const res = await fetch(`${API_URL}/Product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error("Failed to update product");
  
  if (res.status !== 204) {
    return await res.json().catch(() => ({}));
  }
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/Product/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  
  if (res.status !== 204) {
    return await res.json().catch(() => ({}));
  }
};

export const getTopProducts = async () => {
  const res = await fetch(`${API_URL}/Product/top`);
  if (!res.ok) throw new Error("Failed to fetch top products");
  return res.json();
};

export const updateProductAvailability = async (id, isAvailable) => {
  const res = await fetch(`${API_URL}/Product/${id}/availability`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isAvailable }),
  });
  if (!res.ok) throw new Error("Failed to update availability");

  if (res.status !== 204) {
    return await res.json().catch(() => ({}));
  }
};
