import React, { useState, useEffect } from "react";
import "./Toast.css";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Aspetta la fine dell'animazione
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "✅";
    }
  };

  return (
    <div className={`toast toast-${type} ${!isVisible ? "toast-exit" : ""}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button
        className="toast-close"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
      >
        ×
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: Array<ToastProps & { id: string }>;
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => (
  <div className="toast-container">
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
    ))}
  </div>
);

export default Toast;
