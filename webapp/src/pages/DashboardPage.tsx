import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PremiumBadge from "../components/premium/PremiumBadge";
import PremiumUpgradeCard from "../components/premium/PremiumUpgradeCard";
import { PremiumService } from "../services/premium";
import "./DashboardPage.css";

interface UserGoal {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  progress: number;
  createdAt: string;
  targetDate?: string;
}

interface DashboardStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
  });
  const [premiumStatus, setPremiumStatus] = useState({
    isPremium: false,
    maxGoals: 1,
    expiresInDays: undefined as number | undefined,
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load premium status with fallback
      let status, limits;
      try {
        status = await PremiumService.getPremiumStatus(user.id);
        limits = await PremiumService.getUserLimits(user.id);
      } catch (error) {
        console.warn(
          "Premium services not available, using fallback data:",
          error
        );
        // Fallback per quando il database non ha ancora le funzioni premium
        status = { is_premium: false, subscription_type: "free" as const };
        limits = {
          is_premium: false,
          active_profiles: 1,
          max_profiles: 1,
          can_add_goal: false,
        };
      }

      setPremiumStatus({
        isPremium: status.is_premium,
        maxGoals: limits.max_profiles,
        expiresInDays: status.expires_in_days,
      });

      // Mock goals data - replace with actual API call
      const mockGoals: UserGoal[] = [
        {
          id: "1",
          title: "Imparare React Advanced",
          category: "Tecnologia",
          subcategory: "Sviluppo Web",
          progress: 75,
          createdAt: "2024-01-15",
          targetDate: "2024-03-15",
        },
      ];

      setUserGoals(mockGoals);

      // Calculate stats
      const activeGoals = mockGoals.filter((g) => g.progress < 100).length;
      const completedGoals = mockGoals.filter((g) => g.progress === 100).length;
      const averageProgress =
        mockGoals.length > 0
          ? mockGoals.reduce((sum, goal) => sum + goal.progress, 0) /
            mockGoals.length
          : 0;

      setStats({
        totalGoals: mockGoals.length,
        activeGoals,
        completedGoals,
        averageProgress,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set fallback data anche in caso di errore generale
      setPremiumStatus({
        isPremium: false,
        maxGoals: 1,
        expiresInDays: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    alert("Funzionalità di upgrade in arrivo!");
  };

  const handleAddGoal = () => {
    // TODO: Navigate to goal creation
    alert("Funzionalità di creazione obiettivo in arrivo!");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Caricamento dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>
            Ciao, {user?.name || user?.email?.split("@")[0] || "Utente"}! 👋
          </h1>
          <p>Ecco il tuo progresso verso i tuoi obiettivi</p>
        </div>
        <PremiumBadge
          isPremium={premiumStatus.isPremium}
          expiresInDays={premiumStatus.expiresInDays}
          size="large"
        />
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.totalGoals}</h3>
            <p>Obiettivi Totali</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3>{stats.activeGoals}</h3>
            <p>In Corso</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedGoals}</h3>
            <p>Completati</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{Math.round(stats.averageProgress)}%</h3>
            <p>Progresso Medio</p>
          </div>
        </div>
      </div>

      {/* Premium Upgrade Card */}
      <PremiumUpgradeCard
        currentGoals={stats.totalGoals}
        maxGoals={premiumStatus.maxGoals}
        onUpgrade={handleUpgrade}
      />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Goals Section */}
        <div className="goals-section">
          <div className="section-header">
            <h2>I Tuoi Obiettivi</h2>
            <button
              className="add-goal-btn"
              onClick={handleAddGoal}
              disabled={stats.totalGoals >= premiumStatus.maxGoals}
              title={
                stats.totalGoals >= premiumStatus.maxGoals
                  ? "Limite obiettivi raggiunto"
                  : "Aggiungi nuovo obiettivo"
              }
            >
              + Nuovo Obiettivo
            </button>
          </div>

          {userGoals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>Nessun obiettivo ancora</h3>
              <p>Inizia il tuo viaggio creando il tuo primo obiettivo!</p>
              <button
                className="cta-button"
                onClick={handleAddGoal}
                disabled={stats.totalGoals >= premiumStatus.maxGoals}
              >
                Crea il Tuo Primo Obiettivo
              </button>
            </div>
          ) : (
            <div className="goals-grid">
              {userGoals.map((goal) => (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h3>{goal.title}</h3>
                    <span className="goal-category">{goal.subcategory}</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{goal.progress}%</span>
                  </div>
                  <div className="goal-meta">
                    <span className="created-date">
                      Creato:{" "}
                      {new Date(goal.createdAt).toLocaleDateString("it-IT")}
                    </span>
                    {goal.targetDate && (
                      <span className="target-date">
                        Scadenza:{" "}
                        {new Date(goal.targetDate).toLocaleDateString("it-IT")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Azioni Rapide</h2>
          <div className="actions-grid">
            <button
              className="action-card"
              onClick={() => navigate("/test-checkin")}
            >
              <div className="action-icon">🧪</div>
              <div className="action-content">
                <h3>Test Daily Check-in</h3>
                <p>Prova il nuovo sistema di check-in quotidiani</p>
              </div>
            </button>
            <button
              className="action-card"
              onClick={() => alert("Trova Partner in arrivo!")}
            >
              <div className="action-icon">👥</div>
              <div className="action-content">
                <h3>Trova Partner</h3>
                <p>Connettiti con persone che condividono i tuoi obiettivi</p>
              </div>
            </button>
            <button
              className="action-card"
              onClick={() => alert("Gruppi in arrivo!")}
            >
              <div className="action-icon">🏆</div>
              <div className="action-content">
                <h3>Unisciti a Gruppi</h3>
                <p>Partecipa a gruppi di studio e supporto</p>
              </div>
            </button>
            <button
              className="action-card"
              onClick={() => alert("Chat in arrivo!")}
            >
              <div className="action-icon">💬</div>
              <div className="action-content">
                <h3>Chat</h3>
                <p>Comunica con la tua community</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
