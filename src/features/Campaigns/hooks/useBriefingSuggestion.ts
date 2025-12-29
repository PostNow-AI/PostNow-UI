/**
 * Hook para buscar sugestão de objetivo com IA Contextual Bandits.
 * Segue React Rules: TanStack Query para data fetching.
 */

import { useQuery } from "@tanstack/react-query";
import { campaignService } from "../services";

export const useBriefingSuggestion = () => {
  return useQuery({
    queryKey: ["briefing-suggestion"],
    queryFn: campaignService.getBriefingSuggestion,
    staleTime: Infinity, // Sugestão é única, não refetch
    retry: 1, // Tentar 1x se falhar
  });
};

