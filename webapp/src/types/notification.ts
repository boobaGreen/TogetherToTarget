// Notification type for system notifications (not chat)
export type NotificationType =
  | "matching"
  | "group_update"
  | "reminder"
  | "premium"
  | "gift"
  | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO date
  read: boolean;
}
