import { Routes, Route } from "react-router-dom";

import Home from "@/pages/home/Home";
import DashboardRoutes from "@/routes/DashboardRoutes";
import AuthRoutes from "@/routes/AuthRoutes";
import QuizRoutes from "@/routes/QuizRoutes";
import PlayRoutes from "@/routes/PlayRoutes";
import ReportRoutes from "./routes/ReportRoutes";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route index exact element={<Home />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
        <Route path="/quiz/*" element={<QuizRoutes />} />
        <Route path="/play/*" element={<PlayRoutes />} />
        <Route path="/report/*" element={<ReportRoutes />} />
      </Routes>

      <ToastContainer
        autoClose={2000}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
    </>
  );
};

export default App;
