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
    const response = await api.get<UserSubscription | null>(ENDPOINTS.SUBSCRIPTION_CURRENT);
    return response.data;
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

  // Check payment status
  checkPaymentStatus: async (): Promise<PaymentStatusResponse> => {
    const response = await api.get("/api/v1/credits/payment-status/");
    return response.data.data;
  },
};
