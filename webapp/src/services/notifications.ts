import { supabase } from "./supabase";
import type { Notification } from "../types/notification";

export async function fetchNotifications(
  userId: string
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDbNotificationToApp);
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
  if (error) throw error;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbNotificationToApp(row: Record<string, any>): Notification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    createdAt: row.created_at,
    read: row.read,
  };
}
