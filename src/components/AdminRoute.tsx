import React from 'react';
import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../utils/constants/routes';
import { USER_ROLE } from '../utils/constants/userRole';
import { parseJwt } from '../utils/cookie';

const AdminRoute = () => {
    const { role: userRole = '' } =  parseJwt(Cookies.get('token'))
  if (USER_ROLE.ADMIN === userRole) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
