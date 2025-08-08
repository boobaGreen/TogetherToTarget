import React from "react";
import { UserMenu } from "./UserMenu";
import { useAuth } from "../hooks/useAuth";
import "../styles/layout.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="main-layout">
      {/* Header con logo e menu utente */}
      {user && (
        <header className="main-header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">TogetherToTarget</span>
            </div>
            <UserMenu />
          </div>
        </header>
      )}

      {/* Contenuto principale */}
      <main className={user ? "main-content with-header" : "main-content"}>
        {children}
      </main>
    </div>
  );
};
