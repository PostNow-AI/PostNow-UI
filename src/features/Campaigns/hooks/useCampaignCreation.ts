// @ts-nocheck
/**
 * Hook para criar campanha.
 * Seguindo padrão de IdeaBank/hooks/useCreatePostWithIdea.ts
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { campaignService } from "../services";
import type { CampaignCreationData } from "../types";
import { handleApiError } from "@/lib/utils/errorHandling";

export const useCampaignCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CampaignCreationData) =>
      campaignService.createCampaign(data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campanha criada com sucesso!");
    },
    
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao criar campanha",
        defaultDescription: "Não foi possível criar a campanha. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });
};

