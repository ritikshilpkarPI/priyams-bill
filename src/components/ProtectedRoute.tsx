import React from 'react';
import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../utils/constants/routes';

const ProtectedRoute = () => {
const token = Cookies.get('token');
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
