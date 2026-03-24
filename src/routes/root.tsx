
import { Routes, Route } from "react-router-dom";
import LoginForm from "../pages/auth/LoginForm";
import AdminRoutes from "./adminRoutes";
import AuthLayout from "../layout/AuthLayout";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/" element={<LoginForm />} />
            </Route>
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
    );
}
