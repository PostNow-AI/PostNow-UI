/**
 * Hook para listar campanhas do usuário.
 * Seguindo padrão de IdeaBank/hooks/usePostList.ts
 */

import { useQuery } from "@tanstack/react-query";
import { campaignService } from "../services";

export const useCampaigns = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["campaigns"],
    queryFn: campaignService.getCampaigns,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    campaigns: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

