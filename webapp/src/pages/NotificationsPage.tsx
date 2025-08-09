import React, { useEffect, useState } from "react";
import Notifications from "../components/Notifications";
import type { Notification } from "../types/notification";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../services/notifications";
import { useAuth } from "../hooks/useAuth";

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchNotifications(user.id)
      .then((data) => {
        setNotifications(data);
        setError(null);
      })
      .catch(() => {
        setError("Errore nel caricamento delle notifiche");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await markNotificationAsRead(id);
    } catch {
      // Optionally show error
    }
  };

  if (!user) {
    return (
      <div className="notifications-page">
        <h2>Notifiche</h2>
        <div>Devi essere autenticato per vedere le notifiche.</div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <h2>Notifiche</h2>
      {loading ? (
        <div>Caricamento...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <Notifications
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
