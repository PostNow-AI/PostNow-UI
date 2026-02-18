/**
 * Configurações centralizadas do sistema de assinaturas
 * Evita constantes duplicadas entre frontend e backend
 */

/** URLs permitidas para redirect do Stripe (whitelist) */
const ALLOWED_REDIRECT_PATHS = [
  "/subscription/success",
  "/onboarding",
  "/dashboard",
] as const;

/**
 * Valida se um path é seguro para redirect
 * Previne open redirect attacks
 */
export const isValidRedirectPath = (path: string): boolean => {
  // Deve começar com / (path relativo)
  if (!path.startsWith("/")) return false;

  // Não pode ter protocolo ou host
  if (path.includes("://") || path.includes("//")) return false;

  // Deve estar na whitelist (verifica o início do path)
  return ALLOWED_REDIRECT_PATHS.some(allowed => path.startsWith(allowed));
};

export const SUBSCRIPTION_CONFIG = {
  /** Dias de teste grátis */
  TRIAL_DAYS: 10,

  /** Mapeamento de IDs do frontend para intervals do backend */
  PLAN_INTERVAL_MAP: {
    monthly: "monthly",
    annual: "yearly",
  } as const,

  /** URLs de retorno do Stripe (validadas) */
  STRIPE_URLS: {
    SUCCESS: "/subscription/success",
    CANCEL: "/onboarding?checkout=cancelled",
  } as const,
} as const;

/** Tipo para os IDs de plano do frontend */
export type FrontendPlanId = keyof typeof SUBSCRIPTION_CONFIG.PLAN_INTERVAL_MAP;

/** Tipo para os intervals do backend */
export type BackendInterval = (typeof SUBSCRIPTION_CONFIG.PLAN_INTERVAL_MAP)[FrontendPlanId];
