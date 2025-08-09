import React from "react";
import "./PremiumBadge.css";

interface PremiumBadgeProps {
  isPremium: boolean;
  expiresInDays?: number;
  size?: "small" | "medium" | "large";
  showExpiry?: boolean;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  isPremium,
  expiresInDays,
  size = "medium",
  showExpiry = true,
}) => {
  if (!isPremium) {
    return <span className={`badge badge-free badge-${size}`}>Free</span>;
  }

  const isExpiringSoon = expiresInDays !== undefined && expiresInDays <= 7;

  return (
    <div className={`premium-badge premium-badge-${size}`}>
      <span
        className={`badge badge-premium badge-${size} ${
          isExpiringSoon ? "expiring" : ""
        }`}
      >
        💎 Premium
      </span>
      {showExpiry && expiresInDays !== undefined && (
        <span className={`expiry-text ${isExpiringSoon ? "warning" : ""}`}>
          {expiresInDays > 0 ? `${expiresInDays} giorni rimasti` : "Scaduto"}
        </span>
      )}
    </div>
  );
};

export default PremiumBadge;
