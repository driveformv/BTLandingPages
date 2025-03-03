import React, { useEffect, useState } from "react";
import './App.css';
import routes from "./routes";
import withRouter from "./components/withRouter";
import {
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { initializeFirestore } from "./initFirestore";
import { getDocuments } from "./firestoreService";
import { AuthProvider } from "./contexts/AuthContext";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

const App = () => {
  const [, setFirestoreInitialized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    initializeFirestoreData();
  }, []);

  // Track page views when location changes
  useEffect(() => {
    // Log page view event
    logEvent(analytics, 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname + location.search
    });
  }, [location]);

  const initializeFirestoreData = async () => {
    try {
      // Check if jobs collection already has data
      const existingJobs = await getDocuments("jobs");
      
      // Only initialize if no jobs exist
      if (existingJobs.length === 0) {
        await initializeFirestore();
      }
      
      setFirestoreInitialized(true);
    } catch (error) {
      console.error("Error initializing Firestore data:", error);
    }
  };

  // Helper function to render routes recursively
  const renderRoutes = (routes) => {
    return routes.map((route, idx) => {
      // If the route has children, render them recursively
      if (route.children) {
        return (
          <Route path={route.path} element={route.element} key={idx}>
            {renderRoutes(route.children)}
          </Route>
        );
      }
      
      // For routes with component prop (old style)
      if (route.component) {
        return <Route path={route.path} element={route.component} key={idx} />;
      }
      
      // For routes with element prop (new style)
      return <Route path={route.path} element={route.element} key={idx} />;
    });
  };

  return (
    <AuthProvider>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </AuthProvider>
  );
};
  
export default withRouter(App);
