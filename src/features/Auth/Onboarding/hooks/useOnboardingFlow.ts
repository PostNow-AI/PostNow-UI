import { useQuery } from "@tanstack/react-query";
import { fetchOnboardingStatus } from "../services";
import type { OnboardingStatus } from "../types";

export const useOnboardingFlow = () => {
  const {
    data: onboardingStatus,
    isLoading,
    error,
  } = useQuery<OnboardingStatus>({
    queryKey: ["onboarding-status"],
    queryFn: fetchOnboardingStatus,
    retry: 1,
  });

  // Onboarding is mandatory - only check if completed
  const needsOnboarding = !onboardingStatus?.onboarding_completed;

  console.log("Onboarding Status:", onboardingStatus);

  return {
    onboardingStatus,
    isLoading,
    error,
    needsOnboarding,
  };
};
