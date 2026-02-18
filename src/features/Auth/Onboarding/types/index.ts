// Status do onboarding retornado pela API
export interface OnboardingStatus {
  onboarding_completed: boolean;
  has_data: boolean;
  filled_fields_count: number;
  total_fields_count: number;
}

// Re-exportar tipos de storage para uso centralizado
export type { OnboardingTempData } from "../hooks/useOnboardingStorage";

// Tipos de autenticação
export type AuthMode = "signup" | "login" | null;

// Tipos de fase do onboarding
export type PhaseType = "negocio" | "publico" | "marca";

// Configuração de plano para Paywall
export interface PaywallPlan {
  id: string;
  name: string;
  price: number;
  pricePerMonth: number;
  interval: "month" | "year";
  badge?: string;
  savings?: string;
  recommended?: boolean;
}

// Props comuns para steps
export interface StepBaseProps {
  onNext: () => void;
  onBack: () => void;
}

// Props para steps com valor controlado
export interface StepWithValueProps<T> extends StepBaseProps {
  value: T;
  onChange: (value: T) => void;
}
