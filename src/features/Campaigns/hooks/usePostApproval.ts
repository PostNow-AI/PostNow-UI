/**
 * Hook para aprovar/rejeitar posts de campanha.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { campaignService } from "../services";
import { handleApiError } from "@/lib/utils/errorHandling";

export const usePostApproval = (campaignId: number) => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (postId: number) => campaignService.approvePost(campaignId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      toast.success("Post aprovado com sucesso!");
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao aprovar post",
        defaultDescription: "Não foi possível aprovar o post. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const bulkApproveMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      return Promise.all(
        postIds.map((postId) => campaignService.approvePost(campaignId, postId))
      );
    },
    onSuccess: (_, postIds) => {
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      toast.success(`${postIds.length} posts aprovados com sucesso!`);
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao aprovar posts",
        defaultDescription: "Não foi possível aprovar os posts. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  return {
    approvePost: approveMutation.mutate,
    bulkApprove: bulkApproveMutation.mutate,
    isApproving: approveMutation.isPending || bulkApproveMutation.isPending,
  };
};

