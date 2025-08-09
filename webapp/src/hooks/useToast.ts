import { useState } from "react";
import type { ToastProps } from "../components/common/Toast";

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { ...props, id };
    setToasts((prev) => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showSuccess = (message: string) =>
    showToast({ message, type: "success" });
  const showError = (message: string) => showToast({ message, type: "error" });
  const showWarning = (message: string) =>
    showToast({ message, type: "warning" });
  const showInfo = (message: string) => showToast({ message, type: "info" });

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  };
};
