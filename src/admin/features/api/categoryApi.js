import { fetchWithAuth } from '../../../auth/api/fetchWithAuth';
// src/admin/features/categoryApi.js

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7293";

export const fetchCategories = async () => {
    const res = await fetchWithAuth(`${BASE_URL}/Categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
};

export const createCategory = async (categoryData) => {
    const res = await fetchWithAuth(`${BASE_URL}/Categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return await res.json();
};

export const updateCategory = async (id, categoryData) => {
    const res = await fetchWithAuth(`${BASE_URL}/Categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    });
    if (!res.ok) throw new Error('Failed to update category');
    // PUT usually might return 204 No Content
    if (res.status === 204) return null;
    const text = await res.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

export const deleteCategory = async (id) => {
    const res = await fetchWithAuth(`${BASE_URL}/Categories/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete category');
    if (res.status === 204) return null;
    const text = await res.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};
