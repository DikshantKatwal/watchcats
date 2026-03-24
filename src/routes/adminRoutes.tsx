import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import User from "../pages/admin/User";
import AdminLayout from "../layout/AdminLayout";
import Customer from "../pages/admin/Customers";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="/user" element={<User />} />
                <Route path="/customer" element={<Customer />} />

            </Route>
        </Routes>
    );
}
