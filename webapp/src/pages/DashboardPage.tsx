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
        className="dashboard-container"
        style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
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
            Questa è una dashboard di esempio per testare la navigazione
          </p>
        </div>

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
                TogetherToTarget Dashboard
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
        <div
          className="dashboard-cards"
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {/* Stats Cards */}
          <div
            className="dashboard-card"
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <h3
              className="dashboard-card-title"
              style={{
                margin: "0 0 15px 0",
                color: "#1a202c",
                fontSize: "1.2rem",
              }}
            >
              🎯 Obiettivi Attivi
            </h3>
            <div
              className="dashboard-card-icon"
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#4299e1",
                margin: "10px 0",
              }}
            >
              3
            </div>
            <p style={{ margin: "0", color: "#718096" }}>obiettivi in corso</p>
          </div>

          <div
            className="dashboard-card"
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <h3
              className="dashboard-card-title"
              style={{
                margin: "0 0 15px 0",
                color: "#1a202c",
                fontSize: "1.2rem",
              }}
            >
              👥 Partner Collegati
            </h3>
            <div
              className="dashboard-card-icon"
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#48bb78",
                margin: "10px 0",
              }}
            >
              12
            </div>
            <p style={{ margin: "0", color: "#718096" }}>
              accountability partners
            </p>
          </div>

          <div
            className="dashboard-card"
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <h3
              className="dashboard-card-title"
              style={{
                margin: "0 0 15px 0",
                color: "#1a202c",
                fontSize: "1.2rem",
              }}
            >
              📈 Progresso
            </h3>
            <div
              className="dashboard-card-icon"
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#ed8936",
                margin: "10px 0",
              }}
            >
              68%
            </div>
            <p style={{ margin: "0", color: "#718096" }}>
              obiettivi completati
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className="dashboard-main-grid"
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "2fr 1fr",
            marginTop: "30px",
          }}
        >
          {/* Goals Section */}
          <div
            className="dashboard-goals-section"
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
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              🎯 I Tuoi Obiettivi
            </h2>

            <div style={{ display: "grid", gap: "15px" }}>
              {[
                {
                  title: "Imparare React Native",
                  progress: 75,
                  category: "📱 Tecnologia",
                  days: 12,
                },
                {
                  title: "Correre 5km senza fermarsi",
                  progress: 40,
                  category: "🏃 Fitness",
                  days: 8,
                },
                {
                  title: "Leggere 1 libro al mese",
                  progress: 90,
                  category: "📚 Crescita",
                  days: 3,
                },
              ].map((goal, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "20px",
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0",
                        color: "#2d3748",
                        fontSize: "1.1rem",
                      }}
                    >
                      {goal.title}
                    </h4>
                    <span
                      style={{
                        background: "#e2e8f0",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        color: "#4a5568",
                      }}
                    >
                      {goal.category}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#e2e8f0",
                      borderRadius: "10px",
                      height: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #4299e1 0%, #667eea 100%)",
                        height: "100%",
                        borderRadius: "10px",
                        width: `${goal.progress}%`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      margin: "0",
                      color: "#718096",
                      fontSize: "0.9rem",
                    }}
                  >
                    {goal.progress}% completato • {goal.days} giorni rimasti
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div
            className="dashboard-activity-section"
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
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              📊 Attività Recente
            </h2>

            <div style={{ display: "grid", gap: "15px" }}>
              {[
                {
                  action: "Mario ha completato",
                  target: "Workout mattutino",
                  time: "2h fa",
                  emoji: "💪",
                },
                {
                  action: "Sofia ha aggiunto",
                  target: "Nuovo obiettivo: Yoga",
                  time: "4h fa",
                  emoji: "🧘‍♀️",
                },
                {
                  action: "Luca ti ha inviato",
                  target: "Messaggio motivazionale",
                  time: "6h fa",
                  emoji: "💬",
                },
                {
                  action: "Hai completato",
                  target: "Lettura capitolo 3",
                  time: "1g fa",
                  emoji: "📖",
                },
                {
                  action: "Anna ha condiviso",
                  target: "Progresso settimanale",
                  time: "2g fa",
                  emoji: "📈",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{activity.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: "0",
                        color: "#2d3748",
                        fontSize: "0.9rem",
                      }}
                    >
                      <strong>{activity.action}</strong> {activity.target}
                    </p>
                    <p
                      style={{
                        margin: "0",
                        color: "#718096",
                        fontSize: "0.8rem",
                      }}
                    >
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
            border: "1px solid #e2e8f0",
            marginTop: "30px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px 0",
              color: "#1a202c",
              fontSize: "1.5rem",
              fontWeight: "600",
            }}
          >
            ⚡ Azioni Rapide
          </h2>

          <div
            style={{
              display: "grid",
              gap: "15px",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {[
              {
                title: "Nuovo Obiettivo",
                desc: "Crea un nuovo obiettivo",
                emoji: "🎯",
                color: "#4299e1",
              },
              {
                title: "Trova Partner",
                desc: "Cerca accountability partners",
                emoji: "👥",
                color: "#48bb78",
              },
              {
                title: "Aggiorna Progresso",
                desc: "Registra i tuoi progressi",
                emoji: "📈",
                color: "#ed8936",
              },
              {
                title: "Chat di Gruppo",
                desc: "Parla con i tuoi partner",
                emoji: "💬",
                color: "#9f7aea",
              },
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  background:
                    "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  border: `2px solid ${action.color}`,
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  color: "#2d3748",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${action.color}15 0%, ${action.color}25 100%)`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>
                  {action.emoji}
                </div>
                <h4
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  {action.title}
                </h4>
                <p
                  style={{ margin: "0", fontSize: "0.8rem", color: "#718096" }}
                >
                  {action.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
