import { postService } from "@/lib/services/postService";
import { useQuery } from "@tanstack/react-query";
import { useCostEstimate } from "./useAIModels";
import { useUserCredits } from "./useCredits";

export const usePostBank = () => {
  const { data: userCredits } = useUserCredits();
  const estimateCost = useCostEstimate();

  const {
    data: postsWithIdeas = [],
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["posts-with-ideas"],
    queryFn: postService.getPostsWithIdeas,
  });

  // Extract all ideas from posts for backward compatibility
  const allIdeas = postsWithIdeas.flatMap((post) => post.ideas || []);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["post-stats"],
    queryFn: postService.getPostStats,
  });

  const {
    data: options,
    isLoading: optionsLoading,
    error: optionsError,
  } = useQuery({
    queryKey: ["post-options"],
    queryFn: postService.getPostOptions,
  });

  return {
    posts: postsWithIdeas,
    ideas: allIdeas, // For backward compatibility with idea components
    stats,
    options,
    isLoading: postsLoading || statsLoading || optionsLoading,
    error: postsError || statsError || optionsError,
    refetchPosts,
    userCredits,
    estimateCost,
  };
};
