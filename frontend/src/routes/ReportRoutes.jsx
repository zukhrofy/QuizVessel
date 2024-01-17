import DetailReport from "@/features/reportQuiz/DetailReport";
import ReportQuiz from "@/features/reportQuiz/ReportQuiz";
import Dashboard from "@/pages/dashboard/Dashboard";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

const ReportRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route
          index
          element={
            <Dashboard>
              <ReportQuiz />
            </Dashboard>
          }
        />
        <Route path="/:id/" element={<DetailReport />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default ReportRoutes;
