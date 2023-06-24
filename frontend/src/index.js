import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

// context
import { AuthContextProvider } from "./contexts/authContext";
import { QuizContextProvider } from "./contexts/quizContext";
import { ReportContextProvider } from "./contexts/reportContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <QuizContextProvider>
      <ReportContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReportContextProvider>
    </QuizContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
