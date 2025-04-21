import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        // Chưa đăng nhập
        return <Navigate to="/login" replace />;
    }

    try {
        // Giải mã token để lấy role
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Kiểm tra cả trường "role" hoặc "roles"
        let userRoles = [];

        if (payload.role) {
            // Nếu role là string thì chuyển thành mảng
            userRoles = typeof payload.role === 'string' ? [payload.role] : payload.role;
        } else if (payload.roles) {
            // Nếu đã là mảng thì giữ nguyên
            userRoles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
        }

        const isAllowed = allowedRoles.some(role => userRoles.includes(role));

        if (!isAllowed) {
            return <Navigate to="/unauthorized" replace />;
        }

        // Kiểm tra nếu có children thì render children, không thì render Outlet
        return children ? children : <Outlet />;
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;