import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};

export default useAuthContext;
