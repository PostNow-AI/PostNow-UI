export interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price: number;
  is_active: boolean;
}

export interface UserCredits {
  id: number;
  username: string;
  balance: number;
  has_credits: boolean;
  last_updated: string;
}

export interface CreditTransaction {
  id: number;
  username: string;
  amount: number;
  transaction_type: "purchase" | "usage" | "refund" | "bonus" | "adjustment";
  transaction_type_display: string;
  ai_model?: string;
  description: string;
  created_at: string;
}

export interface AIModel {
  id: number;
  name: string;
  provider: string;
  cost_per_token: number;
  is_active: boolean;
}

export interface CreditUsageSummary {
  total_purchased: number;
  total_used: number;
  current_balance: number;
  usage_percentage: number;
}

export interface StripeCheckoutData {
  session_id: string;
  checkout_url: string;
  package: {
    id: number;
    name: string;
    credits: number;
    price: number;
  };
}

export interface CreditUsageCalculation {
  ai_model: string;
  estimated_tokens: number;
  estimated_cost: number;
  has_sufficient_credits: boolean;
  current_balance: number;
}

export interface StripeCheckoutRequest {
  package_id: number;
  success_url: string;
  cancel_url: string;
}

export interface CreditUsageRequest {
  ai_model: string;
  estimated_tokens: number;
  description: string;
}

// New monthly credits types for the mixed subscription + credit system
export interface MonthlyCreditsStatus {
  monthly_allocated: number;
  monthly_used: number;
  monthly_remaining: number;
  usage_percentage: number;
  last_reset: string | null;
}

export interface SubscriptionInfo {
  has_active_subscription: boolean;
  plan_name: string | null;
  plan_interval: string | null;
  monthly_credits_allocation: number;
  allows_extra_purchase: boolean;
}

export interface PricingInfo {
  fixed_prices: {
    text_generation: number;
    image_generation: number;
  };
  capabilities: {
    text_generations_possible: number;
    image_generations_possible: number;
  };
}

export interface UsageTips {
  efficient_usage: string;
  text_operations: string;
  image_operations: string;
}

export interface MonthlyCreditsData {
  monthly_status: MonthlyCreditsStatus;
  subscription_info: SubscriptionInfo;
  pricing_info: PricingInfo;
  usage_tips: UsageTips;
}
