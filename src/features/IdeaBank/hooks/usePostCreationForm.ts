import type { Post, PostCreationData, PostIdea } from "../types";
import { useCreatePostWithIdea } from "./useCreatePostWithIdea";

// Hook for PostCreationDialog form logic
export const usePostCreationForm = (
  onSuccess?: (postData: Post, ideaData: PostIdea) => void
) => {
  const createPostMutation = useCreatePostWithIdea();

  const handleCreatePost = async (data: PostCreationData) => {
    const result = await createPostMutation.mutateAsync(data);
    onSuccess?.(result.post, result.idea);
    return result;
  };

  return {
    handleCreatePost,
    isCreating: createPostMutation.isPending,
  };
};
