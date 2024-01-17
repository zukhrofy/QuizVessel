import { AuthRoute } from "@/routes/ProtectedRoute";

import Login from "@/features/auth/Login";
import Signup from "@/features/auth/Signup";

import { Routes, Route } from "react-router-dom";

const AuthRoutes = () => {
  return (
    <AuthRoute>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthRoute>
  );
};

export default AuthRoutes;
