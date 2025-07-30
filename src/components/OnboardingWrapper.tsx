import { LoadingPage } from "@/components/ui";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { useQuery } from "@tanstack/react-query";
import { OnboardingForm } from "./OnboardingForm";

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export const OnboardingWrapper = ({ children }: OnboardingWrapperProps) => {
  // Check profile completion status
  const {
    data: status,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile-completion-status"],
    queryFn: creatorProfileApi.getCompletionStatus,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache this query
  });

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

  // Show onboarding if not completed
  if (!status?.onboarding_completed) {
    return (
      <OnboardingForm
        onComplete={() => {
          // Refetch status after completion
          refetch();
        }}
      />
    );
  }

  // Show main app if onboarding is completed
  return <>{children}</>;
};
