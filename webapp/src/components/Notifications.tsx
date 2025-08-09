import React from "react";
import type { Notification } from "../types/notification";
import "./Notifications.css";

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  if (notifications.length === 0) {
    return <div className="notifications-empty">Nessuna notifica</div>;
  }
  return (
    <div className="notifications-list">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`notification-item${n.read ? " read" : ""}`}
          onClick={() => !n.read && onMarkAsRead(n.id)}
        >
          <div className="notification-title">{n.title}</div>
          <div className="notification-message">{n.message}</div>
          <div className="notification-date">
            {new Date(n.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
