import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireOnboarding = false,
  redirectTo,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Debug logging temporaneamente disabilitato per evitare spam di log

  // BYPASS per pagina di test matching
  if (location.pathname === "/test-matching") {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="global-loading-spinner">
            <span>🎯</span>
            <p>Caricamento...</p>
          </div>
        </div>
      );
    }

    // Solo richiede autenticazione per test-matching
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Altrimenti permetti accesso diretto
    return <>{children}</>;
  }

  // Debug logging temporaneamente disabilitato

  // Mostra loading mentre stiamo verificando l'autenticazione
  if (loading) {
    return (
      <div className="loading-container">
        <div className="global-loading-spinner">
          <span>🎯</span>
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  // Se è richiesta l'autenticazione ma l'utente non è loggato
  if (requireAuth && !user) {
    return (
      <Navigate
        to={redirectTo || "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  // Se NON è richiesta l'autenticazione ma l'utente è loggato (es. pagine login/signup)
  if (!requireAuth && user) {
    // Se l'utente non ha completato l'onboarding, lo mandiamo lì
    if (!user.onboarding_completed) {
      return <Navigate to="/onboarding" replace />;
    }
    // Altrimenti lo mandiamo alla dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Se è richiesto l'onboarding ma l'utente non l'ha completato
  if (requireOnboarding && user && !user.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  // Se l'onboarding NON è richiesto ma l'utente non l'ha completato (es. pagina onboarding)
  if (
    !requireOnboarding &&
    user &&
    !user.onboarding_completed &&
    location.pathname !== "/onboarding" &&
    location.pathname !== "/onboarding-success" &&
    location.pathname !== "/test-matching" // Permetti accesso alla pagina di test
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  // Se l'utente ha completato l'onboarding ma sta cercando di accedere alla pagina onboarding
  // NOTA: Permettiamo sempre l'accesso alla pagina di successo onboarding
  if (
    user &&
    user.onboarding_completed &&
    location.pathname === "/onboarding"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
