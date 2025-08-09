import React from "react";
import { useAuth } from "../../hooks/useAuth";
import PremiumBadge from "./PremiumBadge";
import "./PremiumUpgradeCard.css";

interface PremiumUpgradeCardProps {
  currentGoals: number;
  maxGoals: number;
  onUpgrade: () => void;
}

const PremiumUpgradeCard: React.FC<PremiumUpgradeCardProps> = ({
  currentGoals,
  maxGoals,
  onUpgrade,
}) => {
  const { user } = useAuth();
  const isAtLimit = currentGoals >= maxGoals;
  const isFree = maxGoals === 1; // Free users have 1 goal limit

  if (!isFree) {
    return null; // Don't show upgrade card for premium users
  }

  return (
    <div className={`premium-upgrade-card ${isAtLimit ? "urgent" : ""}`}>
      <div className="upgrade-header">
        <div className="upgrade-icon">{isAtLimit ? "🚫" : "💎"}</div>
        <div className="upgrade-title">
          <h3>
            {isAtLimit ? "Limite Raggiunto!" : "Sblocca il Tuo Potenziale"}
          </h3>
          <PremiumBadge isPremium={false} size="small" showExpiry={false} />
        </div>
      </div>

      <div className="upgrade-content">
        <div className="goals-progress">
          <div className="progress-text">
            <span>
              Obiettivi: {currentGoals}/{maxGoals}
            </span>
            <span className={`limit-text ${isAtLimit ? "at-limit" : ""}`}>
              {isAtLimit ? "Limite raggiunto" : "Quasi al limite"}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isAtLimit ? "full" : ""}`}
              style={{ width: `${(currentGoals / maxGoals) * 100}%` }}
            />
          </div>
        </div>

        <div className="premium-benefits">
          <h4>Con Premium ottieni:</h4>
          <ul>
            <li>
              <span className="benefit-icon">🎯</span>
              <span>Fino a 5 obiettivi simultanei</span>
            </li>
            <li>
              <span className="benefit-icon">�</span>
              <span>Matching prioritario con partner migliori</span>
            </li>
            <li>
              <span className="benefit-icon">📊</span>
              <span>Statistiche dettagliate e analisi progresso</span>
            </li>
            <li>
              <span className="benefit-icon">🏆</span>
              <span>Accesso a gruppi esclusivi e coaching</span>
            </li>
            <li>
              <span className="benefit-icon">📱</span>
              <span>Notifiche push personalizzate</span>
            </li>
            <li>
              <span className="benefit-icon">💎</span>
              <span>Badge Premium e riconoscimenti</span>
            </li>
          </ul>
        </div>

        <div className="pricing-info">
          <div className="price">
            <span className="currency">€</span>
            <span className="amount">9.99</span>
            <span className="period">/mese</span>
          </div>
          <p className="price-note">Cancella in qualsiasi momento</p>
        </div>

        <button className="upgrade-button" onClick={onUpgrade} disabled={!user}>
          {isAtLimit ? "🔓 Sblocca Ora" : "💎 Diventa Premium"}
        </button>

        {isAtLimit && (
          <div className="urgent-message">
            <span className="urgent-icon">⚠️</span>
            <span>
              Hai raggiunto il limite di obiettivi gratuiti. Aggiorna per
              continuare!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumUpgradeCard;
