import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ideaBankService } from "../services";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => ideaBankService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      toast.success("Post excluído com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir post");
    },
  });
};
