import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface OnboardingStatus {
  onboarding_completed: boolean;
  onboarding_skipped: boolean;
  has_data: boolean;
  filled_fields_count: number;
  total_fields_count: number;
}

export const useOnboardingFlow = () => {
  const {
    data: onboardingStatus,
    isLoading,
    error,
    refetch,
  } = useQuery<OnboardingStatus>({
    queryKey: ["onboarding-status"],
    queryFn: async () => {
      const response = await api.get(
        "/api/v1/creator-profile/onboarding/status/"
      );
      return response.data;
    },
    retry: 1,
  });

  const needsOnboarding =
    !onboardingStatus?.onboarding_completed &&
    !onboardingStatus?.onboarding_skipped;

  return {
    onboardingStatus,
    isLoading,
    error,
    needsOnboarding,
    refetch,
  };
};
