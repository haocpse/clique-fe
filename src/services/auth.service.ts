import axiosClient from "./api";
import type { LoginRequest, RegisterRequest, ApiResponse, AuthenticationResponse } from "@/types";

export const authService = {
  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<AuthenticationResponse>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post<ApiResponse<AuthenticationResponse>>("/auth/register", data),
};
