import { useQuery } from "@tanstack/react-query";
import { ideaBankService } from "../services";
import type { PostsWithIdeasResponse } from "../types";

export const usePostsWithIdeas = () => {
  return useQuery<PostsWithIdeasResponse>({
    queryKey: ["posts-with-ideas"],
    queryFn: async () => {
      const data = await ideaBankService.getPostsWithIdeas();
      return data;
    },
  });
};
