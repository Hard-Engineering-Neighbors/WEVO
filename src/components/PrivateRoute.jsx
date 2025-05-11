// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Redirect to login if no user is logged in
  if (!currentUser) return <Navigate to="/login" />;

  // Render the protected route if the user is authenticated
  return children;
};

export default PrivateRoute;
// This component checks if the user is authenticated by accessing the currentUser from the AuthContext.
// If the user is authenticated, it renders the children components (the protected route).
// If the user is not authenticated, it redirects to the login page.