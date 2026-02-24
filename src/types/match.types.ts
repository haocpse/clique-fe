import type { UserResponse } from "./user.types";

export type ScheduleStatus =
  | "AUTO"
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface MatchSchedule {
  id: number;
  scheduledAt: string;
  location: string;
  message: string;
  status: ScheduleStatus;
  cancelledById: number | null;
  cancelReason: string | null;
  isRequester: boolean;
}

export interface MatchItem {
  id: number;
  user: UserResponse;
  schedules: MatchSchedule[];
}
