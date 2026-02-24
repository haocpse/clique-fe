import axiosClient from "./api";
import type {
  CreateProfileRequest,
  UserResponse,
  ApiResponse,
  AvailabilityRequest,
  AvailabilityResponse,
} from "@/types";

export const userService = {
  createProfile: (userId: number, data: CreateProfileRequest) =>
    axiosClient.post<ApiResponse<UserResponse>>(
      `/user/${userId}/profile`,
      data
    ),

  getMyProfile: () =>
    axiosClient.get<ApiResponse<UserResponse>>(`/user/me`),

  getUserById: (id: number) =>
    axiosClient.get<ApiResponse<UserResponse>>(`/user/${id}`),

  addAvailability: (data: AvailabilityRequest) =>
    axiosClient.post<ApiResponse<AvailabilityResponse>>(
      `/user/availability`,
      data
    ),

  getSwipeOrder: (page: number) =>
    axiosClient.get<ApiResponse<string>>(`/user/swipe-order?page=${page}`),
};
