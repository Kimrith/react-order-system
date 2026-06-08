const API_URL = import.meta.env.VITE_API_URL;

export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Login failed');
  }
  return response.json();
};

export const registerUser = async (details) => {
  const response = await fetch(`${API_URL}/Auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Registration failed');
  }
  return response.json();
};

export const registerManagement = async (details) => {
  const response = await fetch(`${API_URL}/Auth/register-management`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(details),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Management registration failed');
  }
  return response.json();
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL.replace('/api', '')}/api/user`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const updateUser = async (id, data) => {
  const response = await fetch(`${API_URL.replace('/api', '')}/api/user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Failed to update user');
  }
  // 204 No Content
};

export const resetPassword = async (id, newPassword) => {
  const response = await fetch(`${API_URL.replace('/api', '')}/api/user/${id}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ newPassword }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Failed to reset password');
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL.replace('/api', '')}/api/user/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Failed to delete user');
  }
  // 204 No Content
};
