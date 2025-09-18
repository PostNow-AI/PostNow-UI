import { postService, type Post } from "@/lib/services/postService";
import { useQuery } from "@tanstack/react-query";

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts-with-ideas"],
    queryFn: postService.getPostsWithIdeas,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
