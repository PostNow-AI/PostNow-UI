import { creatorProfileApi } from "@/lib/creator-profile-api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export type OnboardingStage = "required" | "optional" | "complete";

const OPTIONAL_ONBOARDING_KEY = "optional_onboarding_completed";

export const useOnboardingFlow = () => {
  const [optionalOnboardingStatus, setOptionalOnboardingStatus] = useState<
    "pending" | "completed" | "skipped"
  >(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem(OPTIONAL_ONBOARDING_KEY) as
          | "completed"
          | "skipped") || "pending"
      );
    }
    return "pending";
  });

  // Check profile completion status
  const {
    data: status,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile-completion-status"],
    queryFn: creatorProfileApi.getCompletionStatus,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Clear optional onboarding flag only if onboarding was reset (not just incomplete)
  useEffect(() => {
    // Only reset if user hasn't completed the required onboarding AND we have cached optional status
    // This prevents clearing when page loads before status is fetched
    if (
      status !== undefined && // Status has been loaded
      !status?.onboarding_completed && // Required onboarding is not complete
      optionalOnboardingStatus !== "pending" // We have a cached optional status
    ) {
      setOptionalOnboardingStatus("pending");
      localStorage.removeItem(OPTIONAL_ONBOARDING_KEY);
    }
  }, [status?.onboarding_completed, optionalOnboardingStatus]);

  const currentStage = useMemo((): OnboardingStage => {
    if (!status?.onboarding_completed) {
      return "required";
    }

    // If optional onboarding was completed or skipped, go to complete
    if (
      optionalOnboardingStatus === "completed" ||
      optionalOnboardingStatus === "skipped"
    ) {
      return "complete";
    }

    // User completed required but optional is still pending
    return "optional";
  }, [status?.onboarding_completed, optionalOnboardingStatus]);

  const completeRequired = () => {
    refetch();
  };

  const completeOptional = () => {
    setOptionalOnboardingStatus("completed");
    localStorage.setItem(OPTIONAL_ONBOARDING_KEY, "completed");
    refetch();
  };

  const skipOptional = () => {
    setOptionalOnboardingStatus("skipped");
    localStorage.setItem(OPTIONAL_ONBOARDING_KEY, "skipped");
  };

  const resetOptionalOnboarding = () => {
    setOptionalOnboardingStatus("pending");
    localStorage.removeItem(OPTIONAL_ONBOARDING_KEY);
  };

  return {
    status,
    isLoading,
    error,
    currentStage,
    completeRequired,
    completeOptional,
    skipOptional,
    resetOptionalOnboarding,
    refetch,
  };
};
