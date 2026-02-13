// @ts-nocheck
/**
 * Hook para buscar sugestão de estrutura com Thompson Sampling.
 * Segue React Rules: TanStack Query para data fetching.
 */

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useStructureSuggestion = (campaignType: string = "branding") => {
  return useQuery({
    queryKey: ["structure-suggestion", campaignType],
    queryFn: async () => {
      const response = await api.get(`/api/v1/campaigns/suggest-structure/?campaign_type=${campaignType}`);
      return response.data.data;
    },
    staleTime: Infinity, // Sugestão é única por sessão
    retry: 1,
  });
};

