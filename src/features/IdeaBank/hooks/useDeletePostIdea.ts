import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ideaBankService } from "../services";

export const useDeletePostIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ideaId: number) => ideaBankService.deletePostIdea(ideaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      toast.success("Ideia deletada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao deletar ideia");
    },
  });
};
