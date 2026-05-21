/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';

const KanbanPipeline = lazy(() => import('../pages/KanbanPipeline'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const JobsManagement = lazy(() => import('../pages/JobsManagement'));

export const appRoutes = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/jobs',
    element: <JobsManagement />, 
  },
  {
    path: '/pipeline/:jobId',
    element: <KanbanPipeline />, 
  },
];