/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authcontext/useAuthContext';
import React from 'react';


const AuthLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) {
        // Waiting for the silent refresh to resolve — avoid a flash redirect
        return null // or a spinner: <FullPageSpinner />
    }

    if (isAuthenticated) {
        return <Navigate to="/admin" replace />
    }
    return (

        <React.Fragment>
            <Outlet />
        </React.Fragment>

    )
}


export default AuthLayout;
