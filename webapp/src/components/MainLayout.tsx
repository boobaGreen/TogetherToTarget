import React from "react";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { NavigationMenu } from "./NavigationMenu";
import { useAuth } from "../hooks/useAuth";
import "../styles/layout.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  // URL di destinazione per il logo
  const logoDestination = user
    ? user.onboarding_completed
      ? "/dashboard"
      : "/onboarding"
    : "/";

  return (
    <div className="main-layout">
      {/* Header con logo e menu utente */}
      <header className="main-header">
        <div className="header-content">
          {/* Logo - Lato sinistro */}
          <Link to={logoDestination} className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">TogetherToTarget</span>
          </Link>

          {/* Spazio centrale elastico */}
          <div className="header-center"></div>

          {/* Menu di navigazione e user menu - Lato destro */}
          <div className="header-nav">
            <NavigationMenu />
            {user && <UserMenu />}
          </div>
        </div>
      </header>

      {/* Contenuto principale */}
      <main className="main-content">{children}</main>
    </div>
  );
};
