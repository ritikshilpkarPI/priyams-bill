import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import UnAuthorizedRoute from '../components/UnAuthorizedRoute';
import AdminRoute from '../components/AdminRoute';
import { ROUTES } from '../utils/constants/routes';
import CustomerBill from '../Pages/CustomerBill';
import Cookies from 'js-cookie';

import {
  DayWiseBillFeed,
  Report,
  Login,
  Dashboard
} from '../Pages';
import App from '../App';
import { parseJwtToken } from '../utils/cookie';
import { protectedRouteMap } from './protectedRouteMap';
import ItemsByBrandOrCompanyPage from '../Pages/dealerCatalog/ItemsByBrandOrCompanyPage';

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
        index: true,
        element: <Navigate to={Cookies.get('token') ? ROUTES.BILLING : ROUTES.LOGIN} replace />
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <Dashboard />,
            index: true,
          },
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
      {
        path: ROUTES.ITEMS_BY_BRAND_OR_COMPANY,
        element: <ItemsByBrandOrCompanyPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={Cookies.get('token') ? ROUTES.BILLING : ROUTES.LOGIN} replace />
  },
]);
