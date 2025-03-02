import React, { useEffect, useState } from "react";
import './App.css';
import routes from "./routes";
import withRouter from "./components/withRouter";
import {
  Route,
  Routes
} from "react-router-dom";
import { initializeFirestore } from "./initFirestore";
import { getDocuments } from "./firestoreService";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  const [, setFirestoreInitialized] = useState(false);

  useEffect(() => {
    initializeFirestoreData();
  }, []);

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
