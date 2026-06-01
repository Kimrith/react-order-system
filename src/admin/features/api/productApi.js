// src/admin/features/api/productApi.js
// Centralized API helper for product management.
// Uses Vite's environment variable for base URL (VITE_API_BASE_URL).

const BASE_URL = import.meta.env.VITE_API_URL;

/** Fetch all products */
export const fetchProducts = async (categoryId = null, searchTerm = '') => {
    const params = new URLSearchParams();
    if (categoryId) params.append('CategoryId', categoryId);
    if (searchTerm) params.append('SearchTerm', searchTerm);
    const queryString = params.toString();
    const url = `${BASE_URL}/api/product${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
};

/** Get a single product by ID */
export const getProduct = async (id) => {
    const res = await fetch(`${BASE_URL}/api/product/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return await res.json();
};

/** Create a new product */
export const createProduct = async (formData) => {
    const res = await fetch(`${BASE_URL}/api/product`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
};

/** Update an existing product (PUT) */
export const updateProduct = async (id, formData) => {
    const res = await fetch(`${BASE_URL}/api/product/${id}`, {
        method: 'PUT',
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
};

/** Toggle product availability (PATCH) */
export const setProductAvailability = async (id, isAvailable) => {
    const res = await fetch(`${BASE_URL}/api/product/${id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable }),
    });
    if (!res.ok) throw new Error('Failed to update availability');
    const text = await res.text();
    return text ? JSON.parse(text) : null;
};

/** Delete a product */
export const deleteProduct = async (id) => {
    const res = await fetch(`${BASE_URL}/api/product/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    const text = await res.text();
    return text ? JSON.parse(text) : null;
};
