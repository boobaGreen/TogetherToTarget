import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./NavigationMenu.css";

export const NavigationMenu: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pagine disponibili in base allo stato dell'utente
  const getMenuItems = () => {
    if (!user) {
      // Menu per visitatori non autenticati
      return [
        { path: "/", label: "Home", icon: "🏠" },
        { path: "/login", label: "Accedi", icon: "🔐" },
        { path: "/signup", label: "Registrati", icon: "🚀" },
      ];
    }

    if (user && !user.onboarding_completed) {
      // Menu per utenti in onboarding
      return [{ path: "/onboarding", label: "Onboarding", icon: "🎯" }];
    }

    // Menu per utenti completi
    return [
      { path: "/dashboard", label: "Dashboard", icon: "📊" },
      { path: "/goals", label: "Obiettivi", icon: "🎯" },
      { path: "/groups", label: "I Miei Gruppi", icon: "👥" },
      { path: "/test-checkin", label: "Daily Check-in", icon: "✅" },
      { path: "/profile-edit", label: "Profilo", icon: "👤" },
    ];
  };

  const menuItems = getMenuItems();
  const currentPath = location.pathname;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navigation-menu">
      {/* Menu hamburger per mobile */}
      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Menu desktop e mobile */}
      <ul className={`menu-list ${isMenuOpen ? "menu-open" : ""}`}>
        {menuItems.map((item) => (
          <li key={item.path} className="menu-item">
            <Link
              to={item.path}
              className={`menu-link ${
                currentPath === item.path ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Overlay per chiudere il menu mobile */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};
