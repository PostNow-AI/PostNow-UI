import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const handleApiError = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (error instanceof AxiosError && error.response) {
    const apiError: ApiError = error.response.data;
    return apiError.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return fallbackMessage;
};

export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};

export const getErrorMessage = (error: AxiosError<ApiError>): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Erro de API";
  }
  if (
    typeof error === "object" &&
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Erro desconhecido";
};

export const logError = (error: unknown, context: string): void => {
  console.error(`[${context}] Error:`, error);
  if (isAxiosError(error)) {
    console.error(`[${context}] Response:`, error.response?.data);
    console.error(`[${context}] Status:`, error.response?.status);
  }
};
