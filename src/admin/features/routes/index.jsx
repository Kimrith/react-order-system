import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import Dashboard from '../dashboard/Dashboard';
import MenuManagement from '../products/MenuManagement';
import TableManagement from '../tableManage/TableManage';
import Category from '../categories/category';
import OrderHistory from '../orderHistory/OrderHistory';
import DiscountManage from '../discounts/DiscountManage';
import UserManage from '../users/UserManage';

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
        <Route path="users" element={<UserManage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;