import { profileApi } from "@/features/Auth/Profile/services";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/utils/errorHandling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProfileEdits = () => {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: profileApi.getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao atualizar perfil",
        defaultDescription:
          "Não foi possível atualizar o perfil. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const updateUserProfileMutation = useMutation({
    mutationFn: async (data: { first_name?: string; last_name?: string }) => {
      const response = await profileApi.updateProfile(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao atualizar perfil",
        defaultDescription:
          "Não foi possível atualizar o perfil. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (avatarData: string) => {
      const response = await api.post("/api/v1/creator-profile/user/avatar/", {
        avatar: avatarData,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      toast.success("Avatar atualizado com sucesso!");
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao fazer upload do avatar",
        defaultDescription:
          "Não foi possível fazer upload do avatar. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  return {
    profile,
    isLoadingProfile,
    profileError,
    updateProfile: updateProfileMutation.mutate,
    updateUserProfile: updateUserProfileMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingUserProfile: updateUserProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  };
};
