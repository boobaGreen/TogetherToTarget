import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export const EmailConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let subscription: { unsubscribe: () => void } | null = null;

    const handleEmailConfirmation = async () => {
      try {
        console.log("🔄 Pagina di conferma email caricata");

        // Controlla se abbiamo già una sessione (conferma già avvenuta)
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log(
            "✅ Sessione già attiva, conferma completata:",
            session.user.id
          );
          setStatus("success");
          setMessage("Email confermata con successo! Benvenuto!");

          timeoutId = setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
          return;
        }

        // Se non abbiamo sessione, aspettiamo il cambio di stato auth
        console.log("⏳ Aspettando conferma email...");

        // Listener per cambiamenti di stato auth
        const {
          data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("🔔 Auth state change nella conferma:", event);

          if (event === "SIGNED_IN" && session?.user) {
            console.log(
              "✅ Email confermata via auth state change:",
              session.user.id
            );
            setStatus("success");
            setMessage("Email confermata con successo! Benvenuto!");

            timeoutId = setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          }
        });

        subscription = authSubscription;

        // Timeout di sicurezza - se dopo 10 secondi non succede nulla, mostra errore
        setTimeout(() => {
          setStatus("error");
          setMessage(
            "Conferma email non rilevata. Se il problema persiste, prova a fare login manualmente."
          );
        }, 10000);
      } catch (error) {
        console.error("Errore durante la conferma:", error);
        setStatus("error");
        setMessage("Si è verificato un errore. Riprova più tardi.");
      }
    };

    handleEmailConfirmation();

    // Cleanup effect
    return () => {
      if (subscription) subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>
              <span className="logo-emoji">🎯</span>
              <span className="logo-text-auth">TogetherToGoal</span>
            </h1>
            <h2>Conferma Email</h2>
          </div>
          <div className="loading-message">
            <p>🔄 Stiamo confermando la tua email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>
              <span className="logo-emoji">🎯</span>
              <span className="logo-text-auth">TogetherToGoal</span>
            </h1>
            <h2>Email Confermata</h2>
          </div>
          <div className="success-message">
            <span>✅ {message}</span>
          </div>
          <p>Ti stiamo reindirizzando alla dashboard...</p>
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
            <span className="logo-text-auth">TogetherToGoal</span>
          </h1>
          <h2>Errore Conferma</h2>
        </div>
        <div className="error-message">
          <span>⚠️ {message}</span>
        </div>
        <div className="auth-footer">
          <button
            onClick={() => navigate("/login")}
            className="auth-button primary"
          >
            Torna al Login
          </button>
        </div>
      </div>
    </div>
  );
};
