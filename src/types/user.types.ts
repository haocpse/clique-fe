// ── Enums ──

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type DrinkingHabit = "NEVER" | "NO" | "SOCIAL" | "REGULAR";
export type SmokingHabit = "NEVER" | "NO" | "SOCIAL" | "REGULAR";
export type InterestedIn = "MALE" | "FEMALE" | "BOTH";

export type ZodiacSign =
  | "ARIES"
  | "TAURUS"
  | "GEMINI"
  | "CANCER"
  | "LEO"
  | "VIRGO"
  | "LIBRA"
  | "SCORPIO"
  | "SAGITTARIUS"
  | "CAPRICORN"
  | "AQUARIUS"
  | "PISCES";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface AvailabilityRequest {
  dayOfWeek?: DayOfWeek;
  specificDate?: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  note?: string;
}

export interface AvailabilityResponse {
  id: number;
  dayOfWeek?: DayOfWeek;
  specificDate?: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  isActive: boolean;
  note?: string;
}

// ── Profile ──

export interface UserProfile {
  phoneNumber?: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  birthday: string;
  gender: Gender;
  bio?: string;
  city?: string;
  country?: string;
  occupation?: string;
  company?: string;
  school?: string;
  heightCm?: number;
  drinkingHabit?: DrinkingHabit;
  smokingHabit?: SmokingHabit;
  zodiacSign?: ZodiacSign;
  interestedIn?: InterestedIn;
  minAgePreference?: number;
  maxAgePreference?: number;
  maxDistanceKm?: number;
}

export interface CreateProfileRequest extends UserProfile {}

export interface AuthenticationResponse {
  token: string;
}

// ── User ──
export interface UserPhoto {
  id: number;
  photoUrl: string;
  displayOrder: number;
}

export interface UserResponse {
  id: number;
  email: string;
  phoneNumber?: string;
  swipeOrder?: string;
  profile?: UserProfile;
  photos: UserPhoto[];
  availabilities?: AvailabilityResponse[];
}
