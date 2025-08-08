import React from "react";
import { useAuth } from "../hooks/useAuth";

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#1a202c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "3rem" }}>🎯</span>
          <span
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "#1a202c",
            }}
          >
            TogetherToTarget
          </span>
        </h1>

        <h2
          style={{
            fontSize: "1.75rem",
            color: "#1a202c",
            marginBottom: "1rem",
            fontWeight: "600",
          }}
        >
          🎉 Benvenuto, {user?.name || user?.email}!
        </h2>

        <p
          style={{
            color: "#4a5568",
            marginBottom: "2rem",
            lineHeight: "1.6",
            fontSize: "1.1rem",
          }}
        >
          Sei quasi pronto per iniziare il tuo percorso motivazionale!
          Completiamo insieme il setup del tuo profilo.
        </p>

        <div
          style={{
            background: "#f7fafc",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#1a202c",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            🔧 Prossimi passi:
          </h3>

          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>📝</span>
              <span style={{ color: "#4a5568" }}>
                Seleziona le tue categorie di interesse
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>🎯</span>
              <span style={{ color: "#4a5568" }}>
                Descrivi i tuoi obiettivi
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>⚙️</span>
              <span style={{ color: "#4a5568" }}>
                Configura le tue preferenze
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>🤝</span>
              <span style={{ color: "#4a5568" }}>
                Entra nel pool di matching
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#e6fffa",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            borderLeft: "4px solid #38b2ac",
          }}
        >
          <h4
            style={{
              margin: "0 0 10px 0",
              color: "#234e52",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            💡 Come funziona TogetherToTarget:
          </h4>
          <p
            style={{
              margin: "0",
              color: "#234e52",
              fontSize: "0.95rem",
              lineHeight: "1.5",
            }}
          >
            Ti metteremo in contatto con altre 2 persone che condividono i tuoi
            obiettivi. Insieme formerete un gruppo di supporto per 30 giorni,
            motivandovi a vicenda attraverso check-in quotidiani e chat di
            gruppo.
          </p>
        </div>

        <button
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            width: "100%",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          🚀 Inizia l'Onboarding
        </button>

        <p
          style={{
            color: "#a0aec0",
            marginTop: "20px",
            fontSize: "0.9rem",
          }}
        >
          📋 Tempo stimato: 3-5 minuti
        </p>
      </div>
    </div>
  );
};
