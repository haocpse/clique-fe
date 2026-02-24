import axiosClient from "./api";
import type { ApiResponse } from "@/types";

export const swipeService = {
  swipeAction: (userId: number, action: "LIKE" | "DISLIKE") =>
    axiosClient.post<ApiResponse<boolean>>(
      `/swipe/${userId}?action=${action}`
    ),
};
