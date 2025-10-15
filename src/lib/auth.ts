import {
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
  type SocialAccountsResponse,
} from "@/types/auth";
import { api, cookieUtils } from "./api";
import {
  apiRequest,
  authRequest,
  dispatchAuthStateChange,
} from "./auth-helpers";
import { initiateGoogleOAuth } from "./google-oauth";

// Re-export auth helpers
export { subscribeToAuthChanges } from "./auth-helpers";

// API Functions for TanStack Query
export const authApi = {
  // Authentication requests
  login: (credentials: LoginRequest) =>
    authRequest(
      () => api.post<AuthResponse>("/api/v1/auth/login/", credentials),
      "Login falhou"
    ),

  register: async (userData: RegisterRequest) => {
    const response = await api.post<AuthResponse>(
      "/api/v1/auth/registration/",
      {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        password1: userData.password,
        password2: userData.confirmPassword,
      }
    );
    return response.data;
  },

  handleGoogleCallback: (code: string) =>
    authRequest(
      () => api.post<AuthResponse>("/api/v1/auth/google/callback/", { code }),
      "Autenticação Google falhou"
    ),

  // User data requests
  getCurrentUser: () =>
    apiRequest(
      () => api.get<AuthResponse["user"]>("/api/v1/auth/user/"),
      "Falha ao buscar dados do usuário"
    ),

  googleAuth: () =>
    apiRequest(
      () => api.post<AuthResponse>("/api/v1/auth/google/auth/"),
      "Autenticação Google falhou"
    ),

  // Token management
  refreshToken: async () => {
    const refreshToken = cookieUtils.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const data = await apiRequest(
      () =>
        api.post<{ access: string }>("/api/v1/auth/refresh/", {
          refresh: refreshToken,
        }),
      "Atualização de token falhou"
    );

    // Update access token in cookies
    cookieUtils.updateAccessToken(data.access);
    dispatchAuthStateChange();

    return data;
  },

  // Social account management
  getSocialAccounts: () =>
    apiRequest(
      () => api.get<SocialAccountsResponse>("/api/v1/auth/social-accounts/"),
      "Falha ao buscar contas sociais"
    ),

  disconnectSocialAccount: (accountId: number) =>
    apiRequest(
      () =>
        api.delete<{ message: string; disconnected_provider: string }>(
          `/api/v1/auth/social-accounts/${accountId}/disconnect/`
        ),
      "Falha ao desconectar conta social"
    ),
};

// Utility functions
export const authUtils = {
  loginWithGoogle: initiateGoogleOAuth,

  logout: () => {
    cookieUtils.removeTokens();
    dispatchAuthStateChange();
  },

  getAccessToken: () => cookieUtils.getAccessToken(),
  isAuthenticated: () => !!cookieUtils.getAccessToken(),
};

// Legacy service for backward compatibility
export const authService = {
  ...authApi,
  ...authUtils,
};
