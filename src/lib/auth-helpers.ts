// @ts-nocheck
import { isAxiosError, AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { cookieUtils } from "./api";

// Generic error handling
interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

export const handleApiError = (
  error: unknown,
  fallbackMessage: string
): never => {
  if (isAxiosError(error) && error.response) {
    const apiError: ApiError = error.response.data as ApiError;
    throw new Error(apiError.message || fallbackMessage);
  }
  throw new Error(fallbackMessage);
};

// Generic API request wrapper
export const apiRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  errorMessage: string
): Promise<T> => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    return handleApiError(error, errorMessage);
  }
};

// Custom event system for authentication state changes
const AUTH_STATE_CHANGED = "auth-state-changed";

export const dispatchAuthStateChange = () => {
  window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGED));
};

export const subscribeToAuthChanges = (callback: () => void) => {
  window.addEventListener(AUTH_STATE_CHANGED, callback);
  return () => window.removeEventListener(AUTH_STATE_CHANGED, callback);
};

// Auth response handler (for login, register, google auth)
export const handleAuthResponse = <
  T extends { access: string; refresh: string }
>(
  data: T
): T => {
  // Store tokens in cookies
  cookieUtils.setTokens(data.access, data.refresh);

  // Notify components of authentication state change
  dispatchAuthStateChange();

  return data;
};

// Generic auth request wrapper
export const authRequest = async <
  T extends { access: string; refresh: string }
>(
  requestFn: () => Promise<AxiosResponse<T>>,
  errorMessage: string
): Promise<T> => {
  const data = await apiRequest(requestFn, errorMessage);
  return handleAuthResponse(data);
};
