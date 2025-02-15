import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    if (roles.length === 0) {
        return <Navigate to="/login" replace />;
    }

    const hasPermission = allowedRoles.some(role => roles.includes(role));

    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;