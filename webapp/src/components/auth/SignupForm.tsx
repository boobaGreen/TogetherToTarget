import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { SignupCredentials } from "../../types/auth";

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    signup,
    loginWithGoogle,
    loading,
    error,
    message,
    clearError,
    clearMessage,
  } = useAuth();

  // Gestione chiusura messaggio con redirect al login
  const handleCloseMessage = () => {
    clearMessage();
    navigate("/login");
  };

  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: "",
    password: "",
    name: "",
    language: "it",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
  }>({});

  // Gestione input
  const handleInputChange = (
    field: keyof SignupCredentials | "confirmPassword",
    value: string
  ) => {
    if (field === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setCredentials((prev) => ({ ...prev, [field]: value }));
    }

    // Pulisce gli errori quando l'utente inizia a scrivere
    if (
      field in validationErrors &&
      validationErrors[field as keyof typeof validationErrors]
    ) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      clearError();
    }
    // NON cancellare automaticamente il messaggio quando l'utente scrive
    // Il messaggio di conferma email deve rimanere visibile
  };

  // Validazione
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!credentials.email) {
      errors.email = "Email richiesta";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = "Email non valida";
    }

    if (!credentials.password) {
      errors.password = "Password richiesta";
    } else if (credentials.password.length < 6) {
      errors.password = "Password deve essere di almeno 6 caratteri";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Conferma password richiesta";
    } else if (credentials.password !== confirmPassword) {
      errors.confirmPassword = "Le password non coincidono";
    }

    if (!credentials.name?.trim()) {
      errors.name = "Nome richiesto";
    } else if (credentials.name.length < 2) {
      errors.name = "Nome deve essere di almeno 2 caratteri";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestione submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await signup(credentials);
    console.log("Signup result:", result); // Debug

    // Reindirizza solo se la registrazione è andata a buon fine E non serve conferma email
    if (!result.error && !result.needsEmailConfirmation) {
      // Reset del form solo se tutto è andato bene
      setCredentials({
        email: "",
        password: "",
        name: "",
        language: "it",
      });
      setConfirmPassword("");
      setValidationErrors({});
      navigate("/onboarding");
    }
    // Se serve conferma email (needsEmailConfirmation: true), rimane sulla pagina per mostrare il messaggio
    // NON resettiamo il form in questo caso
  };

  // Gestione registrazione con Google
  const handleGoogleSignup = async () => {
    const { error: googleError } = await loginWithGoogle();

    if (googleError) {
      console.error("Google signup error:", googleError);
    }
    // Il redirect è gestito automaticamente da Supabase OAuth
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>
            <span className="logo-emoji">🎯</span>
            <span className="logo-text-auth">TogetherToTarget</span>
          </h1>
          <h2>Crea il tuo account</h2>
          <p>
            Unisciti alla community e raggiungi i tuoi obiettivi insieme ad
            altri!
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

          {/* Nasconde il form se c'è un messaggio di conferma email */}
          {!message && (
            <>
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  type="text"
                  value={credentials.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Il tuo nome"
                  disabled={loading}
                  className={validationErrors.name ? "error" : ""}
                />
                {validationErrors.name && (
                  <span className="field-error">{validationErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="tua@email.com"
                  disabled={loading}
                  className={validationErrors.email ? "error" : ""}
                />
                {validationErrors.email && (
                  <span className="field-error">{validationErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Scegli una password sicura"
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
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Ripeti la password"
                  disabled={loading}
                  className={validationErrors.confirmPassword ? "error" : ""}
                />
                {validationErrors.confirmPassword && (
                  <span className="field-error">
                    {validationErrors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="language">Lingua</label>
                <select
                  id="language"
                  value={credentials.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value as "it" | "en")
                  }
                  disabled={loading}
                >
                  <option value="it">🇮🇹 Italiano</option>
                  <option value="en">🇬🇧 English</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-button primary"
              >
                {loading ? "🔄 Registrazione in corso..." : "🚀 Crea Account"}
              </button>
            </>
          )}
        </form>

        {/* Mostra sempre il Google OAuth, anche quando c'è il messaggio */}
        {!message && (
          <>
            {/* Separatore OAuth */}
            <div className="oauth-separator">
              <div className="separator-line"></div>
              <span className="separator-text">oppure</span>
              <div className="separator-line"></div>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="auth-button google"
              type="button"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.64 9.20454C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.8445H13.8436C13.635 11.9696 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20454Z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                  fill="#34A853"
                />
                <path
                  d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                  fill="#EA4335"
                />
              </svg>
              {loading ? "🔄 Connessione..." : "Registrati con Google"}
            </button>
          </>
        )}

        <div className="auth-footer">
          <p>
            Hai già un account?{" "}
            <Link to="/login" className="auth-link">
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
