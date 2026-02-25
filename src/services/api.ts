import axios from "axios";
import { env } from "@/config/env";
import { STORAGE_KEYS } from "@/constants";

const axiosClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses → redirect to login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");
      
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
