import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

interface PostIdea {
  id: number;
  content: string;
  content_preview: string;
  image_url?: string;
  status: string;
  status_display: string;
  ai_provider: string;
  ai_model: string;
  post_name: string;
  post_type: string;
  created_at: string;
  updated_at: string;
}

interface UsePostIdeasOptions {
  enabled?: boolean;
}

export const usePostIdeas = (postId: number, options?: UsePostIdeasOptions) => {
  return useQuery<PostIdea[]>({
    queryKey: ["post-ideas", postId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/ideabank/posts/${postId}/ideas/`);
      return response.data;
    },
    enabled: options?.enabled !== false && !!postId,
  });
};
