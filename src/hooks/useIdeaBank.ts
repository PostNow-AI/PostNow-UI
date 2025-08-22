import { ideaBankService } from "@/lib/services/ideaBankService";
import { useQuery } from "@tanstack/react-query";
import { useCostEstimate } from "./useAIModels";
import { useUserCredits } from "./useCredits";

export const useIdeaBank = () => {
  const { data: userCredits } = useUserCredits();
  const estimateCost = useCostEstimate();

  const {
    data: campaignsWithIdeas = [],
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useQuery({
    queryKey: ["campaigns-with-ideas"],
    queryFn: ideaBankService.getCampaignsWithIdeas,
  });

  // Extract all ideas from campaigns for backward compatibility
  const allIdeas = campaignsWithIdeas.flatMap(
    (campaign) => campaign.ideas || []
  );

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["campaign-stats"],
    queryFn: ideaBankService.getCampaignStats,
  });

  return {
    campaigns: campaignsWithIdeas,
    ideas: allIdeas, // For backward compatibility
    stats,
    isLoading: campaignsLoading || statsLoading,
    error: campaignsError || statsError,
    refetchCampaigns,
    userCredits,
    estimateCost,
  };
};
