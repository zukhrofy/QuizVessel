import { Routes, Route } from "react-router-dom";

import Dashboard from "@/pages/dashboard/Dashboard";
import QuickAction from "@/pages/dashboard/components/QuickAction";

import { ProtectedRoute } from "@/routes/ProtectedRoute";

const DashboardRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route
          index
          element={
            <Dashboard>
              <QuickAction />
            </Dashboard>
          }
        />
      </Routes>
    </ProtectedRoute>
  );
};

export default DashboardRoutes;
