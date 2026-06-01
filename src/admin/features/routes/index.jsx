import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import Dashboard from '../features/dashboard/Dashboard';
import MenuManagement from '../features/products/MenuManagement';
import TableManagement from '../features/tableManage/TableManage';
import Category from '../features/categories/category';
import OrderHistory from '../features/orderHistory/OrderHistory';
import DiscountManage from '../features/discounts/DiscountManage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="" element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<MenuManagement />} />
        <Route path="categories" element={<Category />} />
        <Route path="tables" element={<TableManagement />} />
        <Route path="history" element={<OrderHistory />} />
        <Route path="discounts" element={<DiscountManage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;