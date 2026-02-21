// Environment configuration
// Access env variables through this file for type safety

export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8080/api',
  APP_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const
