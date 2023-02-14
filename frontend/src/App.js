import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import Home from "./pages/Home";
import ProtectRoutes from "./hooks/protectRoutes";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectRoutes>
              <Dashboard />
            </ProtectRoutes>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
