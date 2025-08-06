import { api } from "@/lib/api";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: creatorProfileApi.getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: creatorProfileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Erro ao atualizar perfil"
        );
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    },
  });

  const updateUserProfileMutation = useMutation({
    mutationFn: async (data: { first_name?: string; last_name?: string }) => {
      const response = await api.patch(
        "/api/v1/creator-profile/user/profile/",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Erro ao atualizar perfil"
        );
      } else {
        toast.error("Erro ao atualizar perfil");
      }
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
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Erro ao fazer upload do avatar"
        );
      } else {
        toast.error("Erro ao fazer upload do avatar");
      }
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
