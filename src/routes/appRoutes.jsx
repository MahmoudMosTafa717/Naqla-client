/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import CandidateOnboardingGuard from "../components/auth/CandidateOnboardingGuard";
import EmployerApprovedGuard from "../components/auth/EmployerApprovedGuard";
import CandidateDetails from "../pages/CandidateDetails";
import CandidateApplications from "../pages/CandidateApplications";

const KanbanPipeline = lazy(() => import("../pages/KanbanPipeline"));
// const Dashboard = lazy(() => import("../pages/Dashboard"));
const JobsManagement = lazy(() => import("../pages/JobsManagement"));
const UIKit = lazy(() => import("../pages/UIKit"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const ProfileBuilder = lazy(() => import("../pages/ProfileBuilder"));
const CandidateProfile = lazy(() => import("../pages/CandidateProfile"));
const EmployerDashboard = lazy(() => import("../pages/EmployerDashboard"));
const EmployerHrDashboard = lazy(() => import("../pages/EmployerHrDashboard"));
const EmployerProfile = lazy(() => import("../pages/EmployerProfile"));
const EmployerOnboarding = lazy(() => import("../pages/EmployerOnboarding"));
const EmployerCompanyOnboarding = lazy(
  () => import("../pages/EmployerCompanyOnboarding"),
);
const EmployerPendingApproval = lazy(
  () => import("../pages/EmployerPendingApproval"),
);
const JobFormPage = lazy(() => import("../pages/JobFormPage"));
const CandidateDashboard = lazy(() => import("../pages/CandidateDashboard"));
const JobSearch = lazy(() => import("../pages/JobSearch"));
const JobDetail = lazy(() => import("../pages/JobDetail"));
const SavedJobs = lazy(() => import("../pages/SavedJobs"));
const Notifications = lazy(() => import("../pages/Notifications"));
const HrAssistantPage = lazy(() => import("../pages/HrAssistantPage"));

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminUsers = lazy(() => import("../pages/AdminUsers"));
const AdminCompanies = lazy(() => import("../pages/AdminCompanies"));
const AnalyticsDashboard = lazy(() => import("../pages/AnalyticsDashboard"));

export const appRoutes = [
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/jobs",
        element: <JobsManagement />,
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
          {
            path: "/candidate/dashboard",
            element: <CandidateDashboard />,
            handle: { allowedRoles: ["candidate"] },
          },
          {
            path: "/candidate/jobs",
            element: <JobSearch />,
            handle: { allowedRoles: ["candidate"] },
          },
          {
            path: "/candidate/jobs/:id",
            element: <JobDetail />,
            handle: { allowedRoles: ["candidate"] },
          },
          {
            path: "/candidate/applications",
            element: <CandidateApplications />,
            handle: { allowedRoles: ["candidate"] },
          },
          {
            path: "/candidate/application/:id",
            element: <CandidateDetails />,
            handle: { allowedRoles: ["candidate"] },
          },
          {
            path: "/candidate/saved-jobs",
            element: <SavedJobs />,
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
            path: "/employer/profile",
            element: <EmployerProfile />,
            handle: { allowedRoles: ["employer"] },
          },
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
            path: "/employer/pipeline",
            element: <KanbanPipeline />,
            handle: { allowedRoles: ["employer"] },
          },
          {
            path: "/employer/pipeline/:jobId",
            element: <KanbanPipeline />,
            handle: { allowedRoles: ["employer"] },
          },
          {
            path: "/candidateProfile/:id",
            element: <CandidateDetails />,
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
          {
            path: "/employer/company/:companyId/ai-assistant/:jobId",
            element: <HrAssistantPage />,
            handle: { allowedRoles: ["employer"] },
          },
          {
            path: "/admin/dashboard",
            element: <AdminDashboard />,
            handle: { allowedRoles: ["admin"] },
          },
          {
            path: "/admin/users",
            element: <AdminUsers />,
            handle: { allowedRoles: ["admin"] },
          },
          {
            path: "/admin/companies",
            element: <AdminCompanies />,
            handle: { allowedRoles: ["admin"] },
          },
          {
            path: "/admin/analytics",
            element: <AnalyticsDashboard />,
            handle: { allowedRoles: ["admin"] },
          },
        ],
      },
    ],
  },
];
