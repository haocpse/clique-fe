import axiosClient from "./api";
import type { PartnerCreateRequest, PartnerResponse, ImageUploadResponse, ApiResponse } from "@/types";

export const partnerService = {
  createPartner: (data: PartnerCreateRequest) =>
    axiosClient.post<ApiResponse<PartnerResponse>>("/partner", data),

  getPartnerMe: () =>
    axiosClient.get<ApiResponse<PartnerResponse>>("/partner/me"),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file); // Assuming the field name is 'image', typical for single file uploads, adjust if necessary
    return axiosClient.post<ApiResponse<ImageUploadResponse>>("/partner/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAllPartners: () =>
    axiosClient.get<ApiResponse<PartnerResponse[]>>("/partner"),

  getPartnerOverview: () =>
    axiosClient.get<ApiResponse<import("@/types").PartnerOverviewResponse>>("/partner/over-view"),

  updatePartnerStatus: (id: number, action: "Approve" | "Reject") =>
    axiosClient.put<ApiResponse<PartnerResponse>>(`/partner/${id}?action=${action}`),

  getPartnerById: (id: number) =>
    axiosClient.get<ApiResponse<PartnerResponse>>(`/partner/${id}`),

  getPartnerSchedules: () =>
    axiosClient.get<ApiResponse<import("@/types").MatchSchedule[]>>("/partner/schedule"),
};
