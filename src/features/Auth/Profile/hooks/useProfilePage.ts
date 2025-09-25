import { useOnboardingContext } from "@/contexts/OnboardingContext";
import { profileApi } from "@/features/Auth/Profile/services";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProfilePage = () => {
  const { user } = useAuth();
  const { setOpenOnboarding } = useOnboardingContext();
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

  const resetOnboardingForEditMutation = useMutation({
    mutationFn: async () => {
      await profileApi.resetOnboardingForEdit();
    },
    onSuccess: () => {
      setOpenOnboarding(true);
    },
    onError: () => {
      toast.error("Erro ao preparar onboarding para edição");
    },
  });

  return {
    // Data
    user,
    profile,
    isLoading,
    error,
    formatDate,
    resetOnboardingForEditMutation,
  };
};
