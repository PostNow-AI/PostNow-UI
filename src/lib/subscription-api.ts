import {
  type StripeCheckoutSessionRequest,
  type StripeCheckoutSessionResponse,
  type SubscriptionCancelResponse,
  type SubscriptionPlan,
  type UserSubscription,
} from "../types/subscription";
import { api } from "./api";

export const subscriptionApiService = {
  // Get all available subscription plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get("/api/v1/credits/plans/");
    return response.data;
  },

  // Get user's current subscription
  getUserSubscription: async (): Promise<UserSubscription | null> => {
    try {
      const response = await api.get("/api/v1/credits/subscription/current/");
      return response.data;
    } catch {
      // If user has no subscription, return null
      return null;
    }
  },

  // Create Stripe checkout session for subscription
  createCheckoutSession: async (
    data: StripeCheckoutSessionRequest
  ): Promise<StripeCheckoutSessionResponse> => {
    const response = await api.post("/api/v1/credits/checkout/", data);
    return response.data;
  },

  // Cancel user's current subscription
  cancelSubscription: async (): Promise<SubscriptionCancelResponse> => {
    const response = await api.post("/api/v1/credits/subscription/cancel/");
    return response.data;
  },
};
