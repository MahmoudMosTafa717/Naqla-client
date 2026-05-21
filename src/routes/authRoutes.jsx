/* eslint-disable react-refresh/only-export-components */ // for not showing error about lazy loaded components
import { lazy } from 'react';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

export const authRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
];
