import React from "react";
import "./Spinner.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "white" | "gray";
  message?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "primary",
  message,
  className = "",
}) => {
  return (
    <div className={`spinner-container ${className}`}>
      <div className={`spinner-circle spinner-${size} spinner-${color}`}></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default Spinner;
