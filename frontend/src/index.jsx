import React from "react";
import ReactDOM from "react-dom/client";

import App from "@/App.jsx";
import "@/index.css";
// auth context
import { AuthContextProvider } from "@/contexts/authContext";

import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>,
);
