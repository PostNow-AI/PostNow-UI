import { AxiosError } from "axios";

/**
 * Enhanced API error structure for AI services
 */
export interface AIServiceApiError {
  error?: string;
  message?: string;
  details?: string;
  error_type?: string;
  status?: number;
}

/**
 * Structured error result from AI error handling
 */
export interface AIErrorHandlingResult {
  title: string;
  description: string;
  errorType: string;
  originalError: unknown;
}

/**
 * Options for customizing AI error handling behavior
 */
export interface AIErrorHandlingOptions {
  /** Default error title when specific one can't be determined */
  defaultTitle?: string;
  /** Default error description when specific one can't be determined */
  defaultDescription?: string;
  /** Operation context for more specific error messages */
  operationContext?: {
    type: "generate" | "regenerate" | "edit" | "improve" | "create" | "delete";
    resource: "image" | "text" | "idea" | "campaign" | "post";
    hasExisting?: boolean;
  };
  /** Whether to log the error to console */
  logError?: boolean;
}

/**
 * Default error messages for different AI operations in Portuguese
 */
const DEFAULT_ERROR_MESSAGES = {
  // Image operations
  image_generate: {
    title: "Erro ao gerar imagem",
    description: "Não foi possível gerar a imagem",
  },
  image_regenerate: {
    title: "Erro ao regenerar imagem",
    description: "Não foi possível regenerar a imagem",
  },

  // Text/Content operations
  text_generate: {
    title: "Erro ao gerar conteúdo",
    description: "Não foi possível gerar o conteúdo",
  },
  text_regenerate: {
    title: "Erro ao regenerar conteúdo",
    description: "Não foi possível regenerar o conteúdo",
  },
  text_edit: {
    title: "Erro ao editar conteúdo",
    description: "Não foi possível editar o conteúdo",
  },
  text_improve: {
    title: "Erro ao melhorar conteúdo",
    description: "Não foi possível melhorar o conteúdo",
  },

  // Idea operations
  idea_generate: {
    title: "Erro ao gerar ideia",
    description: "Não foi possível gerar a ideia",
  },
  idea_regenerate: {
    title: "Erro ao regenerar ideia",
    description: "Não foi possível regenerar a ideia",
  },
  idea_edit: {
    title: "Erro ao editar ideia",
    description: "Não foi possível editar a ideia",
  },
  idea_improve: {
    title: "Erro ao melhorar ideia",
    description: "Não foi possível melhorar a ideia",
  },

  // Campaign operations
  campaign_generate: {
    title: "Erro ao gerar campanha",
    description: "Não foi possível gerar a campanha",
  },
  campaign_create: {
    title: "Erro ao criar campanha",
    description: "Não foi possível criar a campanha",
  },

  // Post operations
  post_generate: {
    title: "Erro ao gerar post",
    description: "Não foi possível gerar o post",
  },
  post_create: {
    title: "Erro ao criar post",
    description: "Não foi possível criar o post",
  },
  post_edit: {
    title: "Erro ao editar post",
    description: "Não foi possível editar o post",
  },

  // Generic fallback
  generic: {
    title: "Erro na operação com IA",
    description: "Não foi possível completar a operação",
  },
} as const;

/**
 * Specific error patterns and their user-friendly messages
 */
const SPECIFIC_ERROR_PATTERNS = [
  {
    patterns: [
      /créditos?\s+insuficientes?/i,
      /insufficient\s+credits?/i,
      /not\s+enough\s+credits?/i,
      /sem\s+créditos?/i,
    ],
    message: "Créditos insuficientes para realizar esta operação",
  },
  {
    patterns: [
      /rate\s+limit/i,
      /limite\s+de\s+taxa/i,
      /many\s+requests/i,
      /muitas\s+tentativas/i,
    ],
    message:
      "Limite de requisições atingido. Tente novamente em alguns minutos",
  },
  {
    patterns: [
      /api\s+key/i,
      /chave\s+api/i,
      /authentication/i,
      /autenticação/i,
      /unauthorized/i,
      /não\s+autorizado/i,
    ],
    message: "Erro de autenticação com o serviço de IA",
  },
  {
    patterns: [
      /service\s+unavailable/i,
      /serviço\s+indisponível/i,
      /server\s+error/i,
      /erro\s+do\s+servidor/i,
      /internal\s+server\s+error/i,
    ],
    message: "Serviço de IA temporariamente indisponível. Tente novamente",
  },
  {
    patterns: [/timeout/i, /tempo\s+esgotado/i, /request\s+timeout/i],
    message: "Operação expirou. Tente novamente",
  },
  {
    patterns: [
      /network/i,
      /rede/i,
      /connection/i,
      /conexão/i,
      /connectivity/i,
      /conectividade/i,
    ],
    message: "Erro de conexão. Verifique sua internet e tente novamente",
  },
];

/**
 * Extract and format error message from various error sources with AI context
 */
function extractErrorMessage(error: unknown): string {
  let rawMessage = "";

  // Handle Axios errors (most common for API calls)
  if (error instanceof AxiosError && error.response) {
    const apiError = error.response.data as AIServiceApiError;
    rawMessage = apiError.error || apiError.message || error.message || "";
  }
  // Handle generic errors with message property
  else if (error && typeof error === "object" && "message" in error) {
    const genericError = error as { message: string };
    rawMessage = genericError.message || "";
  }
  // Handle string errors
  else if (typeof error === "string") {
    rawMessage = error;
  }

  // Check for specific error patterns and return user-friendly messages
  const normalizedMessage = rawMessage.toLowerCase();

  for (const errorPattern of SPECIFIC_ERROR_PATTERNS) {
    for (const pattern of errorPattern.patterns) {
      if (pattern.test(normalizedMessage)) {
        return errorPattern.message;
      }
    }
  }

  // Return original message if no pattern matches and it's user-friendly
  if (
    rawMessage &&
    !rawMessage.toLowerCase().includes("error:") &&
    rawMessage.length < 200
  ) {
    return rawMessage;
  }

  return "";
}

/**
 * Determine error type from error object
 */
function getErrorType(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const apiError = error.response.data as AIServiceApiError;

      if (apiError.error_type) {
        return apiError.error_type;
      }

      // Categorize by HTTP status
      if (status === 400) return "validation_error";
      if (status === 401 || status === 403) return "auth_error";
      if (status === 404) return "not_found";
      if (status === 429) return "rate_limit";
      if (status >= 500) return "server_error";

      return "api_error";
    } else if (error.request) {
      return "network_error";
    }
  }

  return "unknown_error";
}

/**
 * Get appropriate default messages based on operation context
 */
function getContextualDefaults(
  operationContext?: AIErrorHandlingOptions["operationContext"]
): { title: string; description: string } {
  if (!operationContext) {
    return DEFAULT_ERROR_MESSAGES.generic;
  }

  const { type, resource, hasExisting } = operationContext;

  // Build key for lookup
  let key: string;

  if (type === "regenerate" || (type === "generate" && hasExisting)) {
    key = `${resource}_regenerate`;
  } else {
    key = `${resource}_${type}`;
  }

  // Type assertion to ensure we get a valid key
  const messageKey = key as keyof typeof DEFAULT_ERROR_MESSAGES;

  return DEFAULT_ERROR_MESSAGES[messageKey] || DEFAULT_ERROR_MESSAGES.generic;
}

/**
 * Main AI error handler function that processes errors from AI service calls
 * and returns structured, user-friendly error information
 *
 * @param error - The error object from the AI service call
 * @param options - Configuration options for error handling
 * @returns Structured error information for display to user
 */
export function handleAIServiceError(
  error: unknown,
  options: AIErrorHandlingOptions = {}
): AIErrorHandlingResult {
  const {
    defaultTitle,
    defaultDescription,
    operationContext,
    logError = true,
  } = options;

  // Log error if requested
  if (logError) {
    console.error("AI Service Error:", error);
    if (error instanceof AxiosError && error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }

  // Get contextual defaults
  const contextualDefaults = getContextualDefaults(operationContext);

  // Extract error message from the error object
  const extractedMessage = extractErrorMessage(error);

  // Determine final title and description
  const title = defaultTitle || contextualDefaults.title;
  const description =
    extractedMessage || defaultDescription || contextualDefaults.description;

  // Get error type for potential programmatic handling
  const errorType = getErrorType(error);

  return {
    title,
    description,
    errorType,
    originalError: error,
  };
}

/**
 * Convenience function for handling image generation errors
 */
export function handleImageGenerationError(
  error: unknown,
  isRegeneration = false
): AIErrorHandlingResult {
  return handleAIServiceError(error, {
    operationContext: {
      type: isRegeneration ? "regenerate" : "generate",
      resource: "image",
      hasExisting: isRegeneration,
    },
  });
}

/**
 * Convenience function for handling content/text generation errors
 */
export function handleContentGenerationError(
  error: unknown,
  operationType: "generate" | "regenerate" | "edit" | "improve" = "generate"
): AIErrorHandlingResult {
  return handleAIServiceError(error, {
    operationContext: {
      type: operationType,
      resource: "text",
    },
  });
}

/**
 * Convenience function for handling idea generation errors
 */
export function handleIdeaGenerationError(
  error: unknown,
  operationType: "generate" | "regenerate" | "edit" | "improve" = "generate"
): AIErrorHandlingResult {
  return handleAIServiceError(error, {
    operationContext: {
      type: operationType,
      resource: "idea",
    },
  });
}

/**
 * Convenience function for handling campaign generation errors
 */
export function handleCampaignGenerationError(
  error: unknown
): AIErrorHandlingResult {
  return handleAIServiceError(error, {
    operationContext: {
      type: "generate",
      resource: "campaign",
    },
  });
}

/**
 * Convenience function for handling post generation errors
 */
export function handlePostGenerationError(
  error: unknown,
  operationType: "generate" | "create" | "edit" = "generate"
): AIErrorHandlingResult {
  return handleAIServiceError(error, {
    operationContext: {
      type: operationType,
      resource: "post",
    },
  });
}
