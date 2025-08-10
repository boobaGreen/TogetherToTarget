import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword, loading, error, message, clearError, clearMessage } =
    useAuth();

  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  // Validazione email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Gestione submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pulisci errori precedenti
    setValidationError("");
    clearError();
    clearMessage();

    // Validazione
    if (!email) {
      setValidationError("Email richiesta");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Formato email non valido");
      return;
    }

    // Invia richiesta reset
    const result = await resetPassword(email);

    if (!result.error) {
      // Successo - rimani sulla pagina per mostrare il messaggio
      console.log("✅ Email di reset inviata a:", email);
    }
  };

  // Gestione chiusura messaggio con redirect al login
  const handleCloseMessage = () => {
    clearMessage();
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>
            <span className="logo-emoji">🎯</span>
            <span className="logo-text-auth">TogetherToGoal</span>
          </h1>
          <h2>Password Dimenticata</h2>
          <p>
            Inserisci la tua email e ti invieremo le istruzioni per reimpostare
            la password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
              <button
                type="button"
                onClick={clearError}
                className="error-close"
              >
                ✕
              </button>
            </div>
          )}

          {message && (
            <div className="success-message">
              <span>✅ {message}</span>
              <button
                type="button"
                onClick={handleCloseMessage}
                className="message-close"
              >
                ✕
              </button>
            </div>
          )}

          {/* Nasconde il form se c'è un messaggio di successo */}
          {!message && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError("");
                    if (error) clearError();
                  }}
                  placeholder="La tua email"
                  disabled={loading}
                  className={validationError ? "error" : ""}
                />
                {validationError && (
                  <span className="field-error">{validationError}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-button primary"
              >
                {loading ? "🔄 Invio in corso..." : "📧 Invia Email di Reset"}
              </button>
            </>
          )}
        </form>

        <div className="auth-footer">
          <p>
            Ricordi la password?{" "}
            <Link to="/login" className="auth-link">
              Torna al login
            </Link>
          </p>
          <p>
            Non hai un account?{" "}
            <Link to="/signup" className="auth-link">
              Registrati qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
