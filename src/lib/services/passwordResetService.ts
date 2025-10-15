import { api } from "@/lib/api";
import type { AxiosError } from "axios";

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  new_password1: string;
  new_password2: string;
  uid: string;
  token: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  redirect_url?: string;
  errors?: Record<string, string[]>;
}

export const passwordResetService = {
  /**
   * Solicita redefinição de senha enviando email
   * @param data - Dados da solicitação de redefinição
   * @returns Promise com resultado da solicitação
   */
  requestPasswordReset: async (
    data: PasswordResetRequest
  ): Promise<PasswordResetResponse> => {
    try {
      const response = await api.post(
        `/api/v1/auth/accounts/password/reset/`,
        data
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Erro na solicitação de redefinição de senha:", axiosError);

      const responseData = axiosError.response?.data as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      return {
        success: false,
        message:
          responseData?.message ||
          "Falha ao enviar email de redefinição de senha. Tente novamente.",
        errors: responseData?.errors,
      };
    }
  },

  /**
   * Confirma redefinição de senha com token
   * @param data - Dados da confirmação de redefinição
   * @returns Promise com resultado da confirmação
   */
  confirmPasswordReset: async (
    data: PasswordResetConfirmRequest
  ): Promise<PasswordResetResponse> => {
    try {
      const response = await api.post(
        `/api/v1/auth/accounts/password/reset/${data.uid}/${data.token}/`,
        {
          password1: data.new_password1,
          password2: data.new_password2,
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Erro na confirmação de redefinição de senha:", axiosError);

      const responseData = axiosError.response?.data as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      return {
        success: false,
        message:
          responseData?.message ||
          "Falha ao redefinir senha. O link pode ter expirado ou ser inválido.",
        errors: responseData?.errors,
      };
    }
  },
};
