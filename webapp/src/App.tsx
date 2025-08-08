import { SupabaseTest } from "./components/SupabaseTest";
import "./App.css";

function App() {
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
              gap: "15px"
            }}
          >
            <span style={{ fontSize: "3.5rem" }}>🎯</span>
            <span style={{
              background: "linear-gradient(135deg, #4299e1 0%, #667eea 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "#1a202c"
            }}>
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
}

export default App;
