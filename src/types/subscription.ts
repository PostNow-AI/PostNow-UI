export interface SubscriptionPlan {
  id: number;
  name: string;
  credits: number;
  price: number;
  is_active: boolean;
  // interval é obrigatório - sempre retornado pelo backend
  interval: "monthly" | "quarterly" | "semester" | "yearly" | "lifetime";
  // Campos opcionais
  description?: string;
  interval_display?: string;
  stripe_price_id?: string;
  benefits?: string[];
}

export interface UserSubscription {
  id: number;
  user: number;
  plan: SubscriptionPlan;
  start_date: string;
  end_date: string | null;
  status: "active" | "trialing" | "cancelled" | "expired";
  status_display: string;
  stripe_subscription_id: string | null;
}

export interface StripeCheckoutSessionRequest {
  plan_id: number;
  success_url: string;
  cancel_url: string;
  /** Se true, indica upgrade de plano existente */
  upgrade?: boolean;
}

export interface StripeCheckoutSessionResponse {
  checkout_url: string;
}

export interface SubscriptionCancelResponse {
  success: boolean;
  message: string;
}
