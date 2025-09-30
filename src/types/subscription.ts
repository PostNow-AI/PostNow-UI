export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  interval: "monthly" | "quarterly" | "semester" | "yearly" | "lifetime";
  interval_display: string;
  stripe_price_id: string;
  is_active: boolean;
}

export interface UserSubscription {
  id: number;
  user: number;
  plan: SubscriptionPlan;
  start_date: string;
  end_date: string | null;
  status: "active" | "cancelled" | "expired";
  status_display: string;
  stripe_subscription_id: string | null;
}

export interface StripeCheckoutSessionRequest {
  plan_id: number;
}

export interface StripeCheckoutSessionResponse {
  checkout_url: string;
}

export interface SubscriptionCancelResponse {
  success: boolean;
  message: string;
}
