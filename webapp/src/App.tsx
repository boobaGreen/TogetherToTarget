import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/MainLayout";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import { EmailConfirmationPage } from "./pages/EmailConfirmationPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";

// Import degli stili
import "./index.css";
import "./styles/auth.css";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Pagina principale per utenti non autenticati */}
          <Route
            path="/"
            element={
              <ProtectedRoute requireAuth={false}>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Auth routes - solo per utenti non autenticati */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <ProtectedRoute requireAuth={false}>
                <SignupForm />
              </ProtectedRoute>
            }
          />

          {/* Email confirmation route - accessibile senza autenticazione */}
          <Route
            path="/email-confirmation"
            element={<EmailConfirmationPage />}
          />

          {/* Password reset routes - accessibili senza autenticazione */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Onboarding - solo per utenti autenticati che non hanno completato l'onboarding */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={false}>
                <MainLayout>
                  <OnboardingPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Dashboard - solo per utenti autenticati che hanno completato l'onboarding */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Route catch-all - redirect alla home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
