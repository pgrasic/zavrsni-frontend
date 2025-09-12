export interface Stats {
  total_users: number;
  total_meds: number;
  sent_reminders: number;
  confirmed_reminders: number;
  most_loaded_user: number | string | null;
  lijek_relative: Record<string, number>;
}
