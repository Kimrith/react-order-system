const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7293/api';

export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/Orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data; // Return full response which contains totalAllAmount, totalCount, and orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null;
  }
};

export const updateOrderStatus = async (id, status, fullOrder = null) => {
  try {
    // The backend uses PUT instead of PATCH, and the route is /api/Orders/{id}
    const response = await fetch(`${API_URL}/Orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      // We only send id and status. The backend's PUT endpoint seems to act as a partial update,
      // and sending the full order with navigation properties (items, product) can cause 
      // Entity Framework tracking errors.
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order status. Status: ${response.status}`);
    }

    // PUT often returns 204 No Content
    if (response.status === 204) return { id, status };
    
    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const fetchOrderHistory = async (from = null, to = null) => {
  try {
    let url = `${API_URL}/Orders/history/staff`;
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch order history');
    return await response.json(); // expected to return { totalAllAmount, totalCount, orders } or similar depending on the exact backend shape. We'll handle both cases in the component.
  } catch (error) {
    console.error('Error fetching order history:', error);
    return null;
  }
};
