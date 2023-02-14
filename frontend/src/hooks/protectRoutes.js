import { Navigate } from "react-router-dom";
import AuthConsumer from "../contexts/authContext";

const ProtectRoutes = ({ children }) => {
  const { authed } = AuthConsumer();
  console.log(authed);
  return authed === true ? children : <Navigate to="/auth/login" replace />;
};

export default ProtectRoutes;
