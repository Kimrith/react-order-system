import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CustomerDashboard from "./customer";
import AdminRoutes from "./admin/routes";
// import StaffDashboard from "./staff";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/customer/*" element={<Navigate to="/" replace />} />
        {/* <Route path="/staff/*" element={<StaffDashboard />} /> */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}