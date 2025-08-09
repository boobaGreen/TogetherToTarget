import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const UserMenu: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowConfirm(false);
  };

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    const { error } = await logout();
    if (error) {
      console.error("Logout error:", error);
    }
    setShowConfirm(false);
    setIsMenuOpen(false);
  };

  const handleLogoutCancel = () => {
    setShowConfirm(false);
  };

  const handleProfileClick = () => {
    navigate("/profile-edit");
    setIsMenuOpen(false);
  };

  // Chiudi il menu quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setShowConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  // Determina se mostrare l'avatar o il placeholder
  const hasValidAvatar =
    user.avatar_url && user.avatar_url.trim() !== "" && !imageError;

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-info" onClick={toggleMenu}>
        {hasValidAvatar ? (
          <img
            src={user.avatar_url || undefined}
            alt={user.name || user.email}
            className="user-avatar"
            onError={handleImageError}
          />
        ) : (
          <div className="user-avatar-placeholder">
            <span className="user-icon">👤</span>
          </div>
        )}
        <span className="user-name">{user.name || user.email}</span>
        <span className="dropdown-arrow">{isMenuOpen ? "▲" : "▼"}</span>
      </div>

      {isMenuOpen && (
        <div className="user-dropdown">
          {!showConfirm ? (
            <>
              <div className="dropdown-item user-profile">
                <div className="profile-info">
                  <strong>{user.name || "Utente"}</strong>
                  <small>{user.email}</small>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleProfileClick}>
                <span>👤</span>
                Modifica Profilo
              </button>
              <button
                className="dropdown-item logout-item"
                onClick={handleLogoutClick}
                disabled={loading}
              >
                <span className="logout-icon">⏻</span>
                Logout
              </button>
            </>
          ) : (
            <div className="logout-confirm">
              <p>Sei sicuro di voler effettuare il logout?</p>
              <div className="confirm-buttons">
                <button
                  className="confirm-btn cancel-btn"
                  onClick={handleLogoutCancel}
                  disabled={loading}
                >
                  Annulla
                </button>
                <button
                  className="confirm-btn logout-btn"
                  onClick={handleLogoutConfirm}
                  disabled={loading}
                >
                  {loading ? "🔄" : "⏻"} Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
