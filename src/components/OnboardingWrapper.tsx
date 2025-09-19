import { Loading } from "@/components/ui/loading";
import { useOnboardingFlow } from "@/hooks/useOnboardingFlow";
import { OnboardingForm } from "./OnboardingForm";

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export const OnboardingWrapper = ({ children }: OnboardingWrapperProps) => {
  const { isLoading, needsOnboarding, refetch } = useOnboardingFlow();

  const handleOnboardingComplete = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (needsOnboarding) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  return <>{children}</>;
};
