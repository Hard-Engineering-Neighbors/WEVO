import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./LoginPage";
import "./index.css";
import { AuthProvider } from './contexts/AuthContext.jsx';
import { db } from "./firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import PrivateRoute from "./components/PrivateRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute><App /></PrivateRoute>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
