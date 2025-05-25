import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TwoFactorPage from "./pages/TwoFactorPage";
import VenuesPage from "./pages/VenuesPage";
import RequestsPage from "./pages/RequestsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminTwoFactorPage from "./pages/AdminTwoFactorPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/venues"
            element={
              <PrivateRoute>
                <VenuesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <RequestsPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/2fa" element={<TwoFactorPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/2fa" element={<AdminTwoFactorPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <PrivateRoute>
                <AdminReservationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/management"
            element={
              <PrivateRoute>
                <AdminManagementPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
