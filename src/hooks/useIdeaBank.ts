import { ideaBankService } from "@/lib/services/ideaBankService";
import { postService } from "@/lib/services/postService";
import { useQuery } from "@tanstack/react-query";
import { useCostEstimate } from "./useAIModels";
import { useUserCredits } from "./useCredits";

export const useIdeaBank = () => {
  const { data: userCredits } = useUserCredits();
  const estimateCost = useCostEstimate();

  // Fetch legacy campaigns
  const {
    data: campaignsWithIdeas = [],
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useQuery({
    queryKey: ["campaigns-with-ideas"],
    queryFn: ideaBankService.getCampaignsWithIdeas,
  });

  // Fetch new posts
  const {
    data: postsWithIdeas = [],
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["posts-with-ideas"],
    queryFn: postService.getPostsWithIdeas,
  });

  // Extract all ideas from campaigns and posts for backward compatibility
  const campaignIdeas = campaignsWithIdeas.flatMap(
    (campaign) => campaign.ideas || []
  );
  const postIdeas = postsWithIdeas.flatMap((post) => post.ideas || []);
  const allIdeas = [...campaignIdeas, ...postIdeas];

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["campaign-stats"],
    queryFn: ideaBankService.getCampaignStats,
  });

  const {
    data: postStats,
    isLoading: postStatsLoading,
    error: postStatsError,
  } = useQuery({
    queryKey: ["post-stats"],
    queryFn: postService.getPostStats,
  });

  return {
    // Legacy campaign data
    campaigns: campaignsWithIdeas,
    // New post data
    posts: postsWithIdeas,
    ideas: allIdeas, // Combined ideas for backward compatibility
    stats: stats || postStats, // Use campaign stats if available, otherwise post stats
    isLoading:
      campaignsLoading || postsLoading || statsLoading || postStatsLoading,
    error: campaignsError || postsError || statsError || postStatsError,
    refetchCampaigns,
    refetchPosts,
    userCredits,
    estimateCost,
  };
};
