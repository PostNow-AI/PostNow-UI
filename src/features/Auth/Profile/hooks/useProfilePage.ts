import { useOnboardingContext } from "@/contexts/OnboardingContext";
import { profileApi } from "@/features/Auth/Profile/services";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export const useProfilePage = () => {
  const { user } = useAuth();
  const { setOpenOnboarding, setEditMode, setEditData } = useOnboardingContext();
  // Fetch creator profile
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: profileApi.getProfile,
    retry: false,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const openEditOnboarding = useCallback(() => {
    if (profile) {
      setEditData(profile);
      setEditMode(true);
      setOpenOnboarding(true);
    }
  }, [profile, setEditData, setEditMode, setOpenOnboarding]);

  return {
    // Data
    user,
    profile,
    isLoading,
    error,
    formatDate,
    openEditOnboarding,
  };
};
