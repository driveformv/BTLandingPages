import RecruitmentLanding from "./pages/RecruitmentLanding/RecruitmentLanding";
import Login from "./pages/Auth/login";
import SignUp from "./pages/Auth/signup";
import PasswordForget from "./pages/Auth/password_forget";

// Admin components
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import JobsManagement from "./pages/Admin/JobsManagement";
import ApplicationsManagement from "./pages/Admin/ApplicationsManagement";
import ApplicationDetail from "./pages/Admin/ApplicationDetail";
import EmailSettingsManagement from "./pages/Admin/EmailSettingsManagement";

// Auth components
import PrivateRoute from "./components/PrivateRoute";

const routes = [
  // Auth routes
  { path: "/signup", component: <SignUp /> },
  { path: "/login", component: <Login /> },
  { path: "/password_forget", component: <PasswordForget /> },

  // Admin routes (protected)
  {
    path: "/admin",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "jobs", element: <JobsManagement /> },
          { path: "applications", element: <ApplicationsManagement /> },
          { path: "applications/:id", element: <ApplicationDetail /> },
          { path: "email-settings", element: <EmailSettingsManagement /> },
        ],
      },
    ],
  },

  // Public routes
  { path: "/", component: <RecruitmentLanding /> },
];

export default routes;
