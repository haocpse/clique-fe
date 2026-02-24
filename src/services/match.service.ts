import axiosClient from "./api";
import type { ApiResponse } from "@/types";
import type { MatchItem } from "@/types/match.types";

export const matchService = {
  getMatches: () =>
    axiosClient.get<ApiResponse<MatchItem[]>>(`/match`),
};
