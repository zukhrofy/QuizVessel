// third library
import { Routes, Route, Navigate } from "react-router-dom";

// use context hooks
import useAuthContext from "./hooks/useAuthContext";

// pages
import Home from "./pages/Home";
// auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
// dashboard
import Dashboard from "./pages/Dashboard";
// create quiz
import CreateRegularQuiz from "./components/createQuiz/CreateRegularQuiz";
import CreateSectionedQuiz from "./components/createQuiz/CreateSectionedQuiz";
// quiz library
import LibraryQuiz from "./components/detailQuiz/LibraryQuiz";
import DetailQuiz from "./components/detailQuiz/DetailQuiz";
import EditQuiz from "./components/editQuiz/EditQuiz";
// assignment and report
import ReportQuiz from "./components/reportQuiz/ReportQuiz";
import DetailReport from "./components/reportQuiz/DetailReport";
// play quiz
import PlayQuizPreview from "./components/playQuiz/PlayQuizPreview";
import PlayQuizStart from "./components/playQuiz/PlayQuizStart";
import PlayQuizResult from "./components/playQuiz/PlayQuizResult";

const RequireAuth = ({ children }) => {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/auth/login" />;
};

function App() {
  const { user } = useAuthContext();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/auth/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/auth/signup"
        element={!user ? <Signup /> : <Navigate to="/dashboard" />}
      />
      {/* dashboard */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }>
        <Route path="library" element={<LibraryQuiz />} />
        <Route path="report" element={<ReportQuiz />} />
      </Route>
      {/* create quiz */}
      <Route path="/create">
        <Route
          path="regular-quiz"
          element={
            <RequireAuth>
              <CreateRegularQuiz />
            </RequireAuth>
          }
        />
        <Route
          path="sectioned-quiz"
          element={
            <RequireAuth>
              <CreateSectionedQuiz />
            </RequireAuth>
          }
        />
      </Route>
      {/* quiz management component */}
      <Route
        path="/dashboard/library/:id/"
        element={
          <RequireAuth>
            <DetailQuiz />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/library/:id/edit"
        element={
          <RequireAuth>
            <EditQuiz />
          </RequireAuth>
        }
      />
      {/* run quiz component */}
      <Route
        path="/play/:quizToken/preview"
        element={
          <RequireAuth>
            <PlayQuizPreview />
          </RequireAuth>
        }
      />
      <Route
        path="/play/:quizToken/start"
        element={
          <RequireAuth>
            <PlayQuizStart />
          </RequireAuth>
        }
      />
      <Route
        path="/play/:quizToken/finish"
        element={
          <RequireAuth>
            <PlayQuizResult />
          </RequireAuth>
        }
      />
      {/* report library */}
      <Route
        path="/report/:id/"
        element={
          <RequireAuth>
            <DetailReport />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
