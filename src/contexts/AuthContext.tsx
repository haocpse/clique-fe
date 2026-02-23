import { createContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { STORAGE_KEYS } from "@/constants";
import type { LoginRequest, RegisterRequest, UserResponse } from "@/types";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Decode JWT payload to extract user id.
 * JWT format: header.payload.signature
 */
function decodeTokenUserId(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId ?? payload.sub ?? null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;

  // On mount: if token exists, fetch user profile
  useEffect(() => {
    const init = async () => {
      if (token) {
        const userId = decodeTokenUserId(token);
        if (userId) {
          try {
            const res = await userService.getProfile(userId);
            setUser(res.data.data);
          } catch {
            // Token might be invalid/expired
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const refreshUser = async () => {
    if (!token) return;
    const userId = decodeTokenUserId(token);
    if (!userId) return;
    try {
      const res = await userService.getProfile(userId);
      setUser(res.data.data);
    } catch {
      // silently fail
    }
  };

  const login = async (data: LoginRequest) => {
    const res = await authService.login(data);
    const jwt = res.data.data;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, jwt);
    setToken(jwt);

    // Fetch user profile after login
    const userId = decodeTokenUserId(jwt);
    if (userId) {
      try {
        const userRes = await userService.getProfile(userId);
        setUser(userRes.data.data);
      } catch {
        // Profile may not exist yet
      }
    }
  };

  const register = async (data: RegisterRequest) => {
    const res = await authService.register(data);
    const jwt = res.data.data;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, jwt);
    setToken(jwt);

    // New user, no profile yet
    const userId = decodeTokenUserId(jwt);
    if (userId) {
      setUser({
        id: userId,
        email: data.email,
        enabled: true,
        emailVerified: false,
        authProvider: "LOCAL",
        role: "USER",
        createdAt: new Date().toISOString(),
        photos: [],
      });
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
