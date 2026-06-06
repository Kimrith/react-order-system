const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const fetchOrderAnalytics = async (days = 7) => {
    const res = await fetch(`${BASE_URL}/Orders/analytics?days=${days}`);
    if (!res.ok) throw new Error('Failed to fetch order analytics');
    return await res.json();
};
