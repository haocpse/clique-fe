import axiosClient from "./api";
import type { LoginRequest, RegisterRequest, ApiResponse } from "@/types";

export const authService = {
  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<string>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post<ApiResponse<string>>("/auth/register", data),
};
