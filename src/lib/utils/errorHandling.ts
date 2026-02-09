// @ts-nocheck
import { AxiosError } from "axios";

/**
 * Unified backend error response format
 */
export interface UnifiedApiError {
  status: "error";
  code: string;
  message: string;
  errors?: string[];
}

/**
 * Legacy API error format for backward compatibility
 */
export interface ApiError {
  message?: string; // Old format for backward compatibility
  error?: string; // New format from backend
  error_type?: string; // New field for error categorization
  details?: string; // Technical details (debug mode)
  errors?: Record<string, string[]>; // Validation errors
}

/**
 * Structured error result for frontend display
 */
export interface ErrorHandlingResult {
  title: string;
  description: string;
  code?: string;
  errors?: string[];
  originalError: unknown;
}

/**
 * Options for customizing error handling behavior
 */
export interface ErrorHandlingOptions {
  /** Default error title when specific one can't be determined */
  defaultTitle?: string;
  /** Default error description when specific one can't be determined */
  defaultDescription?: string;
  /** Whether to log the error to console */
  logError?: boolean;
  /** Whether to show detailed errors in description */
  showDetailedErrors?: boolean;
}

/**
 * Default error messages for different error codes in Portuguese
 */
const DEFAULT_ERROR_MESSAGES: Record<
  string,
  { title: string; description: string }
> = {
  // Authentication errors
  UNAUTHORIZED: {
    title: "Não autorizado",
    description: "Você precisa estar logado para acessar este recurso",
  },
  FORBIDDEN: {
    title: "Acesso negado",
    description: "Você não tem permissão para acessar este recurso",
  },

  // Validation errors
  BAD_REQUEST: {
    title: "Dados inválidos",
    description: "Verifique os dados informados e tente novamente",
  },
  VALIDATION_ERROR: {
    title: "Erro de validação",
    description: "Os dados fornecidos são inválidos",
  },

  // Not found errors
  NOT_FOUND: {
    title: "Recurso não encontrado",
    description: "O recurso solicitado não foi encontrado",
  },

  // Rate limiting
  RATE_LIMITED: {
    title: "Limite de requisições atingido",
    description:
      "Você fez muitas requisições. Tente novamente em alguns minutos",
  },

  // Server errors
  INTERNAL_SERVER_ERROR: {
    title: "Erro interno do servidor",
    description: "Ocorreu um erro interno. Tente novamente mais tarde",
  },
  BAD_GATEWAY: {
    title: "Erro de gateway",
    description: "Problema de comunicação com o servidor",
  },
  SERVICE_UNAVAILABLE: {
    title: "Serviço indisponível",
    description: "O serviço está temporariamente indisponível",
  },

  // Custom errors
  VALUE_ERROR: {
    title: "Erro de valor",
    description: "Um valor inválido foi fornecido",
  },
  MISSING_KEY_ERROR: {
    title: "Campo obrigatório ausente",
    description: "Um campo obrigatório não foi informado",
  },
  TYPE_ERROR: {
    title: "Erro de tipo",
    description: "O tipo de dados fornecido é inválido",
  },
  ATTRIBUTE_ERROR: {
    title: "Erro de atributo",
    description: "Ocorreu um erro interno no processamento",
  },

  // Generic fallback
  UNKNOWN_ERROR: {
    title: "Erro desconhecido",
    description: "Ocorreu um erro inesperado",
  },
};

/**
 * Check if error response matches the unified backend error format
 */
function isUnifiedApiError(data: unknown): data is UnifiedApiError {
  return (
    typeof data === "object" &&
    data !== null &&
    "status" in data &&
    data.status === "error" &&
    "code" in data &&
    typeof data.code === "string" &&
    "message" in data &&
    typeof data.message === "string"
  );
}

/**
 * Extract error information from various error sources
 */
function extractErrorInfo(error: unknown): {
  code?: string;
  message?: string;
  errors?: string[];
  isUnifiedFormat: boolean;
} {
  // Handle Axios errors
  if (error instanceof AxiosError && error.response) {
    const data = error.response.data;

    // Check if it's the new unified error format
    if (isUnifiedApiError(data)) {
      return {
        code: data.code,
        message: data.message,
        errors: data.errors,
        isUnifiedFormat: true,
      };
    }

    // Handle legacy error formats
    if (typeof data === "object" && data !== null) {
      const apiError = data as Record<string, unknown>;

      // Check for common legacy formats
      if ("error" in apiError && typeof apiError.error === "string") {
        return {
          message: apiError.error,
          isUnifiedFormat: false,
        };
      }

      if ("message" in apiError && typeof apiError.message === "string") {
        return {
          message: apiError.message,
          isUnifiedFormat: false,
        };
      }

      if ("detail" in apiError && typeof apiError.detail === "string") {
        return {
          message: apiError.detail,
          isUnifiedFormat: false,
        };
      }
    }

    // Fallback to HTTP status-based error
    const status = error.response.status;
    return {
      code: getErrorCodeFromStatus(status),
      message: error.message || `HTTP ${status} error`,
      isUnifiedFormat: false,
    };
  }

  // Handle generic errors with message property
  if (error && typeof error === "object" && "message" in error) {
    const genericError = error as { message: string };
    return {
      message: genericError.message,
      isUnifiedFormat: false,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error,
      isUnifiedFormat: false,
    };
  }

  return {
    message: "Erro desconhecido",
    isUnifiedFormat: false,
  };
}

/**
 * Get error code from HTTP status
 */
function getErrorCodeFromStatus(status: number): string {
  const statusMap: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "VALIDATION_ERROR",
    429: "RATE_LIMITED",
    500: "INTERNAL_SERVER_ERROR",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
  };

  return statusMap[status] || "UNKNOWN_ERROR";
}

/**
 * Get default messages for an error code
 */
function getDefaultMessages(code?: string): {
  title: string;
  description: string;
} {
  if (code && code in DEFAULT_ERROR_MESSAGES) {
    return DEFAULT_ERROR_MESSAGES[code];
  }

  return DEFAULT_ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Main error handler function that processes errors from API calls
 * and returns structured, user-friendly error information
 */
export function handleApiError(
  error: unknown,
  options: ErrorHandlingOptions = {}
): ErrorHandlingResult {
  const {
    defaultTitle,
    defaultDescription,
    logError = true,
    showDetailedErrors = true,
  } = options;

  // Log error if requested
  if (logError) {
    console.error("API Error:", error);
    if (error instanceof AxiosError && error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }

  // Extract error information
  const { code, message, errors } = extractErrorInfo(error);

  // Get default messages for the error code
  const defaults = getDefaultMessages(code);

  // Determine final title and description
  const title = defaultTitle || defaults.title;
  let description = defaultDescription || defaults.description;

  // Use the actual error message if available and more specific
  if (message && message !== defaults.description) {
    description = message;
  }

  // Add detailed errors to description if requested
  if (showDetailedErrors && errors && errors.length > 0) {
    const detailedErrors = errors.join("; ");
    if (description !== detailedErrors) {
      description = `${description}: ${detailedErrors}`;
    }
  }

  return {
    title,
    description,
    code,
    errors,
    originalError: error,
  };
}

/**
 * Convenience function for handling form submission errors
 */
export function handleFormError(
  error: unknown,
  options: ErrorHandlingOptions = {}
): ErrorHandlingResult {
  return handleApiError(error, {
    ...options,
    showDetailedErrors: true, // Always show detailed errors for forms
  });
}

/**
 * Convenience function for handling authentication errors
 */
export function handleAuthError(
  error: unknown,
  options: ErrorHandlingOptions = {}
): ErrorHandlingResult {
  return handleApiError(error, {
    ...options,
    defaultTitle: "Erro de autenticação",
    defaultDescription:
      "Problema com autenticação. Tente fazer login novamente",
  });
}

/**
 * Convenience function for handling credit/payment errors
 */
export function handleCreditError(
  error: unknown,
  options: ErrorHandlingOptions = {}
): ErrorHandlingResult {
  return handleApiError(error, {
    ...options,
    defaultTitle: "Erro de créditos",
    defaultDescription: "Problema com créditos ou pagamento",
  });
}

// Legacy functions for backward compatibility
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
