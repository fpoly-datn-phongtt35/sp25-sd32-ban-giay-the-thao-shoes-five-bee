import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    let redirectPath = "/login"; // Mặc định

    try {
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));

            let userRoles = [];

            if (payload.role) {
                userRoles = typeof payload.role === 'string' ? [payload.role] : payload.role;
            } else if (payload.roles) {
                userRoles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
            }

            if (userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_STAFF")) {
                redirectPath = "/admin";
            } else if (userRoles.includes("ROLE_USER")) {
                redirectPath = "/home";
            }
        }
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        redirectPath = "/login";
    }

    return (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h1 style={{ fontSize: '36px', color: '#ff4d4f' }}>403 - Không có quyền truy cập</h1>
            <p>Bạn không có quyền để truy cập vào trang này.</p>
            <Button type="primary" onClick={() => navigate(redirectPath)}>Quay về trang chủ</Button>
        </div>
    );
};

export default Unauthorized;