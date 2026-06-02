import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CustomerDashboard from "./customer";
import StaffDashboard from "./staff";
import AdminDashboard from "./admin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<CustomerDashboard />} />
        <Route path="/customer/*" element={<Navigate to="/" replace />} />
        <Route path="/staff/*" element={<StaffDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
