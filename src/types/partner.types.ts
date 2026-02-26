import type { UserResponse } from "./user.types";

export interface PartnerCreateRequest {
  organizationName: string;
  description: string;
  phone: string;
  website: string;
  address: string;
  imageIds: number[];
}

export interface PartnerImage {
  id: number;
  imageUrl: string;
}

export interface PartnerResponse {
  id: number;
  user: UserResponse;
  organizationName: string;
  description: string;
  status: string;
  phone: string;
  website: string;
  address: string;
  images: PartnerImage[];
}

export interface ImageUploadResponse {
  id: number;
  imageUrl: string;
}

export interface PartnerOverviewResponse {
  pending: number;
  approved: number;
  rejected: number;
}
