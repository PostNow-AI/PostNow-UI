import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOnboardingStorage } from "./hooks/useOnboardingStorage";
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
  generateSingleClientContext,
} from "./services";
import { handleApiError } from "@/lib/utils/errorHandling";

type AuthMode = "signup" | "login" | null;

export const OnboardingNew = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data,
    saveData,
    setCurrentStep,
    markAsCompleted,
    clearData,
    getStep1Payload,
    getStep2Payload,
    isLoaded,
  } = useOnboardingStorage();

  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mutation para sincronizar dados com o backend
  const syncMutation = useMutation({
    mutationFn: async () => {
      // Step 1: Business info
      const step1Payload = getStep1Payload();
      await submitOnboardingStep1(step1Payload);

      // Step 2: Branding
      const step2Payload = getStep2Payload();
      await submitOnboardingStep2(step2Payload);

      // Gerar contexto do cliente
      await generateSingleClientContext();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      clearData();
      toast.success("Perfil configurado com sucesso!");
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao salvar dados",
        defaultDescription: "Não foi possível salvar o perfil. Tente novamente.",
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
    // Aqui integraria com Stripe para criar subscription com trial
    console.log("Plano selecionado:", planId);

    // Por enquanto, redirecionar para a página de subscription existente
    navigate(`/subscription?plan=${planId}&trial=10`);
  }, [navigate]);

  // Não renderizar até carregar dados do localStorage
  if (!isLoaded) {
    return null;
  }

  // Se estiver em modo de autenticação
  if (authMode === "signup") {
    return (
      <SignupStep
        onSuccess={handleAuthSuccess}
        onLoginClick={() => setAuthMode("login")}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  if (authMode === "login") {
    return (
      <LoginStep
        onSuccess={handleAuthSuccess}
        onSignupClick={() => setAuthMode("signup")}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  // Se já autenticado e no paywall
  if (isAuthenticated && data.current_step >= 19) {
    return (
      <PaywallStep
        onSelectPlan={handlePlanSelect}
      />
    );
  }

  // Renderizar step atual do onboarding
  const renderStep = () => {
    switch (data.current_step) {
      case 1:
        return <WelcomeStep onNext={handleNext} onLogin={() => setAuthMode("login")} />;

      case 2:
        return (
          <BusinessNameStep
            value={data.business_name}
            onChange={(value) => saveData({ business_name: value })}
            onNext={handleNext}
            onBack={handleBack}
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
              markAsCompleted();
              handleNext();
            }}
            onBack={handleBack}
          />
        );

      case 18:
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
