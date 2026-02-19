import { useCallback, useState, useEffect, useRef } from "react";
import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOnboardingStorage } from "./hooks/useOnboardingStorage";
import { useOnboardingTracking } from "./hooks/useOnboardingTracking";
import type { OnboardingFormData } from "./constants/onboardingSchema";
import {
  WelcomeStep,
  BusinessNameStep,
  NicheStep,
  DescriptionStep,
  PurposeStep,
  PersonalityStep,
  ProductsStep,
  TargetAudienceStep,
  InterestsStep,
  LocationStep,
  CompetitorsStep,
  VoiceToneStep,
  VisualStyleStep,
  ColorsStep,
  LogoStep,
  ProfileReadyStep,
  PreviewStep,
  SignupStep,
  LoginStep,
  PaywallStep,
} from "./components/new/steps";
import {
  submitOnboardingStep1,
  submitOnboardingStep2,
} from "./services";
import { handleApiError } from "@/lib/utils/errorHandling";
import { SUBSCRIPTION_CONFIG } from "@/config/subscription";
import {
  useSubscriptionPlans,
  useCreateCheckoutSession,
  useUserSubscription,
} from "@/features/Subscription/hooks/useSubscription";
import { authUtils } from "@/lib/auth";

type AuthMode = "signup" | "login" | null;

interface OnboardingNewProps {
  mode?: "create" | "edit";
  initialData?: OnboardingFormData;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const OnboardingNew = ({
  mode = "create",
  initialData,
  onComplete,
  onCancel,
}: OnboardingNewProps) => {
  const queryClient = useQueryClient();
  const isEditMode = mode === "edit";

  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is already logged in from previous session
  const isAuthenticated = authUtils.isAuthenticated()
  const { data: userSubscription } = useUserSubscription(isAuthenticated);
  const hasActiveSubscription = userSubscription?.status === "active";

  // Hooks para checkout do Stripe - só busca quando autenticado
  const { data: subscriptionPlans, isLoading: isLoadingPlans } = useSubscriptionPlans(isAuthenticated);
  const createCheckout = useCreateCheckoutSession();

  const {
    data,
    saveData,
    setCurrentStep,
    markAsCompleted,
    clearData,
    getStep1Payload,
    getStep2Payload,
    isLoaded,
    initializeWithData,
    linkDataToUser,
    sessionId,
  } = useOnboardingStorage();

  // Tracking hook for funnel analytics
  const { trackStep, trackStepComplete, clearTracking } = useOnboardingTracking();
  const lastTrackedStepRef = useRef<number>(0);

  // Inicializar com dados no modo edição
  useEffect(() => {
    if (isEditMode && initialData && isLoaded && !isInitialized) {
      // Converter OnboardingFormData para OnboardingTempData
      const convertedData = {
        ...initialData,
        // Converter brand_personality de string para array
        brand_personality: initialData.brand_personality
          ? initialData.brand_personality.split(",").map((s) => s.trim())
          : [],
        // Converter target_interests de string para array
        target_interests: initialData.target_interests
          ? initialData.target_interests.split(",").map((s) => s.trim())
          : [],
        // Converter cores individuais para array
        colors: [
          initialData.color_1,
          initialData.color_2,
          initialData.color_3,
          initialData.color_4,
          initialData.color_5,
        ].filter((c): c is string => !!c),
      };
      initializeWithData(convertedData);
      setIsInitialized(true);
    }
  }, [isEditMode, initialData, isLoaded, isInitialized, initializeWithData]);

  // If user is already logged in but has no subscription, jump to paywall
  // BUT only if onboarding data exists (user completed the flow)
  // AND user is not in login mode (to allow showing error message on login screen)
  useEffect(() => {
    if (!isEditMode && isLoaded && isAuthenticated && !hasActiveSubscription && authMode !== "login") {
      // Verificar se os dados do onboarding foram preenchidos
      const hasOnboardingData = data.business_name && data.specialization && data.business_description;

      if (hasOnboardingData) {
        // Jump directly to paywall step
        if (data.current_step < 19) {
          setCurrentStep(19);
        }
      }
      // Se não tem dados do onboarding, deixa o usuário completar o fluxo
    }
  }, [isEditMode, isLoaded, isAuthenticated, hasActiveSubscription, authMode, data.current_step, data.business_name, data.specialization, data.business_description, setCurrentStep]);

  // Track step visits for funnel analytics (only in create mode)
  useEffect(() => {
    if (!isEditMode && isLoaded && data.current_step !== lastTrackedStepRef.current) {
      // Track visit to the current step
      trackStep(data.current_step, false);

      // If we moved forward, mark the previous step as completed
      if (lastTrackedStepRef.current > 0 && data.current_step > lastTrackedStepRef.current) {
        trackStepComplete(lastTrackedStepRef.current);
      }

      lastTrackedStepRef.current = data.current_step;
    }
  }, [data.current_step, isLoaded, isEditMode, trackStep, trackStepComplete]);

  // Mutation para sincronizar dados com o backend
  const syncMutation = useMutation({
    mutationFn: async () => {
      // Ler dados FRESCOS do localStorage para evitar stale closure
      const STORAGE_KEY = "postnow_onboarding_data";
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        throw new Error("Dados do onboarding não encontrados");
      }

      const freshData = JSON.parse(stored);
      console.log("[Onboarding] Dados frescos do localStorage:", freshData);

      // Step 1: Business info
      const step1Payload = {
        business_name: freshData.business_name,
        business_phone: freshData.business_phone,
        business_website: freshData.business_website,
        business_instagram_handle: freshData.business_instagram_handle,
        specialization: freshData.specialization,
        business_description: freshData.business_description,
        business_purpose: freshData.business_purpose,
        brand_personality: Array.isArray(freshData.brand_personality)
          ? freshData.brand_personality.join(", ")
          : freshData.brand_personality,
        products_services: freshData.products_services,
        business_location: freshData.business_location,
        target_audience: freshData.target_audience,
        target_interests: Array.isArray(freshData.target_interests)
          ? freshData.target_interests.join(", ")
          : freshData.target_interests,
        main_competitors: freshData.main_competitors,
        reference_profiles: freshData.reference_profiles,
      };

      console.log("[Onboarding] Step 1 payload:", step1Payload);
      await submitOnboardingStep1(step1Payload);

      // Step 2: Branding
      const colors = freshData.colors || ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"];
      const step2Payload = {
        voice_tone: freshData.voice_tone,
        logo: freshData.logo,
        color_1: colors[0] || "#FF6B6B",
        color_2: colors[1] || "#4ECDC4",
        color_3: colors[2] || "#45B7D1",
        color_4: colors[3] || "#96CEB4",
        color_5: colors[4] || "#FFBE0B",
        visual_style_ids: freshData.visual_style_ids,
      };

      console.log("[Onboarding] Step 2 payload:", step2Payload);
      await submitOnboardingStep2(step2Payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      // NÃO limpar dados aqui - só limpar após checkout completo
      // O clearData() será chamado na página de sucesso do checkout
      // Mark final step as completed and clear tracking
      trackStepComplete(19);
      clearTracking();
      // Toast removido - não interromper fluxo do paywall
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao salvar dados",
        defaultDescription: "Não foi possível salvar o perfil. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  // Mutation para atualizar perfil (modo edição)
  const updateMutation = useMutation({
    mutationFn: async () => {
      // Step 1: Business info
      const step1Payload = getStep1Payload();
      await submitOnboardingStep1(step1Payload);

      // Step 2: Branding
      const step2Payload = getStep2Payload();
      await submitOnboardingStep2(step2Payload);
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      clearData();
      trackStepComplete(19);
      toast.success("Perfil atualizado com sucesso!");
      onComplete?.();
      window.location.reload(); // Forçar reload para atualizar estado de assinatura e redirecionar corretamente
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao atualizar perfil",
        defaultDescription: "Não foi possível atualizar o perfil. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  // Navegação entre steps
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, [setCurrentStep]);

  const handleNext = useCallback(() => {
    goToStep(data.current_step + 1);
  }, [data.current_step, goToStep]);

  const handleBack = useCallback(() => {
    if (data.current_step > 1) {
      goToStep(data.current_step - 1);
    }
  }, [data.current_step, goToStep]);

  // Handlers de autenticação
  const handleAuthSuccess = useCallback(async () => {
    // IMPORTANTE: Definir step ANTES de mudar authMode para evitar re-render incorreto
    setAuthMode(null);

    // Primeiro, tentar vincular dados temporários do backend ao usuário
    try {
      const linked = await linkDataToUser();
      if (linked) {
        console.log("[Onboarding] Dados temporários vinculados ao perfil");
      }
    } catch (error) {
      console.warn("[Onboarding] Erro ao vincular dados temporários:", error);
    }

    // Sincronizar dados do localStorage com o backend (fallback/atualização)
    try {
      await syncMutation.mutateAsync();
    } catch (error) {
      console.error("[Onboarding] Erro ao sincronizar:", error);
      toast.error("Erro ao salvar seus dados. Tente novamente.");
    }

    // Ir para paywall
    setCurrentStep(19);
  }, [syncMutation, setCurrentStep, linkDataToUser]);

  const handlePlanSelect = useCallback(async (planId: string) => {
    // Sincronizar dados do onboarding com o backend primeiro
    try {
      await syncMutation.mutateAsync();
    } catch (error) {
      console.error("[Onboarding] Erro ao sincronizar:", error);
      // Continua mesmo com erro - não bloquear o checkout
    }

    // Verificar se planos estão carregados
    if (!subscriptionPlans?.length) {
      toast.error("Planos não carregados. Aguarde e tente novamente.");
      return;
    }

    // Usar config centralizada para mapear interval
    const { PLAN_INTERVAL_MAP, STRIPE_URLS } = SUBSCRIPTION_CONFIG;
    const targetInterval = PLAN_INTERVAL_MAP[planId as keyof typeof PLAN_INTERVAL_MAP];

    if (!targetInterval) {
      console.error("[Onboarding] Plano inválido:", planId);
      toast.error("Plano inválido selecionado.");
      return;
    }

    // Encontrar o plano correspondente no backend pelo interval
    const backendPlan = subscriptionPlans.find(
      (plan) => plan.interval === targetInterval && plan.is_active
    );

    if (!backendPlan) {
      console.error("[Onboarding] Plano não encontrado:", { planId, targetInterval, availablePlans: subscriptionPlans });
      toast.error("Plano não disponível no momento. Tente novamente.");
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
    } catch (error) {
      console.error("[Onboarding] Erro ao criar checkout:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    }
  }, [subscriptionPlans, createCheckout, syncMutation]);

  // Handler para voltar no modo edição
  const handleEditBack = useCallback(() => {
    if (data.current_step <= 2) {
      // Se estiver no primeiro step útil, cancelar edição
      clearData();
      onCancel?.();
    } else {
      goToStep(data.current_step - 1);
    }
  }, [data.current_step, goToStep, clearData, onCancel]);

  // Não renderizar até carregar dados do localStorage
  if (!isLoaded) {
    return null;
  }

  // No modo edição, aguardar inicialização dos dados
  if (isEditMode && !isInitialized) {
    return null;
  }

  // Se estiver em modo de autenticação (apenas no modo criação)
  if (!isEditMode && authMode === "signup") {
    return (
      <SignupStep
        onSuccess={handleAuthSuccess}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  if (!isEditMode && authMode === "login") {
    return (
      <LoginStep
        onSuccess={handleAuthSuccess}
        onSignupClick={() => setAuthMode(null)}
        onBack={() => setAuthMode(null)}
      />
    );
  }


  // Se já autenticado e no paywall (apenas no modo criação)
  if (isAuthenticated && !hasActiveSubscription) {
    return (
      <PaywallStep
        onSelectPlan={handlePlanSelect}
        isLoading={createCheckout.isPending || isLoadingPlans}
      />
    );
  }

  // Renderizar step atual do onboarding
  const renderStep = () => {
    switch (data.current_step) {
      case 1:
        // No modo edição, pular welcome e ir direto para business name
        if (isEditMode) {
          goToStep(2);
          return null;
        }
        return <WelcomeStep onNext={handleNext} isAuthenticated={isAuthenticated} onLogin={() => setAuthMode("login")} />;

      case 2:
        return (
          <BusinessNameStep
            value={data.business_name}
            onChange={(value) => saveData({ business_name: value })}
            onNext={handleNext}
            onBack={isEditMode ? handleEditBack : handleBack}
          />
        );

      case 3:
        return (
          <NicheStep
            value={data.specialization}
            onChange={(value) => saveData({ specialization: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 4:
        return (
          <DescriptionStep
            value={data.business_description}
            onChange={(value) => saveData({ business_description: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 5:
        return (
          <PurposeStep
            value={data.business_purpose}
            onChange={(value) => saveData({ business_purpose: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 6:
        return (
          <PersonalityStep
            value={data.brand_personality}
            onChange={(value) => saveData({ brand_personality: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 7:
        return (
          <ProductsStep
            value={data.products_services}
            onChange={(value) => saveData({ products_services: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 8:
        return (
          <TargetAudienceStep
            value={data.target_audience}
            onChange={(value) => saveData({ target_audience: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 9:
        return (
          <InterestsStep
            value={data.target_interests}
            onChange={(value) => saveData({ target_interests: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 10:
        return (
          <LocationStep
            value={data.business_location}
            onChange={(value) => saveData({ business_location: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 11:
        return (
          <CompetitorsStep
            competitors={data.main_competitors}
            referenceProfiles={data.reference_profiles}
            onCompetitorsChange={(value) => saveData({ main_competitors: value })}
            onReferenceProfilesChange={(value) => saveData({ reference_profiles: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 12:
        return (
          <VoiceToneStep
            value={data.voice_tone}
            onChange={(value) => saveData({ voice_tone: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 13:
        return (
          <VisualStyleStep
            value={data.visual_style_ids}
            onChange={(value) => saveData({ visual_style_ids: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 14:
        return (
          <LogoStep
            value={data.logo}
            onChange={(value) => saveData({ logo: value })}
            suggestedColors={data.suggested_colors}
            onColorsExtracted={(colors) => saveData({ suggested_colors: colors })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 15:
        return (
          <ColorsStep
            value={data.colors}
            onChange={(value) => saveData({ colors: value })}
            suggestedColors={data.suggested_colors}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 16:
        return (
          <ProfileReadyStep
            data={data}
            onNext={() => {
              if (isAuthenticated) {
                // No modo edição, salvar diretamente
                updateMutation.mutate();
              } else {
                markAsCompleted();
                handleNext();
              }
            }}
            onBack={handleBack}
            isEditMode={isAuthenticated}
            isLoading={updateMutation.isPending}
          />
        );

      case 17:
        // No modo edição, não deve chegar aqui (salva no step 16)
        if (isAuthenticated) {
          updateMutation.mutate();
          return null;
        }
        return (
          <PreviewStep
            data={data}
            onNext={() => setAuthMode("signup")}
            onBack={handleBack}
          />
        );

      default:
        return <WelcomeStep isAuthenticated={isAuthenticated} onNext={() => goToStep(1)} />;
    }
  };

  return renderStep();
};
