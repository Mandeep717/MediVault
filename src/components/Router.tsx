import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';

import HomePage from '@/components/pages/HomePage';
import LoginPage from '@/components/pages/LoginPage';
import DashboardPage from '@/components/pages/DashboardPage';
import PatientDetailPage from '@/components/pages/PatientDetailPage';
import PatientPortalPage from '@/components/pages/PatientPortalPage';
import ProfilePage from '@/components/pages/ProfilePage';
import LabTechnicianLoginPage from '@/components/pages/LabTechnicianLoginPage';
import LabDashboardPage from '@/components/pages/LabDashboardPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "login",
        element: <LoginPage />,
        routeMetadata: {
          pageIdentifier: 'login',
        },
      },
      {
        path: "dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access patient records">
            <DashboardPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'dashboard',
        },
      },
      {
        path: "patient/:id",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view patient details">
            <PatientDetailPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'patient-detail',
        },
      },
      {
        path: "patient-portal",
        element: <PatientPortalPage />,
        routeMetadata: {
          pageIdentifier: 'patient-portal',
        },
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
            <ProfilePage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'profile',
        },
      },
      {
        path: "lab-login",
        element: <LabTechnicianLoginPage />,
        routeMetadata: {
          pageIdentifier: 'lab-login',
        },
      },
      {
        path: "lab-dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access lab dashboard">
            <LabDashboardPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'lab-dashboard',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
