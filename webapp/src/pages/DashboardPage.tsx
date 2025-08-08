import React from "react";
import { useAuth } from "../hooks/useAuth";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
        color: "#1a202c",
      }}
    >
      <div
        style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            background: "white",
            padding: "20px 30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                margin: "0",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "2rem" }}>🎯</span>
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #4299e1 0%, #667eea 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#1a202c",
                }}
              >
                TogetherToTarget
              </span>
            </h1>
            <p style={{ margin: "5px 0 0 0", color: "#4a5568" }}>
              Ciao {user?.name || user?.email}! 👋
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 4px rgba(229, 62, 62, 0.2)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 8px rgba(229, 62, 62, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 4px rgba(229, 62, 62, 0.2)";
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </header>

        {/* Dashboard Content */}
        <div style={{ display: "grid", gap: "20px" }}>
          {/* Welcome Card */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                color: "#1a202c",
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              🎉 Benvenuto nella Dashboard!
            </h2>
            <p
              style={{
                color: "#4a5568",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}
            >
              Hai completato con successo l'autenticazione! Ora puoi esplorare
              tutte le funzionalità di TogetherToTarget.
            </p>

            <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
              <div
                style={{
                  padding: "15px",
                  background: "#e6fffa",
                  borderRadius: "8px",
                  borderLeft: "4px solid #38b2ac",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    color: "#234e52",
                    fontSize: "1.1rem",
                  }}
                >
                  ✅ Autenticazione completata
                </h3>
                <p
                  style={{ margin: "0", color: "#234e52", fontSize: "0.9rem" }}
                >
                  Sistema di login/signup funzionante
                </p>
              </div>

              <div
                style={{
                  padding: "15px",
                  background: "#fef5e7",
                  borderRadius: "8px",
                  borderLeft: "4px solid #ed8936",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    color: "#7b341e",
                    fontSize: "1.1rem",
                  }}
                >
                  🚧 Prossimi step
                </h3>
                <p
                  style={{ margin: "0", color: "#7b341e", fontSize: "0.9rem" }}
                >
                  Onboarding flow, matching algorithm, chat
                </p>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                color: "#1a202c",
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              👤 Il tuo profilo
            </h2>

            <div style={{ display: "grid", gap: "10px" }}>
              <p style={{ color: "#2d3748", margin: "5px 0" }}>
                <strong>ID:</strong> {user?.id}
              </p>
              <p style={{ color: "#2d3748", margin: "5px 0" }}>
                <strong>Email:</strong> {user?.email}
              </p>
              <p style={{ color: "#2d3748", margin: "5px 0" }}>
                <strong>Nome:</strong> {user?.name || "Non specificato"}
              </p>
              <p style={{ color: "#2d3748", margin: "5px 0" }}>
                <strong>Lingua:</strong>{" "}
                {user?.language === "it" ? "🇮🇹 Italiano" : "🇬🇧 English"}
              </p>
              <p style={{ color: "#2d3748", margin: "5px 0" }}>
                <strong>Onboarding:</strong>{" "}
                {user?.onboarding_completed
                  ? "✅ Completato"
                  : "❌ Da completare"}
              </p>
              <p style={{ color: "#2d3748", margin: "5px 0" }}>
                <strong>Registrato:</strong>{" "}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("it-IT")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
