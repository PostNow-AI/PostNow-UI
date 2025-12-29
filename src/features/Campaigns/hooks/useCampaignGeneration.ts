/**
 * Hook para gerar conteúdo de campanha (todos os posts).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { campaignService } from "../services";
import type { CampaignGenerationRequest } from "../types";
import { handleApiError } from "@/lib/utils/errorHandling";

export const useCampaignGeneration = (campaignId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CampaignGenerationRequest) =>
      campaignService.generateContent(campaignId, params),
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      
      toast.success(
        `Campanha gerada! ${data.total_generated} posts prontos para revisão.`
      );
    },
    
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao gerar campanha",
        defaultDescription: "Não foi possível gerar o conteúdo. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });
};

