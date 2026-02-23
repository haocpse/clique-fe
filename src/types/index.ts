// Global type definitions
// Export all shared types from this barrel file

export type { ApiResponse, PaginatedResponse, ApiError } from "./api.types";
export type { LoginRequest, RegisterRequest } from "./auth.types";
export type {
  Gender,
  DrinkingHabit,
  SmokingHabit,
  InterestedIn,
  ZodiacSign,
  UserProfile,
  CreateProfileRequest,
  UserPhoto,
  UserResponse,
} from "./user.types";
