export interface NotificationItem {
  title: string;
  detail?: string[];
  date: string;
  type: "Successfully" | "InProgress" | "Pending"
}