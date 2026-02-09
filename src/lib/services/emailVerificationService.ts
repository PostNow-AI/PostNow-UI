// @ts-nocheck
import { api } from "@/lib/api";
import type { AxiosError } from "axios";

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  redirect_url?: string;
  errors?: Record<string, string[]>;
}

export const emailVerificationService = {
  /**
   * Verifica o email do usuário usando a chave de verificação
   * @param key - Chave de verificação recebida por email
   * @returns Promise com resultado da verificação
   */
  verifyEmail: async (key: string): Promise<EmailVerificationResponse> => {
    try {
      const response = await api.post(
        `/api/v1/auth/accounts/confirm-email/${key}/`,
        {},
        {
          validateStatus: (status) => status >= 200 && status < 400, // Accept 2xx and 3xx
        }
      );

      // If it's a redirect (302), treat it as success
      if (response.status === 302) {
        return {
          success: true,
          message: "Email confirmed successfully. You are now logged in.",
          redirect_url: response.headers.location || "/login",
        };
      }

      // For JSON responses, return the data directly
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Erro na verificação do email:", axiosError);

      // If it's a redirect that was caught as an error, treat it as success
      if (axiosError.response?.status === 302) {
        return {
          success: true,
          message: "Email confirmed successfully. You are now logged in.",
          redirect_url: axiosError.response.headers.location || "/login",
        };
      }

      // For other errors, return failure
      const responseData = axiosError.response?.data as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      return {
        success: false,
        message:
          responseData?.message ||
          "Falha ao verificar o email. O link pode ter expirado ou ser inválido.",
        errors: responseData?.errors,
      };
    }
  },
};
