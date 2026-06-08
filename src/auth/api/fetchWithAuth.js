export const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  // Clone options and headers to avoid mutating original objects
  const newOptions = { ...options };
  const newHeaders = { ...newOptions.headers };

  if (token) {
    newHeaders['Authorization'] = `Bearer ${token}`;
  }

  newOptions.headers = newHeaders;

  return fetch(url, newOptions);
};
