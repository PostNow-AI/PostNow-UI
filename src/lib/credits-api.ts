import {
  type AIModel,
  type CreditPackage,
  type CreditTransaction,
  type CreditUsageCalculation,
  type CreditUsageRequest,
  type CreditUsageSummary,
  type MonthlyCreditsData,
  type StripeCheckoutData,
  type StripeCheckoutRequest,
  type UserCredits,
} from "../types/credits";
import { api } from "./api";

export const creditsApiService = {
  // Pacotes de créditos
  getCreditPackages: async (): Promise<CreditPackage[]> => {
    const response = await api.get<CreditPackage[]>("/api/v1/credits/packages/");
    return response.data;
  },

  // Saldo do usuário
  getUserCredits: async (): Promise<UserCredits> => {
    const response = await api.get<UserCredits>("/api/v1/credits/balance/");
    return response.data;
  },

  // Monthly credits status (new mixed subscription + credit system)
  getMonthlyCredits: async (): Promise<MonthlyCreditsData> => {
    const response = await api.get<{ data: MonthlyCreditsData }>("/api/v1/credits/monthly/");
    return response.data.data;
  },

  // Resumo de uso
  getUsageSummary: async (): Promise<CreditUsageSummary> => {
    const response = await api.get<{ data: CreditUsageSummary }>("/api/v1/credits/summary/");
    return response.data.data;
  },

  // Histórico de transações
  getTransactions: async (): Promise<CreditTransaction[]> => {
    const response = await api.get<CreditTransaction[]>("/api/v1/credits/transactions/");
    return response.data;
  },

  // Modelos de IA
  getAIModels: async (): Promise<AIModel[]> => {
    const response = await api.get<AIModel[]>("/api/v1/credits/ai-models/");
    return response.data;
  },

  // Criar sessão de checkout Stripe
  createStripeCheckout: async (
    data: StripeCheckoutRequest
  ): Promise<StripeCheckoutData> => {
    const response = await api.post<{ data: StripeCheckoutData }>("/api/v1/credits/stripe/checkout/", data);
    return response.data.data;
  },

  // Calcular custo de uso
  calculateUsageCost: async (
    data: CreditUsageRequest
  ): Promise<CreditUsageCalculation> => {
    const response = await api.post<{ data: CreditUsageCalculation }>("/api/v1/credits/usage/calculate/", data);
    return response.data.data;
  },

  // Deduzir créditos após uso
  deductCredits: async (
    data: CreditUsageRequest
  ): Promise<{ credits_deducted: number; new_balance: number }> => {
    const response = await api.post<{ data: { credits_deducted: number; new_balance: number } }>("/api/v1/credits/usage/deduct/", data);
    return response.data.data;
  },
};
