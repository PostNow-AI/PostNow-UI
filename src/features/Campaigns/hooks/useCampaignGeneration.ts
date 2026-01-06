/**
 * Hook para gerar conteúdo de campanha (todos os posts).
 * Agora usa geração assíncrona com Celery.
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
      // Agora recebemos task_id em vez de resultado imediato
      toast.success("Geração iniciada! Acompanhe o progresso abaixo.");
      
      // Não invalida mais o cache, pois geração é assíncrona
      // O polling vai atualizar quando completar
      
      // Log para debug
      console.log("✅ Geração assíncrona iniciada:", data);
    },
    
    onError: (error: unknown) => {
      console.error("❌ Erro ao iniciar geração:", error);
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao iniciar geração",
        defaultDescription: "Não foi possível iniciar a geração. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });
};

