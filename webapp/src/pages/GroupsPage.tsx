import React from "react";
import { useAuth } from "../hooks/useAuth";
import "./GroupsPage.css";

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  lastCheckin?: string;
  streak: number;
}

interface Group {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  progress: number;
  members: GroupMember[];
  status: "active" | "completed" | "paused";
  unreadMessages?: number; // nuovo campo per badge
}

export const GroupsPage: React.FC = () => {
  const { user } = useAuth();

  // Mock data per i gruppi - solo primo gruppo per utenti free
  const allMockGroups: Group[] = [
    {
      id: "1",
      name: "Fitness Warriors",
      goal: "Perdere 5kg in 30 giorni",
      startDate: "2025-07-15",
      endDate: "2025-08-14",
      daysRemaining: 5,
      progress: 85,
      status: "active",
      unreadMessages: 3,
      members: [
        {
          id: "user1",
          name: "Tu",
          streak: 22,
          lastCheckin: "2025-08-09",
        },
        {
          id: "user2",
          name: "Marco R.",
          avatar: "👨‍💼",
          streak: 20,
          lastCheckin: "2025-08-09",
        },
        {
          id: "user3",
          name: "Laura S.",
          avatar: "👩‍🏫",
          streak: 18,
          lastCheckin: "2025-08-08",
        },
      ],
    },
    {
      id: "2",
      name: "Study Squad",
      goal: "Studiare programmazione 2h/giorno",
      startDate: "2025-08-01",
      endDate: "2025-08-31",
      daysRemaining: 22,
      progress: 35,
      status: "active",
      unreadMessages: 0,
      members: [
        {
          id: "user1",
          name: "Tu",
          streak: 8,
          lastCheckin: "2025-08-09",
        },
        {
          id: "user4",
          name: "Alessandro T.",
          avatar: "👨‍💻",
          streak: 7,
          lastCheckin: "2025-08-09",
        },
        {
          id: "user5",
          name: "Sofia M.",
          avatar: "👩‍🎓",
          streak: 6,
          lastCheckin: "2025-08-08",
        },
      ],
    },
    {
      id: "3",
      name: "Reading Club",
      goal: "Leggere 1 libro al mese",
      startDate: "2025-08-05",
      endDate: "2025-09-04",
      daysRemaining: 26,
      progress: 20,
      status: "active",
      unreadMessages: 7,
      members: [
        {
          id: "user1",
          name: "Tu",
          streak: 4,
          lastCheckin: "2025-08-09",
        },
        {
          id: "user6",
          name: "Giulia P.",
          avatar: "👩‍🎨",
          streak: 3,
          lastCheckin: "2025-08-09",
        },
        {
          id: "user7",
          name: "Davide L.",
          avatar: "👨‍🎓",
          streak: 4,
          lastCheckin: "2025-08-08",
        },
      ],
    },
  ];

  // Filtra i gruppi in base al tipo di abbonamento
  const mockGroups =
    user?.subscription_type === "premium"
      ? allMockGroups
      : allMockGroups.slice(0, 1); // Solo primo gruppo per utenti free

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: "Attivo", class: "status-active" },
      completed: { label: "Completato", class: "status-completed" },
      paused: { label: "In Pausa", class: "status-paused" },
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 20) return "streak-excellent";
    if (streak >= 10) return "streak-good";
    if (streak >= 5) return "streak-fair";
    return "streak-low";
  };

  return (
    <div className="groups-page">
      <div className="groups-header">
        <h1>I Miei Gruppi</h1>
        <p>
          Gestisci i tuoi gruppi di supporto e monitora i progressi condivisi
        </p>
        {user?.subscription_type === "premium" && (
          <div className="premium-info">
            <span className="premium-badge">👑 Premium</span>
            <span>Fino a 3 gruppi contemporanei</span>
          </div>
        )}
      </div>

      <div className="groups-grid">
        {mockGroups.map((group, idx) => (
          <div
            key={group.id}
            className={"group-card" + (idx === 0 ? " shimmer-effect" : "")}
          >
            <div className="group-header">
              <div className="group-title">
                <h3>{group.name}</h3>
                <span
                  className={`status-badge ${
                    getStatusBadge(group.status).class
                  }`}
                >
                  {getStatusBadge(group.status).label}
                </span>
              </div>
              <p className="group-goal">{group.goal}</p>
            </div>

            <div className="group-progress">
              <div className="progress-info">
                <span>Progresso: {group.progress}%</span>
                <span>{group.daysRemaining} giorni rimanenti</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${group.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="group-members">
              <h4>Membri del gruppo</h4>
              <div className="members-list">
                {group.members.map((member) => (
                  <div key={member.id} className="member-card">
                    <div className="member-info">
                      <div className="member-avatar">
                        {member.avatar || "👤"}
                      </div>
                      <div className="member-details">
                        <span className="member-name">{member.name}</span>
                        <span className="member-checkin">
                          {member.lastCheckin === "2025-08-09"
                            ? "✅ Check-in oggi"
                            : `Ultimo: ${member.lastCheckin}`}
                        </span>
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
            </div>

            <div className="group-actions">
              <button
                className="btn-secondary chat-modern-btn"
                title="Apri chat di gruppo"
                style={{ position: "relative" }}
              >
                <span
                  className="chat-modern-icon"
                  role="img"
                  aria-label="Chat di gruppo"
                >
                  💬
                </span>
                <span className="chat-modern-label">Chat</span>
                {group.unreadMessages && group.unreadMessages > 0 && (
                  <span
                    className="unread-badge chat-badge-professional"
                    title={`Messaggi non letti: ${group.unreadMessages}`}
                  >
                    {group.unreadMessages}
                  </span>
                )}
              </button>
              <button
                className="btn-primary checkin-btn"
                title="Daily Check-in"
              >
                <span
                  className="checkin-btn-icon"
                  role="img"
                  aria-label="Daily Check-in"
                >
                  ✅
                </span>
                <span className="checkin-btn-label">Daily Check-in</span>
              </button>
            </div>
          </div>
        ))}

        {/* Slot premium bloccate per utenti free */}
        {user?.subscription_type !== "premium" && (
          <>
            <div className="group-card group-card-upgrade">
              <div className="upgrade-content">
                <div className="upgrade-icon">🔒</div>
                <h3>Gruppo Premium #2</h3>
                <p>
                  Sblocca questo slot con l'abbonamento Premium per partecipare
                  a più gruppi contemporaneamente
                </p>
                <button className="btn-premium">Sblocca con Premium</button>
              </div>
            </div>

            <div className="group-card group-card-upgrade">
              <div className="upgrade-content">
                <div className="upgrade-icon">🔒</div>
                <h3>Gruppo Premium #3</h3>
                <p>
                  Massimizza la tua motivazione partecipando fino a 3 gruppi con
                  Premium
                </p>
                <button className="btn-premium">Sblocca con Premium</button>
              </div>
            </div>
          </>
        )}

        {/* Slot vuote per utenti premium */}
        {user?.subscription_type === "premium" &&
          mockGroups.length < 3 &&
          Array.from({ length: 3 - mockGroups.length }, (_, index) => (
            <div key={`empty-${index}`} className="group-card group-card-empty">
              <div className="empty-group-content">
                <div className="empty-icon">➕</div>
                <h3>Aggiungi Nuovo Gruppo</h3>
                <p>
                  Hai ancora{" "}
                  {3 - mockGroups.length === 1
                    ? "uno slot disponibile"
                    : `${3 - mockGroups.length} slot disponibili`}{" "}
                  per nuovi gruppi
                </p>
                <button className="btn-primary">Trova Gruppo</button>
              </div>
            </div>
          ))}
      </div>

      {mockGroups.length === 0 && (
        <div className="no-groups">
          <div className="no-groups-icon">👥</div>
          <h2>Nessun Gruppo Attivo</h2>
          <p>
            Non fai ancora parte di nessun gruppo. Trova persone con obiettivi
            simili ai tuoi!
          </p>
          <button className="btn-primary">Trova il Tuo Primo Gruppo</button>
        </div>
      )}
    </div>
  );
};
