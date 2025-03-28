import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If the token doesn't exist, redirect to login page
  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
