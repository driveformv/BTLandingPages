import Index1 from "./pages/Index1/Index1";
import Index2 from "./pages/Index2/Index2";
import Index3 from "./pages/Index3/Index3";
import Index4 from "./pages/Index4/Index4";
import Index5 from "./pages/Index5/Index5";
import Index6 from "./pages/Index6/Index6";
import Index7 from "./pages/Index7/Index7";
import Index8 from "./pages/Index8/Index8";
import Index9 from "./pages/Index9/Index9";
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
  { path: "/index9", component: <Index9 /> },
  { path: "/index8", component: <Index8 /> },
  { path: "/index7", component: <Index7 /> },
  { path: "/index6", component: <Index6 /> },
  { path: "/index5", component: <Index5 /> },
  { path: "/index4", component: <Index4 /> },
  { path: "/index3", component: <Index3 /> },
  { path: "/index2", component: <Index2 /> },
  { path: "/index1", component: <Index1 /> },
  { path: "/", component: <RecruitmentLanding /> },
];

export default routes;
