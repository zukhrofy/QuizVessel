import useAuthContext from "@/hooks/auth/useAuthContext";

import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/auth/" />;
};

export const AuthRoute = ({ children }) => {
  const { user } = useAuthContext();
  return !user ? children : <Navigate to="/dashboard" />;
};
