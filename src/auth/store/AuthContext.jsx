import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getInitialState = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return { token: null, user: null, roles: [] };

  try {
    const decoded = jwtDecode(token);
    let userRoles = [];
    if (decoded.role) {
      userRoles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
    } else if (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
      const claimRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      userRoles = Array.isArray(claimRole) ? claimRole : [claimRole];
    }
    return { token, user: decoded, roles: userRoles };
  } catch (err) {
    console.error('Invalid initial token:', err);
    localStorage.removeItem('auth_token');
    return { token: null, user: null, roles: [] };
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getInitialState);

  const token = authState.token;
  const user = authState.user;
  const roles = authState.roles;

  const login = (newToken) => {
    localStorage.setItem('auth_token', newToken);
    try {
      const decoded = jwtDecode(newToken);
      let userRoles = [];
      if (decoded.role) {
        userRoles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
      } else if (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        const claimRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        userRoles = Array.isArray(claimRole) ? claimRole : [claimRole];
      }
      setAuthState({ token: newToken, user: decoded, roles: userRoles });
    } catch (err) {
      console.error('Invalid token on login:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({ token: null, user: null, roles: [] });
  };

  return (
    <AuthContext.Provider value={{ token, user, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
