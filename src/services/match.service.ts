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
};
