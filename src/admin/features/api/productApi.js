// src/admin/features/productApi.js
// Centralized API helper for product management.
// Uses Vite's environment variable for base URL (VITE_API_BASE_URL).

const BASE_URL = import.meta.env.VITE_API_URL;

/** Fetch all products */
export const fetchProducts = async (categoryId = null, searchTerm = '', discountStatus = null) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('CategoryId', categoryId);
    if (searchTerm) params.append('SearchTerm', searchTerm);
    if (discountStatus) params.append('DiscountStatus', discountStatus);
    const queryString = params.toString();
    const url = `${BASE_URL}/Product${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
};

/** Get a single product by ID */
export const getProduct = async (id) => {
    const res = await fetch(`${BASE_URL}/product/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return await res.json();
};

/** Create a new product */
export const createProduct = async (formData) => {
    const res = await fetch(`${BASE_URL}/product`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
};

/** Update an existing product (PUT) */
export const updateProduct = async (id, formData) => {
    const res = await fetch(`${BASE_URL}/product/${id}`, {
        method: 'PUT',
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
};

/** Toggle product availability (PATCH) */
export const setProductAvailability = async (id, isAvailable) => {
    const res = await fetch(`${BASE_URL}/product/${id}/availability`, {
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
    const res = await fetch(`${BASE_URL}/product/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    const text = await res.text();
    return text ? JSON.parse(text) : null;
};

/** Fetch top products by quantity or revenue */
export const fetchTopProducts = async (limit = 5, sortBy = 'qty') => {
    const res = await fetch(`${BASE_URL}/Product/top?limit=${limit}&sortBy=${sortBy}`);
    if (!res.ok) throw new Error('Failed to fetch top products');
    return await res.json();
};

/** Apply discount to a product */
export const applyDiscount = async (id, discountData) => {
    const res = await fetch(`${BASE_URL}/product/${id}/apply-discount`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountData),
    });
    if (!res.ok) throw new Error('Failed to apply discount');
    const text = await res.text();
    return text ? JSON.parse(text) : null;
};

/** Toggle discount status */
export const toggleDiscountStatus = async (id, isDiscountOverrideActive) => {
    const res = await fetch(`${BASE_URL}/Product/${id}/discount-toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDiscountOverrideActive }),
    });
    if (!res.ok) throw new Error('Failed to toggle discount status');
    const text = await res.text();
    return text ? JSON.parse(text) : null;
};
