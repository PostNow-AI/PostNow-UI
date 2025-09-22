import { OnboardingForm } from "@/components";
import { Loading } from "@/components/ui/loading";
import { useOnboardingFlow } from "@/features/Auth/Onboarding/hooks/useOnboardingFlow";

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export const Onboarding = ({ children }: OnboardingWrapperProps) => {
  const { isLoading, needsOnboarding } = useOnboardingFlow();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (needsOnboarding) {
    return <OnboardingForm />;
  }

  return <>{children}</>;
};
