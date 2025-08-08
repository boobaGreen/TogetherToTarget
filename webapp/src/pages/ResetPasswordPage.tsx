import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword, loading, error, message, clearError } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Controlla se abbiamo parametri validi per il reset
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResetPasswordCheck = async () => {
      // Debug: logghiamo tutti i parametri URL
      const allParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
      });
      console.log("Tutti i parametri reset password:", allParams);

      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      const type = searchParams.get("type");
      const token = searchParams.get("token");
      const tokenHash = searchParams.get("token_hash");

      console.log("Reset password params:", {
        accessToken,
        refreshToken,
        type,
        token,
        tokenHash,
      });

      // Controlla se abbiamo già una sessione attiva (possibile reset già processato)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log(
            "✅ Sessione attiva rilevata durante reset, token valido"
          );
          setIsValidToken(true);
          return;
        }
      } catch (error) {
        console.error("Errore controllo sessione:", error);
      }

      // Controlla diversi formati possibili
      if (
        (type === "recovery" && accessToken && refreshToken) ||
        (token && tokenHash) ||
        accessToken
      ) {
        setIsValidToken(true);
        console.log("✅ Token di reset valido");
      } else {
        // Se non abbiamo parametri, aspettiamo un po' per vedere se Supabase processa qualcosa
        console.log("⏳ Nessun parametro rilevato, aspetto per sicurezza...");

        timeoutId = setTimeout(() => {
          setIsValidToken(false);
          console.log("❌ Token di reset non valido o mancante");
        }, 3000);
      }
    };

    handleResetPasswordCheck();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchParams]);

  // Validazione password
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!password) {
      errors.password = "Password richiesta";
    } else if (password.length < 6) {
      errors.password = "Password deve essere di almeno 6 caratteri";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Conferma password richiesta";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Le password non coincidono";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestione submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await updatePassword(password);

    if (!result.error) {
      // Successo - redirect al login dopo 2 secondi
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  // Loading state mentre verifichiamo il token
  if (isValidToken === null) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>
              <span className="logo-emoji">🎯</span>
              <span className="logo-text-auth">TogetherToTarget</span>
            </h1>
            <h2>Verifica Token</h2>
          </div>
          <div className="loading-message">
            <p>🔄 Verifica del token di reset in corso...</p>
          </div>
        </div>
      </div>
    );
  }

  // Token non valido
  if (!isValidToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>
              <span className="logo-emoji">🎯</span>
              <span className="logo-text-auth">TogetherToTarget</span>
            </h1>
            <h2>Link Non Valido</h2>
          </div>
          <div className="error-message">
            <span>
              ⚠️ Il link per il reset della password non è valido o è scaduto.
            </span>
          </div>
          <div className="auth-footer">
            <button
              onClick={() => navigate("/forgot-password")}
              className="auth-button primary"
            >
              Richiedi Nuovo Reset
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>
            <span className="logo-emoji">🎯</span>
            <span className="logo-text-auth">TogetherToTarget</span>
          </h1>
          <h2>Nuova Password</h2>
          <p>Inserisci la tua nuova password. Assicurati che sia sicura!</p>
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
              <p>Ti stiamo reindirizzando al login...</p>
            </div>
          )}

          {/* Nasconde il form se c'è un messaggio di successo */}
          {!message && (
            <>
              <div className="form-group">
                <label htmlFor="password">Nuova Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                    if (error) clearError();
                  }}
                  placeholder="La tua nuova password"
                  disabled={loading}
                  className={validationErrors.password ? "error" : ""}
                />
                {validationErrors.password && (
                  <span className="field-error">
                    {validationErrors.password}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Conferma Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                    if (error) clearError();
                  }}
                  placeholder="Conferma la nuova password"
                  disabled={loading}
                  className={validationErrors.confirmPassword ? "error" : ""}
                />
                {validationErrors.confirmPassword && (
                  <span className="field-error">
                    {validationErrors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-button primary"
              >
                {loading ? "🔄 Aggiornamento..." : "🔒 Aggiorna Password"}
              </button>
            </>
          )}
        </form>

        <div className="auth-footer">
          <p>
            Ricordi la password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="auth-link"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              Torna al login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
