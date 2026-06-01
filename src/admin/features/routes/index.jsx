import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import Dashboard from '../dashboard/Dashboard';

const Products = () => <div className="p-6 text-white text-2xl">Products</div>;
const Categories = () => <div className="p-6 text-white text-2xl">Category Management</div>;
const TableManagement = () => <div className="p-6 text-white text-2xl">Table Management</div>;
const History = () => <div className="p-6 text-white text-2xl">History</div>;
const AuditLog = () => <div className="p-6 text-white text-2xl">Audit Log</div>;

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="tables" element={<TableManagement />} />
        <Route path="history" element={<History />} />
        <Route path="audit-log" element={<AuditLog />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;