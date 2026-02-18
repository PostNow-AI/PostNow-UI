import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitOnboardingStep1, submitOnboardingStep2 } from "../services";
import { audienceJsonToString } from "../utils/audienceUtils";
import { handleApiError } from "@/lib/utils/errorHandling";

const STORAGE_KEY = "postnow_onboarding_data";

interface UseOnboardingSyncProps {
  onSyncSuccess?: () => void;
  onUpdateSuccess?: () => void;
  getStep1Payload: () => Record<string, unknown>;
  getStep2Payload: () => Record<string, unknown>;
  clearData: () => void;
}

export const useOnboardingSync = ({
  onSyncSuccess,
  onUpdateSuccess,
  getStep1Payload,
  getStep2Payload,
  clearData,
}: UseOnboardingSyncProps) => {
  const queryClient = useQueryClient();

  // Mutation para sincronizar dados com o backend (novo usuário)
  const syncMutation = useMutation({
    mutationFn: async () => {
      // Ler dados FRESCOS do localStorage para evitar stale closure
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        throw new Error("Dados do onboarding não encontrados");
      }

      let freshData;
      try {
        freshData = JSON.parse(stored);
        // Validação básica dos campos obrigatórios
        if (!freshData.business_name || !freshData.specialization) {
          throw new Error("Dados incompletos");
        }
      } catch (parseError) {
        throw new Error("Dados do onboarding corrompidos. Por favor, reinicie o processo.");
      }

      // Step 1: Business info
      const step1Payload = {
        business_name: freshData.business_name,
        business_phone: freshData.business_phone || "",
        business_website: freshData.business_website,
        business_instagram_handle: freshData.business_instagram_handle,
        specialization: freshData.specialization,
        business_description: freshData.business_description,
        business_purpose: freshData.business_purpose || "",
        brand_personality: Array.isArray(freshData.brand_personality)
          ? freshData.brand_personality.join(", ")
          : freshData.brand_personality,
        products_services: freshData.products_services || "",
        business_location: freshData.business_location,
        target_audience: audienceJsonToString(freshData.target_audience),
        target_interests: Array.isArray(freshData.target_interests)
          ? freshData.target_interests.join(", ")
          : freshData.target_interests,
        main_competitors: freshData.main_competitors,
        reference_profiles: freshData.reference_profiles,
      };

      await submitOnboardingStep1(step1Payload);

      // Step 2: Branding
      const colors = freshData.colors || ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"];
      const step2Payload = {
        voice_tone: freshData.voice_tone,
        logo: freshData.logo,
        color_1: colors[0] || "#FF6B6B",
        color_2: colors[1] || "#4ECDC4",
        color_3: colors[2] || "#45B7D1",
        color_4: colors[3] || "#96CEB4",
        color_5: colors[4] || "#FFBE0B",
        visual_style_ids: freshData.visual_style_ids,
      };

      await submitOnboardingStep2(step2Payload);
    },
    onSuccess: () => {
      onSyncSuccess?.();
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao salvar dados",
        defaultDescription: "Não foi possível salvar o perfil. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  // Mutation para atualizar perfil (modo edição)
  const updateMutation = useMutation({
    mutationFn: async () => {
      // Step 1: Business info
      const step1Payload = getStep1Payload();
      await submitOnboardingStep1(step1Payload);

      // Step 2: Branding
      const step2Payload = getStep2Payload();
      await submitOnboardingStep2(step2Payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      clearData();
      toast.success("Perfil atualizado com sucesso!");
      onUpdateSuccess?.();
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao atualizar perfil",
        defaultDescription: "Não foi possível atualizar o perfil. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  return {
    syncMutation,
    updateMutation,
  };
};
