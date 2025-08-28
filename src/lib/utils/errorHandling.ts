import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message?: string; // Old format for backward compatibility
  error?: string; // New format from backend
  error_type?: string; // New field for error categorization
  details?: string; // Technical details (debug mode)
  errors?: Record<string, string[]>; // Validation errors
}

export const handleApiError = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (error instanceof AxiosError && error.response) {
    const apiError: ApiError = error.response.data;

    // Priority order: error (new format) > message (old format) > fallback
    if (apiError.error) {
      return apiError.error;
    }

    if (apiError.message) {
      return apiError.message;
    }

    // Handle specific HTTP status codes with Portuguese messages
    const status = error.response.status;
    if (status === 400) {
      return "Dados inválidos. Verifique os campos e tente novamente.";
    } else if (status === 401) {
      return "Não autorizado. Faça login novamente.";
    } else if (status === 403) {
      return "Acesso negado. Você não tem permissão para esta ação.";
    } else if (status === 404) {
      return "Recurso não encontrado.";
    } else if (status === 429) {
      return "Muitas solicitações. Aguarde um momento e tente novamente.";
    } else if (status === 500) {
      return "Erro interno do servidor. Tente novamente em alguns momentos.";
    } else if (status === 503) {
      return "Serviço temporariamente indisponível. Tente novamente em alguns momentos.";
    }

    return fallbackMessage;
  }

  // Network errors
  if (error instanceof AxiosError) {
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    }

    if (error.code === "TIMEOUT" || error.message.includes("timeout")) {
      return "Timeout na solicitação. Tente novamente.";
    }
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
    const apiError = error.response?.data;
    return (
      apiError?.error || apiError?.message || error.message || "Erro de API"
    );
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

export const getErrorType = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    const apiError: ApiError = error.response.data;
    return apiError.error_type || "unknown";
  }
  return "unknown";
};

export const getErrorDetails = (error: unknown): string | undefined => {
  if (error instanceof AxiosError && error.response) {
    const apiError: ApiError = error.response.data;
    return apiError.details;
  }
  return undefined;
};

export const logError = (error: unknown, context: string): void => {
  console.error(`[${context}] Error:`, error);
  if (isAxiosError(error)) {
    console.error(`[${context}] Response:`, error.response?.data);
    console.error(`[${context}] Status:`, error.response?.status);
  }
};
