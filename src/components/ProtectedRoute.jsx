import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../lib/authStore';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const session = useAuthStore((state) => state.session);
    const profile = useAuthStore((state) => state.profile);
    const location = useLocation();

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && profile) {
        if (!allowedRoles.includes(profile.role)) {
            // Role not authorized, redirect to their default or home
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
