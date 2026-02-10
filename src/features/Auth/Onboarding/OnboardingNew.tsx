import { useCallback, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOnboardingStorage } from "./hooks/useOnboardingStorage";
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
  ContactInfoStep,
} from "./components/new/steps";
import {
  submitOnboardingStep1,
  submitOnboardingStep2,
} from "./services";
import { handleApiError } from "@/lib/utils/errorHandling";
import {
  useSubscriptionPlans,
  useCreateCheckoutSession,
} from "@/features/Subscription/hooks/useSubscription";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Hooks para checkout do Stripe - só busca quando autenticado
  const { data: subscriptionPlans } = useSubscriptionPlans(isAuthenticated);
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

  // Inicializar com dados no modo edição
  useEffect(() => {
    if (isEditMode && initialData && isLoaded && !isInitialized) {
      initializeWithData(initialData);
      setIsInitialized(true);
    }
  }, [isEditMode, initialData, isLoaded, isInitialized, initializeWithData]);

  // Mutation para sincronizar dados com o backend
  const syncMutation = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      clearData();
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
    goToStep(data.current_step + 1);
  }, [data.current_step, goToStep]);

  const handleBack = useCallback(() => {
    if (data.current_step > 1) {
      goToStep(data.current_step - 1);
    }
  }, [data.current_step, goToStep]);

  // Handlers de autenticação
  const handleAuthSuccess = useCallback(async () => {
    setIsAuthenticated(true);
    setAuthMode(null);

    // Sincronizar dados do localStorage com o backend
    await syncMutation.mutateAsync();

    // Ir para o paywall
    goToStep(20); // Paywall step
  }, [syncMutation, goToStep]);

  const handlePlanSelect = useCallback(async (planId: string) => {
    // Mapear o ID do frontend para o interval do backend
    // planId é "monthly" ou "annual" do PaywallStep
    // Usar interval (mais estável que nome) para encontrar o plano
    const intervalMap: Record<string, string> = {
      monthly: "monthly",
      annual: "yearly",
    };

    const targetInterval = intervalMap[planId];

    // Encontrar o plano correspondente no backend pelo interval
    const backendPlan = subscriptionPlans?.find(
      (plan) => plan.interval === targetInterval && plan.is_active
    );

    if (!backendPlan) {
      console.error("[Onboarding] Plano não encontrado:", { planId, targetInterval, availablePlans: subscriptionPlans });
      toast.error("Plano não encontrado. Tente novamente.");
      return;
    }

    // URLs de retorno após checkout (usando origin para suportar qualquer ambiente)
    const baseUrl = window.location.origin;
    const successUrl = `${baseUrl}/?checkout=success`;
    const cancelUrl = `${baseUrl}/onboarding?checkout=cancelled`;

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
  }, [subscriptionPlans, createCheckout]);

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
        onSignupClick={() => setAuthMode("signup")}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  // Se já autenticado e no paywall (apenas no modo criação)
  if (!isEditMode && isAuthenticated && data.current_step >= 19) {
    return (
      <PaywallStep
        onSelectPlan={handlePlanSelect}
        isLoading={createCheckout.isPending}
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
          <ContactInfoStep
            phone={data.business_phone}
            instagram={data.business_instagram_handle}
            website={data.business_website}
            onPhoneChange={(value) => saveData({ business_phone: value })}
            onInstagramChange={(value) => saveData({ business_instagram_handle: value })}
            onWebsiteChange={(value) => saveData({ business_website: value })}
            onNext={handleNext}
            onBack={handleBack}
            stepNumber={3}
          />
        );

      case 4:
        return (
          <NicheStep
            value={data.specialization}
            onChange={(value) => saveData({ specialization: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 5:
        return (
          <DescriptionStep
            value={data.business_description}
            onChange={(value) => saveData({ business_description: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 6:
        return (
          <PurposeStep
            value={data.business_purpose}
            onChange={(value) => saveData({ business_purpose: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 7:
        return (
          <PersonalityStep
            value={data.brand_personality}
            onChange={(value) => saveData({ brand_personality: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 8:
        return (
          <ProductsStep
            value={data.products_services}
            onChange={(value) => saveData({ products_services: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 9:
        return (
          <TargetAudienceStep
            value={data.target_audience}
            onChange={(value) => saveData({ target_audience: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 10:
        return (
          <InterestsStep
            value={data.target_interests}
            onChange={(value) => saveData({ target_interests: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 11:
        return (
          <LocationStep
            value={data.business_location}
            onChange={(value) => saveData({ business_location: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 12:
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

      case 13:
        return (
          <VoiceToneStep
            value={data.voice_tone}
            onChange={(value) => saveData({ voice_tone: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 14:
        return (
          <VisualStyleStep
            value={data.visual_style_ids}
            onChange={(value) => saveData({ visual_style_ids: value })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 15:
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

      case 16:
        return (
          <ColorsStep
            value={data.colors}
            onChange={(value) => saveData({ colors: value })}
            suggestedColors={data.suggested_colors}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 17:
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

      case 18:
        // No modo edição, não deve chegar aqui (salva no step 17)
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

  return renderStep();
};
