import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./GroupsPage.css";

interface Member {
  id: string;
  name: string;
  lastCheckin: string;
  streak: number;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  progress: number;
  status: "active" | "completed" | "paused";
  unreadMessages?: number;
}

const GroupsPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Mock data con chat badge - Max 3 membri per gruppo
  const mockGroups: Group[] = [
    {
      id: "1",
      name: "Fitness Challenge 2024",
      description: "Obiettivo: 50kg di perdita peso collettiva",
      members: [
        { id: "1", name: "Marco", lastCheckin: "2025-08-09", streak: 15 },
        { id: "2", name: "Sofia", lastCheckin: "2025-08-08", streak: 12 },
      ],
      progress: 75,
      status: "active",
      unreadMessages: 3,
    },
    {
      id: "2",
      name: "Lettura Mensile",
      description: "Obiettivo: 12 libri in un anno",
      members: [
        { id: "4", name: "Emma", lastCheckin: "2025-08-09", streak: 22 },
        { id: "5", name: "Luca", lastCheckin: "2025-08-08", streak: 18 },
        { id: "6", name: "Alex", lastCheckin: "2025-08-07", streak: 8 },
      ],
      progress: 45,
      status: "active",
      unreadMessages: 7,
    },
    {
      id: "3",
      name: "Startup Launch",
      description: "Obiettivo: Lancio MVP entro 3 mesi",
      members: [
        { id: "7", name: "Anna", lastCheckin: "2025-08-09", streak: 30 },
        { id: "8", name: "Pietro", lastCheckin: "2025-08-09", streak: 25 },
        { id: "9", name: "Giulia", lastCheckin: "2025-08-08", streak: 20 },
      ],
      progress: 100,
      status: "completed",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { text: "In corso", class: "status-active" };
      case "completed":
        return { text: "Completato", class: "status-completed" };
      case "paused":
        return { text: "In pausa", class: "status-paused" };
      default:
        return { text: "Sconosciuto", class: "status-unknown" };
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 20) return "streak-fire";
    if (streak >= 10) return "streak-hot";
    return "streak-normal";
  };

  // Separazione per status
  const activeGroups = mockGroups.filter((g) => g.status === "active");
  const completedGroups = mockGroups.filter((g) => g.status === "completed");

  // Logica Premium vs Non-Premium
  const isPremium = user?.subscription_type === "premium";

  let visibleActiveGroups: Group[] = [];
  let visibleCompletedGroups: Group[] = [];
  let numEmptySlots = 0;
  let showPremiumCTA = false;

  if (isPremium) {
    // PREMIUM: Può avere max 3 gruppi attivi contemporaneamente
    if (filter === "all") {
      visibleActiveGroups = activeGroups.slice(0, 3);
      visibleCompletedGroups = completedGroups;
      if (activeGroups.length < 3) {
        numEmptySlots = 3 - activeGroups.length;
      }
    } else if (filter === "active") {
      visibleActiveGroups = activeGroups.slice(0, 3);
      if (activeGroups.length < 3) {
        numEmptySlots = 3 - activeGroups.length;
      }
    } else if (filter === "completed") {
      visibleCompletedGroups = completedGroups;
    }
  } else {
    // NON-PREMIUM: Può avere solo 1 gruppo attivo
    if (filter === "all") {
      visibleActiveGroups = activeGroups.slice(0, 1);
      visibleCompletedGroups = completedGroups;
      showPremiumCTA = true;
    } else if (filter === "active") {
      visibleActiveGroups = activeGroups.slice(0, 1);
      showPremiumCTA = true;
    } else if (filter === "completed") {
      visibleCompletedGroups = completedGroups;
    }
  }

  return (
    <div className="groups-page">
      <div className="groups-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>I tuoi Gruppi</h1>
            <p>Raggiungi gli obiettivi insieme ai tuoi compagni</p>
          </div>
          {isPremium && <div className="premium-badge">✨ Premium Active</div>}
        </div>

        {/* Filtri gruppi */}
        <div className="groups-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tutti ({mockGroups.length})
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Attivi ({activeGroups.length})
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Conclusi ({completedGroups.length})
          </button>
        </div>
      </div>

      <div className="groups-grid">
        {/* 1. GRUPPI ATTIVI (sempre per primi) */}
        {visibleActiveGroups.map((group, idx) => (
          <div
            key={group.id}
            className={`group-card${idx === 0 ? " shimmer-effect" : ""}`}
          >
            <div className="group-header">
              <div className="group-title">
                <h3 className="group-name">{group.name}</h3>
                <span
                  className={`status-badge ${
                    getStatusBadge(group.status).class
                  }`}
                >
                  {getStatusBadge(group.status).text}
                </span>
              </div>
              <p className="group-description">{group.description}</p>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Progresso</span>
                <span className="progress-percentage">{group.progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${group.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="members-section">
              <div className="members-header">
                <h4 className="members-title">
                  Membri ({group.members.length})
                </h4>
                {typeof group.unreadMessages === "number" &&
                  group.unreadMessages > 0 && (
                    <div
                      className="chat-badge chat-badge-professional"
                      title={`${group.unreadMessages} messaggi non letti`}
                    >
                      <span className="chat-icon">💬</span>
                      <span className="unread-count">
                        {group.unreadMessages}
                      </span>
                    </div>
                  )}
              </div>

              <div className="members-list">
                {group.members.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-checkin">
                        {member.lastCheckin === "2025-08-09"
                          ? "✅ Check-in oggi"
                          : `Ultimo: ${member.lastCheckin}`}
                      </div>
                    </div>
                    <div
                      className={`member-streak ${getStreakColor(
                        member.streak
                      )}`}
                    >
                      🔥 {member.streak}
                    </div>
                  </div>
                ))}
              </div>

              <div className="group-actions">
                <Link
                  to={`/groups/${group.id}`}
                  className="btn-premium view-group-btn"
                  style={{ textDecoration: "none" }}
                >
                  Visualizza Gruppo
                </Link>
                <Link
                  to="/test-checkin"
                  className="btn-primary checkin-btn"
                  title="Daily Check-in"
                  style={{ textDecoration: "none" }}
                >
                  Daily Check-in
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* 2. CARTE CTA PREMIUM (per utenti non-premium) */}
        {showPremiumCTA &&
          [1, 2].map((index) => (
            <div
              key={`premium-cta-${index}`}
              className="group-card premium-cta-card"
            >
              <div className="premium-cta-overlay">
                <div className="premium-cta-content">
                  <div className="premium-icon">✨</div>
                  <h3 className="premium-title">Sblocca Premium</h3>
                  <p className="premium-description">
                    Crea fino a 3 gruppi attivi contemporaneamente e raggiungi
                    più obiettivi insieme
                  </p>
                  <button className="btn-premium-upgrade">
                    Passa a Premium
                  </button>
                </div>
              </div>
            </div>
          ))}

        {/* 3. SLOT VUOTI PER PREMIUM (con effetto riflesso) */}
        {filter !== "completed" &&
          isPremium &&
          numEmptySlots > 0 &&
          Array.from({ length: numEmptySlots }, (_, index) => {
            const objectives = [
              {
                icon: "💪",
                title: "Fitness & Salute",
                description: "Raggiungi i tuoi obiettivi di benessere fisico",
              },
              {
                icon: "📚",
                title: "Crescita Personale",
                description: "Sviluppa nuove competenze e conoscenze",
              },
              {
                icon: "🚀",
                title: "Carriera & Business",
                description: "Accelera la tua crescita professionale",
              },
            ];

            const objective = objectives[index % objectives.length];

            return (
              <div
                key={`empty-${index}`}
                className="group-card group-card-premium-empty"
                onClick={() =>
                  console.log(`Create new ${objective.title} group clicked`)
                }
              >
                <div className="premium-empty-content">
                  <div className="premium-empty-icon">
                    <span>{objective.icon}</span>
                  </div>
                  <h3 className="premium-empty-title">{objective.title}</h3>
                  <p className="premium-empty-description">
                    {objective.description}
                  </p>
                </div>
                <div className="premium-shine-effect"></div>
              </div>
            );
          })}

        {/* 4. GRUPPI CONCLUSI (sempre per ultimi) */}
        {visibleCompletedGroups.map((group) => (
          <div key={group.id} className="group-card group-card-completed">
            <div className="group-header">
              <div className="group-title">
                <h3 className="group-name">{group.name}</h3>
                <span
                  className={`status-badge ${
                    getStatusBadge(group.status).class
                  }`}
                >
                  {getStatusBadge(group.status).text}
                </span>
              </div>
              <p className="group-description">{group.description}</p>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Progresso</span>
                <span className="progress-percentage">{group.progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${group.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="members-section">
              <div className="members-header">
                <h4 className="members-title">
                  Membri ({group.members.length})
                </h4>
              </div>

              <div className="members-list">
                {group.members.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-checkin">
                        {member.lastCheckin === "2025-08-09"
                          ? "✅ Check-in oggi"
                          : `Ultimo: ${member.lastCheckin}`}
                      </div>
                    </div>
                    <div
                      className={`member-streak ${getStreakColor(
                        member.streak
                      )}`}
                    >
                      🔥 {member.streak}
                    </div>
                  </div>
                ))}
              </div>

              <div className="group-actions">
                <Link
                  to={`/groups/${group.id}`}
                  className="btn-secondary view-group-btn"
                  style={{ textDecoration: "none" }}
                >
                  Visualizza Risultati
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
