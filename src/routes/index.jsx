/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { authRoutes } from './authRoutes';

const ProtectedLayout = () => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: appRoutes,
  },
  ...authRoutes,
  {
    path: '*',
    element: <div className="text-center p-10 font-bold">404 - Page Not Found</div>,
  },
]);