import axiosClient from "./api";
import type { LoginRequest, RegisterRequest, PartnerRegisterRequest, ApiResponse, AuthenticationResponse } from "@/types";

export const authService = {
  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<AuthenticationResponse>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post<ApiResponse<AuthenticationResponse>>("/auth/register", data),

  registerPartner: (data: PartnerRegisterRequest) =>
    axiosClient.post<ApiResponse<AuthenticationResponse>>("/auth/partner", data),
};
