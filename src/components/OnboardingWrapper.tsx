import { LoadingPage } from "@/components/ui";
import { useAuth } from "@/hooks";
import { useOnboardingFlow } from "@/hooks/useOnboardingFlow";
import { Navigate } from "react-router-dom";
import { OnboardingForm } from "./OnboardingForm";
import { OptionalOnboardingForm } from "./OptionalOnboardingForm";

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export const OnboardingWrapper = ({ children }: OnboardingWrapperProps) => {
  const { isAuthenticated } = useAuth();
  const {
    isLoading,
    error,
    currentStage,
    completeRequired,
    completeOptional,
    skipOptional,
    refetch,
  } = useOnboardingFlow();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Handle loading state
  if (isLoading) {
    return <LoadingPage text="Verificando perfil..." />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            Erro ao verificar perfil
          </h2>
          <p className="text-muted-foreground">
            Não foi possível verificar o status do seu perfil.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Show required onboarding steps
  if (currentStage === "required") {
    return <OnboardingForm onComplete={completeRequired} />;
  }

  // Show optional onboarding steps
  if (currentStage === "optional") {
    return (
      <OptionalOnboardingForm
        onComplete={completeOptional}
        onSkip={skipOptional}
      />
    );
  }

  // Show main app if onboarding is complete
  return <>{children}</>;
};
