// Global type definitions
// Export all shared types from this barrel file

export type { ApiResponse, PaginatedResponse, ApiError } from "./api.types";
export type { LoginRequest, RegisterRequest, PartnerRegisterRequest } from "./auth.types";
export type {
  Gender,
  DrinkingHabit,
  SmokingHabit,
  InterestedIn,
  ZodiacSign,
  DayOfWeek,
  AvailabilityRequest,
  AvailabilityResponse,
  UserProfile,
  CreateProfileRequest,
  UserPhoto,
  UserResponse,
  AuthenticationResponse,
} from "./user.types";
export type {
  ScheduleStatus,
  MatchSchedule,
  MatchItem,
} from "./match.types";
export type {
  PartnerCreateRequest,
  PartnerImage,
  PartnerResponse,
  ImageUploadResponse,
  PartnerOverviewResponse,
} from "./partner.types";
