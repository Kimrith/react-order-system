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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<CustomerDashboard />} />
        <Route path="/customer/*" element={<Navigate to="/" replace />} />
        <Route path="/staff/*" element={<StaffDashboard />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}
