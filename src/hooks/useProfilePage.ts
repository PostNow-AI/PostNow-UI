import { useOnboardingContext } from "@/contexts/OnboardingContext";
import { useAuth } from "@/hooks/useAuth";
import { creatorProfileApi } from "@/lib/creator-profile-api";
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
    queryFn: creatorProfileApi.getProfile,
    retry: false,
  });

  const getUserName = () => {
    if (!user) return "Usuário";
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.email ||
      "Usuário"
    );
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return (
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const resetOnboardingForEditMutation = useMutation({
    mutationFn: async () => {
      await creatorProfileApi.resetOnboardingForEdit();
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
    // Computed values
    userName: getUserName(),
    userInitials: getUserInitials(),

    // Handlers
    formatDate,
    resetOnboardingForEditMutation,
  };
};
