import { useCallback, useState, useEffect, useRef, Suspense, startTransition } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { useOnboardingStorage } from "./hooks/useOnboardingStorage";
import { useOnboardingTracking } from "./hooks/useOnboardingTracking";
import { useCelebration } from "./hooks/useCelebration";
import { audienceJsonToString } from "./utils/audienceUtils";
import type { OnboardingFormData } from "./constants/onboardingSchema";
import {
  LazyWelcomeStep as WelcomeStep,
  LazyBusinessNameStep as BusinessNameStep,
  LazyNicheStep as NicheStep,
  LazyOfferStep as OfferStep,
  LazyPersonalityStep as PersonalityStep,
  LazyTargetAudienceStep as TargetAudienceStep,
  LazyInterestsStep as InterestsStep,
  LazyLocationStep as LocationStep,
  LazyVoiceToneStep as VoiceToneStep,
  LazyVisualStyleStep as VisualStyleStep,
  LazyColorsStep as ColorsStep,
  LazyLogoStep as LogoStep,
  LazyProfileReadyStep as ProfileReadyStep,
  LazyPreviewStep as PreviewStep,
  LazySignupStep as SignupStep,
  LazyLoginStep as LoginStep,
  LazyPaywallStep as PaywallStep,
} from "./components/new/steps/index.lazy";
import { StepSkeleton } from "./components/new/StepSkeleton";
import { PhaseTransition } from "./components/new/PhaseTransition";
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
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "signup" | "login" | null;
type PhaseType = "negocio" | "publico" | "marca";

// Mapeamento de steps finais de cada fase para tipo de fase
const PHASE_END_STEPS: Record<number, PhaseType> = {
  4: "negocio",   // Step 4 é o último do Negócio
  8: "publico",   // Step 8 é o último do Público
  12: "marca",    // Step 12 é o último da Marca
};

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
  const [searchParams, setSearchParams] = useSearchParams();
  const isEditMode = mode === "edit";

  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const initialAuthCheckDoneRef = useRef(false);

  // Estados para transição de fase
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<PhaseType | null>(null);

  // Check if user is already logged in from previous session
  const { isAuthenticated: isLoggedIn } = useAuth();
  const { data: userSubscription } = useUserSubscription(isLoggedIn);
  const hasActiveSubscription = userSubscription?.status === "active" || userSubscription?.status === "trialing";

  // Hooks para checkout do Stripe - só busca quando autenticado
  const { data: subscriptionPlans, isLoading: isLoadingPlans } = useSubscriptionPlans(isAuthenticated || isLoggedIn);
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
  } = useOnboardingStorage();

  // Tracking hook for funnel analytics
  const { trackStep, trackStepComplete, clearTracking } = useOnboardingTracking();
  const lastTrackedStepRef = useRef<number>(0);

  // Celebration hook for gamification
  const { celebrateSubtle, celebrateMedium, celebrateFull } = useCelebration();

  // Handle reset parameter - allows starting fresh with ?reset=true
  // Uses sessionStorage to prevent accidental multiple resets in the same session
  useEffect(() => {
    const resetParam = searchParams.get("reset");
    const resetKey = "onboarding_reset_done";
    const alreadyReset = sessionStorage.getItem(resetKey);

    if (resetParam === "true" && isLoaded && !isResetting && !alreadyReset) {
      setIsResetting(true);
      clearData();
      clearTracking();
      setIsAuthenticated(false);
      setAuthMode(null);
      initialAuthCheckDoneRef.current = false;

      // Mark reset as done in this session
      sessionStorage.setItem(resetKey, "true");

      // Remove reset param from URL
      searchParams.delete("reset");
      setSearchParams(searchParams, { replace: true });

      setTimeout(() => {
        setIsResetting(false);
      }, 100);
    } else if (resetParam === "true") {
      // Just remove the param if already reset in this session
      searchParams.delete("reset");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, isLoaded, isResetting, clearData, clearTracking]);

  // Steps that trigger celebrations (only at the end now - phases use subtle animation instead)
  const CELEBRATION_STEPS = {
    13: "full",    // Profile Ready - celebração completa!
  } as const;

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
  // BUT only if onboarding data exists (user completed the flow BEFORE)
  // This check runs ONCE on initial load only - not when data changes during onboarding
  useEffect(() => {
    // Skip if reset is in progress or requested via URL
    if (isResetting || searchParams.get("reset") === "true") {
      return;
    }

    // Only run this check once on initial load
    if (initialAuthCheckDoneRef.current) {
      return;
    }

    if (!isEditMode && isLoaded && isLoggedIn && !hasActiveSubscription && authMode !== "login") {
      initialAuthCheckDoneRef.current = true;

      // Verificar se os dados do onboarding foram preenchidos ANTES (from localStorage)
      const hasOnboardingData = data.business_name && data.specialization && data.business_description;

      if (hasOnboardingData) {
        setIsAuthenticated(true);
        // Jump directly to paywall step
        if (data.current_step < 16) {
          setCurrentStep(16);
        }
      }
      // Se não tem dados do onboarding, deixa o usuário completar o fluxo
    } else if (isLoaded) {
      // Mark as done even if conditions weren't met, to prevent re-checking
      initialAuthCheckDoneRef.current = true;
    }
  }, [isEditMode, isLoaded, isLoggedIn, hasActiveSubscription, authMode, setCurrentStep, isResetting, searchParams, data.business_name, data.specialization, data.business_description, data.current_step]);

  // Track step visits for funnel analytics (only in create mode)
  useEffect(() => {
    if (!isEditMode && isLoaded && data.current_step !== lastTrackedStepRef.current) {
      // Track visit to the current step
      trackStep(data.current_step, false);

      // If we moved forward, mark the previous step as completed and celebrate
      if (lastTrackedStepRef.current > 0 && data.current_step > lastTrackedStepRef.current) {
        trackStepComplete(lastTrackedStepRef.current);

        // Trigger celebration if completing a milestone step
        const completedStep = lastTrackedStepRef.current;
        const celebrationType = CELEBRATION_STEPS[completedStep as keyof typeof CELEBRATION_STEPS];

        if (celebrationType) {
          // Small delay to let the transition happen first
          setTimeout(() => {
            if (celebrationType === "subtle") {
              celebrateSubtle();
            } else if (celebrationType === "medium") {
              celebrateMedium();
            } else if (celebrationType === "full") {
              celebrateFull();
            }
          }, 300);
        }
      }

      lastTrackedStepRef.current = data.current_step;
    }
  }, [data.current_step, isLoaded, isEditMode, trackStep, trackStepComplete, celebrateSubtle, celebrateMedium, celebrateFull]);

  // Mutation para sincronizar dados com o backend
  const syncMutation = useMutation({
    mutationFn: async () => {
      // Ler dados FRESCOS do localStorage para evitar stale closure
      const STORAGE_KEY = "postnow_onboarding_data";
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        throw new Error("Dados do onboarding não encontrados");
      }

      let freshData;
      try {
        freshData = JSON.parse(stored);
        // Validação básica dos campos obrigatórios
        if (!freshData.business_name || !freshData.specialization) {
          throw new Error("Dados incompletos");
        }
      } catch (parseError) {
        throw new Error("Dados do onboarding corrompidos. Por favor, reinicie o processo.");
      }

      // Step 1: Business info
      const step1Payload = {
        business_name: freshData.business_name,
        business_phone: freshData.business_phone || "",
        business_website: freshData.business_website,
        business_instagram_handle: freshData.business_instagram_handle,
        specialization: freshData.specialization,
        business_description: freshData.business_description,
        business_purpose: freshData.business_purpose || "",
        brand_personality: Array.isArray(freshData.brand_personality)
          ? freshData.brand_personality.join(", ")
          : freshData.brand_personality,
        products_services: freshData.products_services || "",
        business_location: freshData.business_location,
        target_audience: audienceJsonToString(freshData.target_audience),
        target_interests: Array.isArray(freshData.target_interests)
          ? freshData.target_interests.join(", ")
          : freshData.target_interests,
        main_competitors: freshData.main_competitors,
        reference_profiles: freshData.reference_profiles,
      };

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

      await submitOnboardingStep2(step2Payload);
    },
    onSuccess: () => {
      // NÃO invalidar queries aqui - o usuário será redirecionado para Stripe
      // e isso pode causar um flash da tela principal durante a transição
      // As queries serão invalidadas quando o usuário voltar do Stripe

      // Mark final step as completed and clear tracking
      trackStepComplete(16);
      clearTracking();
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
      toast.success("Perfil atualizado com sucesso!");
      onComplete?.();
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
    // Verificar se está no final de uma fase (só no modo criação)
    const phaseType = PHASE_END_STEPS[data.current_step];
    if (!isEditMode && phaseType) {
      setCurrentPhase(phaseType);
      setShowPhaseTransition(true);
    } else {
      goToStep(data.current_step + 1);
    }
  }, [data.current_step, goToStep, isEditMode]);

  // Handler para quando a transição de fase terminar
  const handlePhaseTransitionComplete = useCallback(() => {
    setShowPhaseTransition(false);
    setCurrentPhase(null);
    goToStep(data.current_step + 1);
  }, [data.current_step, goToStep]);

  const handleBack = useCallback(() => {
    if (data.current_step > 1) {
      goToStep(data.current_step - 1);
    }
  }, [data.current_step, goToStep]);

  // Handlers de autenticação
  const handleAuthSuccess = useCallback(() => {
    // Batch all state updates to avoid multiple re-renders
    startTransition(() => {
      setCurrentStep(16); // Ir para paywall primeiro
      setIsAuthenticated(true);
      setAuthMode(null);
    });
  }, [setCurrentStep]);

  const handlePlanSelect = useCallback(async (planId: string) => {
    // Sincronizar dados do onboarding com o backend primeiro
    try {
      await syncMutation.mutateAsync();
    } catch (error) {
      // CRÍTICO: Não continuar para checkout se sync falhar
      // Dados do usuário seriam perdidos
      toast.error("Erro ao salvar seu perfil. Tente novamente.");
      return;
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

  // Não renderizar até carregar dados do localStorage ou enquanto reseta
  if (!isLoaded || isResetting) {
    return null;
  }

  // No modo edição, aguardar inicialização dos dados
  if (isEditMode && !isInitialized) {
    return null;
  }

  // Se estiver em modo de autenticação (apenas no modo criação)
  if (!isEditMode && authMode === "signup") {
    return (
      <Suspense fallback={<StepSkeleton showProgress={false} />}>
        <SignupStep
          onSuccess={handleAuthSuccess}
          onBack={() => setAuthMode(null)}
        />
      </Suspense>
    );
  }

  if (!isEditMode && authMode === "login") {
    return (
      <Suspense fallback={<StepSkeleton showProgress={false} />}>
        <LoginStep
          onSuccess={handleAuthSuccess}
          onSignupClick={() => setAuthMode("signup")}
          onBack={() => setAuthMode(null)}
        />
      </Suspense>
    );
  }

  // Se já autenticado e no paywall (apenas no modo criação)
  if (!isEditMode && isAuthenticated && data.current_step >= 15) {
    return (
      <Suspense fallback={<StepSkeleton showProgress={false} />}>
        <PaywallStep
          onSelectPlan={handlePlanSelect}
          isLoading={createCheckout.isPending || isLoadingPlans}
        />
      </Suspense>
    );
  }

  // Se estiver mostrando transição de fase
  if (showPhaseTransition && currentPhase) {
    return (
      <AnimatePresence mode="wait">
        <PhaseTransition
          key={currentPhase}
          phase={currentPhase}
          data={data}
          onComplete={handlePhaseTransitionComplete}
          autoAdvanceMs={3000}
        />
      </AnimatePresence>
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
        return <WelcomeStep onNext={handleNext} onLogin={() => setAuthMode("login")} />;

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
          <OfferStep
            value={data.business_description}
            onChange={(value) => saveData({ business_description: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 5:
        return (
          <PersonalityStep
            value={data.brand_personality}
            onChange={(value) => saveData({ brand_personality: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 6:
        return (
          <TargetAudienceStep
            value={data.target_audience}
            onChange={(value) => saveData({ target_audience: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 7:
        return (
          <InterestsStep
            value={data.target_interests}
            onChange={(value) => saveData({ target_interests: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 8:
        return (
          <LocationStep
            value={data.business_location}
            onChange={(value) => saveData({ business_location: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 9:
        return (
          <VoiceToneStep
            value={data.voice_tone}
            onChange={(value) => saveData({ voice_tone: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 10:
        return (
          <VisualStyleStep
            value={data.visual_style_ids}
            onChange={(value) => saveData({ visual_style_ids: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 11:
        return (
          <LogoStep
            value={data.logo}
            onChange={(value) => saveData({ logo: value })}
            suggestedColors={data.suggested_colors}
            onColorsExtracted={(colors) => {
              if (colors.length === 0) {
                // Logo removido - resetar para paleta padrão
                saveData({
                  suggested_colors: [],
                  colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"]
                });
              } else {
                saveData({ suggested_colors: colors, colors: colors });
              }
            }}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 12:
        return (
          <ColorsStep
            value={data.colors}
            onChange={(value) => saveData({ colors: value })}
            suggestedColors={data.suggested_colors}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 13:
        return (
          <ProfileReadyStep
            data={data}
            onNext={() => {
              if (isEditMode) {
                // No modo edição, salvar diretamente
                updateMutation.mutate();
              } else {
                markAsCompleted();
                handleNext();
              }
            }}
            onBack={handleBack}
            isEditMode={isEditMode}
            isLoading={updateMutation.isPending}
          />
        );

      case 14:
        // No modo edição, não deve chegar aqui (salva no step 13)
        if (isEditMode) {
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
        return <WelcomeStep onNext={() => goToStep(1)} />;
    }
  };

  return (
    <Suspense fallback={<StepSkeleton />}>
      {renderStep()}
    </Suspense>
  );
};
