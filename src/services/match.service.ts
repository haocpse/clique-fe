import axiosClient from "./api";
import type { ApiResponse } from "@/types";
import type { MatchItem, MatchSchedule } from "@/types/match.types";

export interface ScheduleRequest {
  scheduledAt: string;
  location: string;
  message: string;
}

export const matchService = {
  getMatches: () =>
    axiosClient.get<ApiResponse<MatchItem[]>>(`/match`),

  getMatchById: (matchId: number) =>
    axiosClient.get<ApiResponse<MatchItem>>(`/match/${matchId}`),

  addSchedule: (matchId: number, data: ScheduleRequest) =>
    axiosClient.post<ApiResponse<MatchSchedule>>(
      `/match/${matchId}/schedule`,
      data
    ),

  updateSchedule: (matchId: number, scheduleId: number, data: ScheduleRequest) =>
    axiosClient.put<ApiResponse<MatchSchedule>>(
      `/match/${matchId}/schedule/${scheduleId}`,
      data
    ),

  updateScheduleStatus: (matchId: number, scheduleId: number, status: "CONFIRMED" | "CANCELLED", reason?: string) =>
    axiosClient.put<ApiResponse<MatchSchedule>>(
      `/match/${matchId}/schedule/${scheduleId}/action`,
      reason ? { reason } : {},
      { params: { status } }
    ),

  unmatch: (matchId: number) =>
    axiosClient.delete<ApiResponse<void>>(`/match/${matchId}`),
};
