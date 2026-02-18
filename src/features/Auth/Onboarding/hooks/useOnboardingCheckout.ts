import { useCallback } from "react";
import { toast } from "sonner";
import { SUBSCRIPTION_CONFIG, isValidRedirectPath } from "@/config/subscription";
import {
  useSubscriptionPlans,
  useCreateCheckoutSession,
} from "@/features/Subscription/hooks/useSubscription";
import type { UseMutationResult } from "@tanstack/react-query";

interface UseOnboardingCheckoutProps {
  /** Se o usuário está autenticado (necessário para buscar planos) */
  isAuthenticated: boolean;
  /** Mutation para sincronizar dados antes do checkout */
  syncMutation: UseMutationResult<void, unknown, void, unknown>;
  /** Callback chamado após sync bem-sucedido, antes do redirect ao Stripe */
  onSyncComplete?: () => void;
}

/**
 * Hook para gerenciar checkout do Stripe no onboarding
 *
 * Responsabilidades:
 * - Buscar planos de assinatura disponíveis
 * - Validar URLs de redirect (previne open redirect)
 * - Sincronizar dados do onboarding antes do checkout
 * - Criar sessão de checkout no Stripe
 *
 * @example
 * ```tsx
 * const { handlePlanSelect, isLoadingPlans, isCheckoutPending } = useOnboardingCheckout({
 *   isAuthenticated: true,
 *   syncMutation,
 *   onSyncComplete: () => console.log('Ready for checkout'),
 * });
 *
 * // Selecionar plano mensal
 * await handlePlanSelect('monthly');
 * ```
 */
export const useOnboardingCheckout = ({
  isAuthenticated,
  syncMutation,
  onSyncComplete,
}: UseOnboardingCheckoutProps) => {
  // Hooks para checkout do Stripe - só busca quando autenticado
  const { data: subscriptionPlans, isLoading: isLoadingPlans } = useSubscriptionPlans(isAuthenticated);
  const createCheckout = useCreateCheckoutSession();

  const handlePlanSelect = useCallback(async (planId: string) => {
    // Sincronizar dados do onboarding com o backend primeiro
    try {
      await syncMutation.mutateAsync();
    } catch {
      // CRÍTICO: Não continuar para checkout se sync falhar
      toast.error("Erro ao salvar seu perfil. Tente novamente.");
      return;
    }

    onSyncComplete?.();

    // Verificar se planos estão carregados
    if (!subscriptionPlans?.length) {
      toast.error("Planos não carregados. Aguarde e tente novamente.");
      return;
    }

    // Usar config centralizada para mapear interval
    const { PLAN_INTERVAL_MAP, STRIPE_URLS } = SUBSCRIPTION_CONFIG;
    const targetInterval = PLAN_INTERVAL_MAP[planId as keyof typeof PLAN_INTERVAL_MAP];

    if (!targetInterval) {
      toast.error("Plano inválido selecionado.");
      return;
    }

    // Encontrar o plano correspondente no backend pelo interval
    const backendPlan = subscriptionPlans.find(
      (plan) => plan.interval === targetInterval && plan.is_active
    );

    if (!backendPlan) {
      toast.error("Plano não disponível no momento. Tente novamente.");
      return;
    }

    // Validar URLs de redirect (previne open redirect)
    if (!isValidRedirectPath(STRIPE_URLS.SUCCESS) || !isValidRedirectPath(STRIPE_URLS.CANCEL)) {
      toast.error("Erro de configuração. Contate o suporte.");
      return;
    }

    // URLs de retorno após checkout (usando config centralizada)
    const baseUrl = window.location.origin;
    const successUrl = `${baseUrl}${STRIPE_URLS.SUCCESS}`;
    const cancelUrl = `${baseUrl}${STRIPE_URLS.CANCEL}`;

    // Criar sessão de checkout no Stripe
    try {
      await createCheckout.mutateAsync({
        plan_id: backendPlan.id,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      // O hook já redireciona para o Stripe automaticamente
    } catch {
      toast.error("Erro ao processar pagamento. Tente novamente.");
    }
  }, [subscriptionPlans, createCheckout, syncMutation, onSyncComplete]);

  return {
    handlePlanSelect,
    isLoadingPlans,
    isCheckoutPending: createCheckout.isPending,
  };
};
