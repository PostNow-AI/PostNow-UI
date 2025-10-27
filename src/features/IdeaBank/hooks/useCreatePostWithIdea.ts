import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ideaBankService } from "../services";
import type { PostCreationData } from "../types";

export const useCreatePostWithIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostCreationData) =>
      ideaBankService.createPostWithIdea(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      toast.success("Post criado com sucesso!");
      return data;
    },
    onError: (error) => {
      toast.error("Erro ao criar post");
      console.error("Error creating post:", error);
    },
  });
};
