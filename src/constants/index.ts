// App-wide constants

export const APP_NAME = "Clique";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE_CREATE: "/profile/create",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_ME: "/profile/me",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USER: {
    PROFILE: (id: number) => `/user/${id}/profile`,
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;
