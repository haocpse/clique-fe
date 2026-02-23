import axiosClient from "./api";
import type { CreateProfileRequest, UserResponse, ApiResponse } from "@/types";

export const userService = {
  createProfile: (userId: number, data: CreateProfileRequest) =>
    axiosClient.post<ApiResponse<UserResponse>>(
      `/user/${userId}/profile`,
      data
    ),

  getMyProfile: () =>
    axiosClient.get<ApiResponse<UserResponse>>(`/user/me`),
};
