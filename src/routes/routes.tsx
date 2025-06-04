import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import UnAuthorizedRoute from '../components/UnAuthorizedRoute';
import AdminRoute from '../components/AdminRoute';
import { ROUTES } from '../utils/constants/routes';
import CustomerBill from '../Pages/CustomerBill';

import {
  DayWiseBillFeed,
  Report,
  Login
} from '../Pages';
import App from '../App';
import { parseJwtToken } from '../utils/cookie';
import { protectedRouteMap } from './protectedRouteMap';

const { allowedRoutes = [], role = '' } = parseJwtToken() ?? {};

export const authorizedRouteList =
  role === 'admin'
    ? Object.values(protectedRouteMap)
    : allowedRoutes
        .map((key: string) => protectedRouteMap[key])
        .filter(Boolean);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            path: ROUTES.DAY_BILL,
            element: <DayWiseBillFeed />,
            index: true,
          },
          {
            path: ROUTES.REPORT,
            element: <Report />,
            index: true,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: authorizedRouteList,
      },
      {
        element: <UnAuthorizedRoute />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <Login />,
            index: true,
          },
        ],
      },
      {
        path: ROUTES.CUSTOMER_BILL,
        element: <CustomerBill />,
        index: true,
      },
    ],
  },
  {
    path: '*',
    element: <>Page Not Found - 404</>,
  },
]);
