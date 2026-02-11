// @ts-nocheck
import { AxiosError } from "axios";
import {
  type StripeCheckoutSessionRequest,
  type StripeCheckoutSessionResponse,
  type SubscriptionCancelResponse,
  type SubscriptionPlan,
  type UserSubscription,
} from "../types/subscription";
import { api } from "./api";

/** Endpoints da API de assinatura */
const ENDPOINTS = {
  PLANS: "/api/v1/credits/plans/",
  SUBSCRIPTION_CURRENT: "/api/v1/credits/subscription/current/",
  CHECKOUT: "/api/v1/credits/checkout/",
  CANCEL: "/api/v1/credits/subscription/cancel/",
} as const;

export const subscriptionApiService = {
  // Get all available subscription plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get<SubscriptionPlan[]>(ENDPOINTS.PLANS);
    return response.data;
  },

  // Get user's current subscription
  getUserSubscription: async (): Promise<UserSubscription | null> => {
    try {
      const response = await api.get<UserSubscription>(ENDPOINTS.SUBSCRIPTION_CURRENT);
      return response.data;
    } catch (error: unknown) {
      // 404 é esperado quando usuário não tem assinatura
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      // Logar outros erros para debugging
      console.error("[subscription-api] Erro ao buscar assinatura:", error);
      // Retornar null para não quebrar a UI, mas o erro foi logado
      return null;
    }
  },

  // Create Stripe checkout session for subscription
  createCheckoutSession: async (
    data: StripeCheckoutSessionRequest
  ): Promise<StripeCheckoutSessionResponse> => {
    const response = await api.post<{ success: boolean; checkout_url: string }>(
      ENDPOINTS.CHECKOUT,
      data
    );
    return { checkout_url: response.data.checkout_url };
  },

  // Cancel user's current subscription
  cancelSubscription: async (): Promise<SubscriptionCancelResponse> => {
    const response = await api.post<SubscriptionCancelResponse>(ENDPOINTS.CANCEL);
    return response.data;
  },
};
