import { Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import PlayQuizPreview from "@/features/quiz/play-quiz/PlayQuizPreview";
import PlayQuizStart from "@/features/quiz/play-quiz/PlayQuizStart";
import PlayQuizResult from "@/features/quiz/play-quiz/PlayQuizResult";

const PlayRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/:quizToken/preview" element={<PlayQuizPreview />} />
        <Route path="/:quizToken/start" element={<PlayQuizStart />} />
        <Route path="/:quizToken/finish" element={<PlayQuizResult />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default PlayRoutes;
