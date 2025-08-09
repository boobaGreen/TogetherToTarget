// Dashboard per visualizzare check-in, streak e statistiche
import React, { useState, useEffect } from "react";
import { dailyCheckinService } from "../../services/daily-checkins";
import type { DailyCheckin, UserStreak } from "../../services/daily-checkins";
import { DailyCheckinForm } from "./DailyCheckinForm";
import "./CheckinDashboard.css";

interface CheckinDashboardProps {
  categoryId: number;
  subcategoryName: string;
}

interface CheckinStats {
  total_checkins: number;
  completion_rate: number;
  current_streak: number;
  best_streak: number;
  consistency_score: number;
}

export const CheckinDashboard: React.FC<CheckinDashboardProps> = ({
  categoryId,
  subcategoryName,
}) => {
  const [recentCheckins, setRecentCheckins] = useState<DailyCheckin[]>([]);
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null);
  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, subcategoryName]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Carica tutti i dati in parallelo
      const [checkins, streak, statistics] = await Promise.all([
        dailyCheckinService.getRecentCheckins(categoryId, 7),
        dailyCheckinService.getUserStreak(categoryId, subcategoryName),
        dailyCheckinService.getCheckinStats(categoryId, 30),
      ]);

      setRecentCheckins(checkins);
      setUserStreak(streak);
      setStats(statistics);
    } catch (error) {
      console.error("Errore nel caricare dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckinSuccess = () => {
    setShowForm(false);
    setSelectedDate("");
    // Ricarica i dati per aggiornare statistiche
    loadDashboardData();
  };

  const openCheckinForm = (date: string = "") => {
    setSelectedDate(date || new Date().toISOString().split("T")[0]);
    setShowForm(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const getCheckinForDate = (date: string) => {
    return recentCheckins.find((c) => c.target_date === date);
  };

  const generateLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⚡";
    if (streak >= 7) return "💪";
    if (streak >= 3) return "🌟";
    return "✨";
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return "#16a34a"; // verde
    if (rate >= 60) return "#ca8a04"; // giallo
    return "#dc2626"; // rosso
  };

  if (isLoading) {
    return (
      <div className="checkin-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Caricamento dashboard...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <DailyCheckinForm
        categoryId={categoryId}
        subcategoryName={subcategoryName}
        targetDate={selectedDate}
        onSuccess={handleCheckinSuccess}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  const last7Days = generateLast7Days();
  const todayDate = new Date().toISOString().split("T")[0];
  const todaysCheckin = getCheckinForDate(todayDate);

  return (
    <div className="checkin-dashboard">
      {/* Header con call-to-action */}
      <div className="dashboard-header">
        <h2>Check-in quotidiani</h2>
        <p className="subcategory-title">{subcategoryName}</p>

        {!todaysCheckin ? (
          <button
            onClick={() => openCheckinForm(todayDate)}
            className="btn btn-primary cta-button"
          >
            🎯 Fai check-in oggi
          </button>
        ) : (
          <div className="today-completed">
            <span className="completed-icon">✅</span>
            <span>Check-in di oggi completato!</span>
            <button
              onClick={() => openCheckinForm(todayDate)}
              className="btn btn-outline btn-small"
            >
              Modifica
            </button>
          </div>
        )}
      </div>

      {/* Statistiche principali */}
      {stats && userStreak && (
        <div className="stats-grid">
          <div className="stat-card streak-card">
            <div className="stat-icon">
              {getStreakEmoji(userStreak.current_streak)}
            </div>
            <div className="stat-content">
              <h3>Streak Attuale</h3>
              <div className="stat-value">{userStreak.current_streak}</div>
              <div className="stat-label">giorni consecutivi</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3>Record</h3>
              <div className="stat-value">{userStreak.longest_streak}</div>
              <div className="stat-label">giorni</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Tasso Completamento</h3>
              <div
                className="stat-value"
                style={{ color: getCompletionColor(stats.completion_rate) }}
              >
                {stats.completion_rate}%
              </div>
              <div className="stat-label">ultimi 30 giorni</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💯</div>
            <div className="stat-content">
              <h3>Consistenza</h3>
              <div
                className="stat-value"
                style={{ color: getCompletionColor(stats.consistency_score) }}
              >
                {stats.consistency_score}%
              </div>
              <div className="stat-label">ultima settimana</div>
            </div>
          </div>
        </div>
      )}

      {/* Calendario ultima settimana */}
      <div className="weekly-calendar">
        <h3>Ultimi 7 giorni</h3>
        <div className="calendar-grid">
          {last7Days.map((date) => {
            const checkin = getCheckinForDate(date);
            const isToday = date === todayDate;

            return (
              <div
                key={date}
                className={`calendar-day ${checkin ? "completed" : "empty"} ${
                  isToday ? "today" : ""
                }`}
                onClick={() => openCheckinForm(date)}
                style={{ cursor: "pointer" }}
              >
                <div className="day-header">
                  <span className="day-name">{formatDate(date)}</span>
                  {isToday && <span className="today-badge">Oggi</span>}
                </div>

                <div className="day-status">
                  {checkin ? (
                    <div className="completed-indicator">
                      <span className="checkmark">✓</span>
                      <span className="completion-text">
                        {checkin.completion_status === "completed"
                          ? "Fatto"
                          : "Parziale"}
                      </span>
                    </div>
                  ) : (
                    <div className="empty-indicator">+ Aggiungi</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista check-in recenti con dettagli */}
      {recentCheckins.length > 0 && (
        <div className="recent-checkins">
          <h3>Check-in recenti</h3>
          <div className="checkins-list">
            {recentCheckins.slice(0, 3).map((checkin) => (
              <div key={checkin.id} className="checkin-card">
                <div className="checkin-header">
                  <span className="checkin-date">
                    {formatDate(checkin.target_date)}
                  </span>
                  <span className={`status-badge ${checkin.completion_status}`}>
                    {checkin.completion_status === "completed"
                      ? "Completato"
                      : "Parziale"}
                  </span>
                </div>

                {checkin.notes && (
                  <div className="checkin-notes">
                    <p>"{checkin.notes}"</p>
                  </div>
                )}

                <div className="checkin-details">
                  <small>
                    Check-in #{checkin.streak_day} •
                    {checkin.shared_with_group
                      ? " Condiviso con gruppo"
                      : " Privato"}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {recentCheckins.length > 3 && (
            <button className="btn btn-outline view-all-btn">
              Vedi tutti i check-in
            </button>
          )}
        </div>
      )}

      {/* Motivational section se no check-in recenti */}
      {recentCheckins.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <h3>Inizia il tuo percorso!</h3>
          <p>
            Il primo passo è sempre il più importante. Fai il tuo primo check-in
            oggi e inizia a costruire una routine vincente.
          </p>
          <button
            onClick={() => openCheckinForm(todayDate)}
            className="btn btn-primary"
          >
            🎯 Primo Check-in
          </button>
        </div>
      )}
    </div>
  );
};
