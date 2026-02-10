/**
 * Configurações centralizadas do sistema de assinaturas
 * Evita constantes duplicadas entre frontend e backend
 */

export const SUBSCRIPTION_CONFIG = {
  /** Dias de teste grátis */
  TRIAL_DAYS: 10,

  /** Mapeamento de IDs do frontend para intervals do backend */
  PLAN_INTERVAL_MAP: {
    monthly: "monthly",
    annual: "yearly",
  } as const,

  /** URLs de retorno do Stripe */
  STRIPE_URLS: {
    SUCCESS: "/?checkout=success",
    CANCEL: "/onboarding?checkout=cancelled",
  } as const,
} as const;

/** Tipo para os IDs de plano do frontend */
export type FrontendPlanId = keyof typeof SUBSCRIPTION_CONFIG.PLAN_INTERVAL_MAP;

/** Tipo para os intervals do backend */
export type BackendInterval = (typeof SUBSCRIPTION_CONFIG.PLAN_INTERVAL_MAP)[FrontendPlanId];
