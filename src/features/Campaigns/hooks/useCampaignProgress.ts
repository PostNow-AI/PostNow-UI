// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { campaignService } from "../services";

interface ProgressData {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'not_started';
  current_step: number;
  total_steps: number;
  current_action: string;
  percentage: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
}

/**
 * Hook para polling de progresso de geração de campanha.
 * 
 * Faz polling a cada 2 segundos enquanto a campanha está sendo gerada,
 * e para automaticamente quando completa ou falha.
 * 
 * @param campaignId - ID da campanha
 * @param enabled - Se o polling está ativo (default: true)
 * @returns Query com dados de progresso
 */
export const useCampaignProgress = (campaignId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['campaign-progress', campaignId],
    queryFn: async (): Promise<ProgressData> => {
      const response = await campaignService.getProgress(campaignId);
      return response.data;
    },
    refetchInterval: (data) => {
      // Parar polling quando completar ou falhar
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 2000; // Poll a cada 2 segundos
    },
    enabled,
    retry: false,
    refetchOnWindowFocus: false, // Não refetch quando janela ganha foco
  });
};

