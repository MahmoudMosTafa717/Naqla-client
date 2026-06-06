/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import CandidateOnboardingGuard from "../components/auth/CandidateOnboardingGuard";
import EmployerApprovedGuard from "../components/auth/EmployerApprovedGuard";
import CandidateDetails from "../pages/CandidateDetails";

const KanbanPipeline = lazy(() => import("../pages/KanbanPipeline"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const JobsManagement = lazy(() => import("../pages/JobsManagement"));
const UIKit = lazy(() => import("../pages/UIKit"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const ProfileBuilder = lazy(() => import("../pages/ProfileBuilder"));
const CandidateProfile = lazy(() => import("../pages/CandidateProfile"));
const EmployerDashboard = lazy(() => import("../pages/EmployerDashboard"));
const EmployerHrDashboard = lazy(() => import("../pages/EmployerHrDashboard"));
const EmployerOnboarding = lazy(() => import("../pages/EmployerOnboarding"));
const EmployerCompanyOnboarding = lazy(
  () => import("../pages/EmployerCompanyOnboarding"),
);
const EmployerPendingApproval = lazy(
  () => import("../pages/EmployerPendingApproval"),
);
const JobFormPage = lazy(() => import("../pages/JobFormPage"));


export const appRoutes = [
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/jobs",
        element: <JobsManagement />,
      },
      {
        path: "/pipeline/:jobId",
        element: <KanbanPipeline />,
      },
      {
        // sboha kda l7ad ma a5ls kol ma y5os a pipline w kda 
        path: "/pipeline",
        element: <KanbanPipeline />,
      },
      {
        path: "/CandidateDetails",
        element: <CandidateDetails />,
      },
      {
        path: "/uikit",
        element: <UIKit />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        element: <CandidateOnboardingGuard />,
        children: [
          {
            path: "/candidate/profile-builder",
            element: <ProfileBuilder />,
            handle: { allowedRoles: ["candidate"] },
          },
          {
            path: "/candidate/profile",
            element: <CandidateProfile />,
            handle: { allowedRoles: ["candidate"] },
          },
          {
            path: "/profile",
            element: <CandidateProfile />,
            handle: { allowedRoles: ["candidate"] },
          },
        ],
      },
      {
        path: "/employer/company-onboarding",
        element: <EmployerCompanyOnboarding />,
        handle: { allowedRoles: ["employer"] },
      },
      {
        path: "/employer/pending-approval",
        element: <EmployerPendingApproval />,
        handle: { allowedRoles: ["employer"] },
      },
      {
        path: "/employer/hr-dashboard",
        element: <EmployerHrDashboard />,
        handle: { allowedRoles: ["employer"] },
      },
      {
        path: "/employer/onboarding",
        element: <EmployerOnboarding />,
        handle: { allowedRoles: ["employer"] },
      },
      {
        element: <EmployerApprovedGuard />,
        children: [
          {
            path: "/employer/dashboard",
            element: <EmployerDashboard />,
            handle: { allowedRoles: ["employer"] },
          },
          {
            path: "/employer/company/:companyId",
            element: <EmployerDashboard />,
            handle: { allowedRoles: ["employer"] },
          },
          {
            path: "/employer/company/:companyId/jobs",
            element: <JobsManagement />,
            handle: { allowedRoles: ["employer"] },
          },
          {
            path: "/jobs/create",
            element: <JobFormPage mode="create" />,
            handle: { allowedRoles: ["employer"] },
          },
          {
            path: "/jobs/:jobId/edit",
            element: <JobFormPage mode="edit" />,
            handle: { allowedRoles: ["employer"] },
          },
        ],
      },
    ],
  },
];
