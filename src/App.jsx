import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CustomerDashboard from "./customer/routes/CustomerRoutes";
import AdminRoutes from "./admin/features/routes";
import StaffDashboard from "./staff";
import { AuthProvider } from "./auth/store/AuthContext";
import RoleProtectedRoute from "./auth/RoleProtectedRoute";
import Login from "./auth/pages/login";
import Register from "./auth/pages/register";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<CustomerDashboard />} />
          <Route path="/customer/*" element={<Navigate to="/" replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/staff/*" 
            element={
              <RoleProtectedRoute allowedRoles={["Staff", "Admin"]}>
                <StaffDashboard />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <RoleProtectedRoute allowedRoles={["Admin"]}>
                <AdminRoutes />
              </RoleProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
