import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const ProfileEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "Sono una persona motivata che ama raggiungere i propri obiettivi insieme ad altri.",
    interests: ["Fitness", "Tecnologia", "Lettura"],
    goals: [
      "Correre una maratona",
      "Imparare React",
      "Leggere 24 libri quest'anno",
    ],
    experience: "Intermediate",
    availability: "Sera (18:00-21:00)",
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert("🚧 DEMO: Funzionalità di salvataggio non ancora implementata!");
  };

  const handleBack = () => {
    navigate("/dashboard");
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
        style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}
      >
        {/* Demo Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(159, 122, 234, 0.3)",
          }}
        >
          <h2 style={{ margin: "0 0 10px 0", fontSize: "1.5rem" }}>
            🚧 DEMO MOCKUP PROVVISORIO 🚧
          </h2>
          <p style={{ margin: "0", opacity: "0.9" }}>
            Questa è una pagina di modifica profilo di esempio
          </p>
        </div>

        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
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
                fontSize: "1.8rem",
                margin: "0",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.8rem" }}>✏️</span>
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #4299e1 0%, #667eea 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#1a202c",
                }}
              >
                Modifica Profilo
              </span>
            </h1>
            <p style={{ margin: "5px 0 0 0", color: "#4a5568" }}>
              Personalizza il tuo profilo per trovare i partner migliori
            </p>
          </div>

          <button
            onClick={handleBack}
            style={{
              background: "linear-gradient(135deg, #718096 0%, #4a5568 100%)",
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
              boxShadow: "0 2px 4px rgba(113, 128, 150, 0.2)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 8px rgba(113, 128, 150, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 4px rgba(113, 128, 150, 0.2)";
            }}
          >
            <span>←</span>
            Torna alla Dashboard
          </button>
        </header>

        {/* Profile Form */}
        <div style={{ display: "grid", gap: "25px" }}>
          {/* Basic Info */}
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
                margin: "0 0 20px 0",
                color: "#1a202c",
                fontSize: "1.3rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>👤</span> Informazioni Base
            </h2>

            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#2d3748",
                  }}
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4299e1";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#2d3748",
                  }}
                >
                  Bio / Descrizione
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    resize: "vertical",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4299e1";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Interests */}
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
                margin: "0 0 20px 0",
                color: "#1a202c",
                fontSize: "1.3rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>🎯</span> Interessi e Hobby
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {[
                "Fitness",
                "Tecnologia",
                "Lettura",
                "Cucina",
                "Viaggi",
                "Musica",
                "Arte",
                "Sport",
                "Meditazione",
                "Business",
                "Gaming",
                "Fotografia",
                "Lingue",
                "Volontariato",
              ].map((interest) => (
                <button
                  key={interest}
                  onClick={() => {
                    const newInterests = formData.interests.includes(interest)
                      ? formData.interests.filter((i) => i !== interest)
                      : [...formData.interests, interest];
                    handleInputChange("interests", newInterests);
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "2px solid #e2e8f0",
                    background: formData.interests.includes(interest)
                      ? "linear-gradient(135deg, #4299e1 0%, #667eea 100%)"
                      : "white",
                    color: formData.interests.includes(interest)
                      ? "white"
                      : "#2d3748",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Goals */}
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
                margin: "0 0 20px 0",
                color: "#1a202c",
                fontSize: "1.3rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>🏆</span> I Miei Obiettivi
            </h2>

            <div style={{ display: "grid", gap: "12px" }}>
              {formData.goals.map((goal, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "15px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>🎯</span>
                  <span
                    style={{ flex: 1, color: "#2d3748", fontWeight: "500" }}
                  >
                    {goal}
                  </span>
                  <span
                    style={{
                      background: "#e2e8f0",
                      padding: "4px 12px",
                      borderRadius: "15px",
                      fontSize: "0.8rem",
                      color: "#4a5568",
                      fontWeight: "500",
                    }}
                  >
                    In corso
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
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
                margin: "0 0 20px 0",
                color: "#1a202c",
                fontSize: "1.3rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>⚙️</span> Preferenze
            </h2>

            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#2d3748",
                  }}
                >
                  Livello di Esperienza
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    background: "white",
                  }}
                >
                  <option value="Beginner">🌱 Principiante</option>
                  <option value="Intermediate">🌿 Intermedio</option>
                  <option value="Advanced">🌳 Avanzato</option>
                  <option value="Expert">🏆 Esperto</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#2d3748",
                  }}
                >
                  Disponibilità
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) =>
                    handleInputChange("availability", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    background: "white",
                  }}
                >
                  <option value="Mattina (6:00-12:00)">
                    🌅 Mattina (6:00-12:00)
                  </option>
                  <option value="Pomeriggio (12:00-18:00)">
                    ☀️ Pomeriggio (12:00-18:00)
                  </option>
                  <option value="Sera (18:00-21:00)">
                    🌆 Sera (18:00-21:00)
                  </option>
                  <option value="Notte (21:00-24:00)">
                    🌙 Notte (21:00-24:00)
                  </option>
                  <option value="Flessibile">🔄 Flessibile</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              onClick={handleSave}
              style={{
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                color: "white",
                border: "none",
                padding: "16px 32px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 4px 6px rgba(72, 187, 120, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(72, 187, 120, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(72, 187, 120, 0.3)";
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>💾</span>
              Salva Modifiche
            </button>

            <button
              onClick={handleBack}
              style={{
                background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
                color: "#4a5568",
                border: "2px solid #e2e8f0",
                padding: "16px 32px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>❌</span>
              Annulla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
