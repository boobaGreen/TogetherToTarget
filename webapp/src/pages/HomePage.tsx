import React from "react";
import { Link } from "react-router-dom";
import { SupabaseTest } from "../components/SupabaseTest";
import { useAuth } from "../hooks/useAuth";

export const HomePage: React.FC = () => {
  const { message, clearMessage } = useAuth();
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
        style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}
      >
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <span style={{ fontSize: "3.5rem" }}>🎯</span>
            <span
              style={{
                background: "linear-gradient(135deg, #4299e1 0%, #667eea 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "#1a202c",
              }}
            >
              TogetherToTarget
            </span>
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#4a5568",
              marginBottom: "2rem",
              fontWeight: "500",
            }}
          >
            Welcome to TTT - Your motivational group app!
          </p>

          {/* Messaggio di conferma email */}
          {message && (
            <div
              style={{
                background: "#c6f6d5",
                border: "1px solid #9ae6b4",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "2rem",
                color: "#22543d",
                fontWeight: "500",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.2rem" }}>✅</span>
                <span>{message}</span>
              </div>
              <button
                onClick={clearMessage}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#22543d",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  padding: "0",
                  marginLeft: "10px",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Call to Action */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <Link
              to="/signup"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🚀 Inizia Ora
            </Link>

            <Link
              to="/login"
              style={{
                border: "2px solid #667eea",
                color: "#667eea",
                background: "transparent",
                padding: "10px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.2s ease",
                display: "inline-block",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#667eea";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#667eea";
              }}
            >
              🔐 Accedi
            </Link>
          </div>
        </header>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
            marginBottom: "20px",
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
            🔧 Setup Status:
          </h2>
          <div style={{ display: "grid", gap: "10px" }}>
            <p style={{ color: "#2d3748", margin: "5px 0" }}>
              ✅ React + TypeScript
            </p>
            <p style={{ color: "#2d3748", margin: "5px 0" }}>✅ Vite bundler</p>
            <p style={{ color: "#2d3748", margin: "5px 0" }}>
              ✅ Supabase client
            </p>
            <p style={{ color: "#2d3748", margin: "5px 0" }}>✅ React Router</p>
            <p style={{ color: "#2d3748", margin: "5px 0" }}>✅ React Query</p>
            <p style={{ color: "#e53e3e", margin: "5px 0", fontWeight: "600" }}>
              🔐 Authentication System
            </p>
            <p style={{ color: "#4299e1", margin: "5px 0", fontWeight: "600" }}>
              📡 Supabase connection test:
            </p>
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
            border: "1px solid #e2e8f0",
          }}
        >
          <SupabaseTest />
        </div>
      </div>
    </div>
  );
};
