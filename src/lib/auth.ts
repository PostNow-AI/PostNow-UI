import { AxiosError } from "axios";
import { API_BASE_URL, api, cookieUtils } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

// Custom event system for authentication state changes
const AUTH_STATE_CHANGED = "auth-state-changed";

const dispatchAuthStateChange = () => {
  window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGED));
};

export const subscribeToAuthChanges = (callback: () => void) => {
  window.addEventListener(AUTH_STATE_CHANGED, callback);
  return () => window.removeEventListener(AUTH_STATE_CHANGED, callback);
};

// API Functions for TanStack Query
export const authApi = {
  // POST/PUT/DELETE requests (for useMutation)
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/login/",
        credentials
      );
      const data = response.data;

      // Store tokens in cookies
      cookieUtils.setTokens(data.access, data.refresh);

      // Notify components of authentication state change
      dispatchAuthStateChange();

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError: ApiError = error.response.data;
        throw new Error(apiError.message || "Login failed");
      }
      throw new Error("Login failed");
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/registration/",
        {
          email: userData.email,
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName,
          password1: userData.password,
          password2: userData.confirmPassword,
        }
      );
      const data = response.data;

      // Store tokens in cookies
      cookieUtils.setTokens(data.access, data.refresh);

      // Notify components of authentication state change
      dispatchAuthStateChange();

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError: ApiError = error.response.data;
        throw new Error(apiError.message || "Registration failed");
      }
      throw new Error("Registration failed");
    }
  },

  handleGoogleCallback: async (code: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/google/callback/",
        { code }
      );
      const data = response.data;

      // Store tokens in cookies
      cookieUtils.setTokens(data.access, data.refresh);

      // Notify components of authentication state change
      dispatchAuthStateChange();

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError: ApiError = error.response.data;
        throw new Error(apiError.message || "Google authentication failed");
      }
      throw new Error("Google authentication failed");
    }
  },

  // GET requests (for useQuery)
  getCurrentUser: async (): Promise<AuthResponse["user"]> => {
    try {
      const response = await api.get<AuthResponse["user"]>(
        "/api/v1/auth/user/"
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError: ApiError = error.response.data;
        throw new Error(apiError.message || "Failed to fetch user data");
      }
      throw new Error("Failed to fetch user data");
    }
  },

  refreshToken: async (): Promise<{ access: string }> => {
    const refreshToken = cookieUtils.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    try {
      const response = await api.post<{ access: string }>(
        "/api/v1/auth/refresh/",
        {
          refresh: refreshToken,
        }
      );

      // Update access token in cookies
      cookieUtils.updateAccessToken(response.data.access);

      // Notify components of authentication state change
      dispatchAuthStateChange();

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError: ApiError = error.response.data;
        throw new Error(apiError.message || "Token refresh failed");
      }
      throw new Error("Token refresh failed");
    }
  },
};

// Utility functions
export const authUtils = {
  loginWithGoogle: (): void => {
    const googleAuthUrl = `${API_BASE_URL}/api/v1/auth/google/auth`;
    window.location.href = googleAuthUrl;
  },

  logout: (): void => {
    cookieUtils.removeTokens();

    // Notify components of authentication state change
    dispatchAuthStateChange();

    // Note: User data will be cleared from context/cache by the AuthProvider
  },

  getAccessToken: (): string | undefined => {
    return cookieUtils.getAccessToken();
  },

  isAuthenticated: (): boolean => {
    return !!cookieUtils.getAccessToken();
  },
};

// Legacy service for backward compatibility (can be removed later)
export const authService = {
  login: authApi.login,
  register: authApi.register,
  loginWithGoogle: authUtils.loginWithGoogle,
  handleGoogleCallback: authApi.handleGoogleCallback,
  logout: authUtils.logout,
  getAccessToken: authUtils.getAccessToken,
  isAuthenticated: authUtils.isAuthenticated,
};
