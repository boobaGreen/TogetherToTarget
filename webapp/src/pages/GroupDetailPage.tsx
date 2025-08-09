import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./GroupsPage.css";

const TABS = [
  { key: "chat", label: "Chat", icon: "💬" },
  { key: "stats", label: "Statistiche", icon: "📊" },
  { key: "badge", label: "Badge", icon: "🏅" },
  { key: "members", label: "Membri", icon: "👥" },
  { key: "video", label: "Video Call", icon: "🎥" },
];

export const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams();
  const [tab, setTab] = useState("chat");

  // Mock dati gruppo
  const group = {
    id: groupId,
    name: "Fitness Warriors",
    status: "Attivo",
    daysRemaining: 5,
    progress: 85,
    isPremium: true,
  };

  return (
    <div className="group-detail-page">
      {/* Header gruppo */}
      <div className="group-detail-header">
        <div className="group-detail-title-row">
          <h2 className="group-detail-title">{group.name}</h2>
          {group.isPremium && <span className="premium-badge">👑 Premium</span>}
        </div>
        <div className="group-detail-status-row">
          <span className="status-badge status-active">{group.status}</span>
          <span className="days-remaining">
            {group.daysRemaining} giorni rimanenti
          </span>
        </div>
        <div className="progress-bar" style={{ margin: "1rem 0 0.5rem 0" }}>
          <div
            className="progress-fill"
            style={{ width: `${group.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="group-detail-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`group-detail-tab${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="group-detail-content">
        {tab === "chat" && (
          <div className="group-chat-section">
            <h3>Chat Storica</h3>
            <div className="chat-mockup">
              [Mockup chat di gruppo stile WhatsApp/Discord]
            </div>
          </div>
        )}
        {tab === "stats" && (
          <div className="group-stats-section">
            <h3>Statistiche Gruppo</h3>
            <div className="stats-mockup">
              [Grafici, progressi, streak, check-in, stile Duolingo/Strava]
            </div>
          </div>
        )}
        {tab === "badge" && (
          <div className="group-badge-section">
            <h3>Badge del Gruppo</h3>
            <div className="badge-mockup">
              [Premi, traguardi, badge sbloccati dal gruppo]
            </div>
          </div>
        )}
        {tab === "members" && (
          <div className="group-members-section">
            <h3>Membri</h3>
            <div className="members-mockup">
              [Lista membri, avatar, streak, ultimi check-in, stile
              Slack/Discord]
            </div>
          </div>
        )}
        {tab === "video" && (
          <div className="group-video-section">
            <h3>Video Call Settimanali</h3>
            <button className="btn-primary" style={{ marginBottom: 16 }}>
              Avvia Video Call
            </button>
            <div className="video-mockup">
              [Storico call, link, info, stile Google Meet/Discord]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;
