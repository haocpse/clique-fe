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
};
