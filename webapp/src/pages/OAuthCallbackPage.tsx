import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const OAuthCallbackPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const hasRedirected = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    // Pulisci timeout precedenti
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Se abbiamo già reindirizzato, non fare nulla
    if (hasRedirected.current) {
      return;
    }

    const currentAttempt = attempts + 1;
    addDebug(
      `🔄 OAuth Callback attempt ${currentAttempt}: checking user status`
    );
    addDebug(
      `📊 State: user=${!!user}, loading=${loading}, email=${
        user?.email || "none"
      }`
    );

    // Se stiamo ancora caricando, aspetta
    if (loading) {
      addDebug("⏳ Still loading auth state...");
      return;
    }

    // Se abbiamo un utente, reindirizza
    if (user) {
      addDebug(`✅ User authenticated: ${user.email}`);
      addDebug(`📋 Onboarding completed: ${user.onboarding_completed}`);

      hasRedirected.current = true;

      if (!user.onboarding_completed) {
        addDebug("� Redirecting to onboarding");
        navigate("/onboarding", { replace: true });
      } else {
        addDebug("🎯 Redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    // Se non abbiamo un utente e non stiamo caricando, riprova o reindirizza al login
    if (!user && !loading) {
      addDebug("❌ No user found after loading completed");

      if (currentAttempt < 10) {
        setAttempts(currentAttempt);
        addDebug(`� Retry in 2 seconds (attempt ${currentAttempt}/10)`);
        retryTimeoutRef.current = setTimeout(() => {
          // Il prossimo useEffect si attiverà automaticamente
        }, 2000);
      } else {
        addDebug("❌ Max attempts reached, redirecting to login");
        hasRedirected.current = true;
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading, navigate, attempts]);

  // Cleanup del timeout quando il componente viene unmounted
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flexDirection: "column",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            animation: "pulse 2s infinite",
          }}
        >
          🎯
        </div>
        <h1 style={{ margin: "0 0 1rem 0", fontSize: "2rem" }}>
          Accesso in corso...
        </h1>
        <p style={{ margin: "0", opacity: "0.9", fontSize: "1.1rem" }}>
          Ti stiamo reindirizzando alla tua dashboard
        </p>
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
              }}
            />
          ))}
        </div>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: "0.7" }}>
          Tentativo {attempts + 1}/10
        </p>
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "300px",
            overflow: "auto",
          }}
        >
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>
            Debug Info:
          </h3>
          {debugInfo.map((info, index) => (
            <div
              key={index}
              style={{
                fontSize: "0.8rem",
                marginBottom: "0.5rem",
                fontFamily: "monospace",
              }}
            >
              {info}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          } 
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
