import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ideaBankService } from "../services";
import type { Post } from "../types";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) =>
      ideaBankService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      toast.success("Post atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar post");
    },
  });
};
