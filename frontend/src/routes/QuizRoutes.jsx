import { Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "@/routes/ProtectedRoute";

import QuizList from "@/features/quiz/QuizList";
import DetailQuiz from "@/features/quiz/detail-quiz/DetailQuiz";
import CreateRegularQuiz from "@/features/quiz/create-quiz/CreateRegularQuiz";
import CreateSectionedQuiz from "@/features/quiz/create-quiz/CreateSectionedQuiz";
import EditQuiz from "@/features/quiz/edit-quiz/EditQuiz";
import Dashboard from "@/pages/dashboard/Dashboard";

const QuizRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route
          index
          element={
            <Dashboard>
              <QuizList />
            </Dashboard>
          }
        />

        <Route path="/" element={<QuizList />} />
        <Route path="/:id" element={<DetailQuiz />} />
        <Route path="create">
          <Route path="regular-quiz" element={<CreateRegularQuiz />} />
          <Route path="sectioned-quiz" element={<CreateSectionedQuiz />} />
        </Route>
        <Route path="/:id/edit" element={<EditQuiz />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default QuizRoutes;
