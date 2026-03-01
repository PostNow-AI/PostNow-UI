/**
 * Mutations for scheduled posts.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { instagramSchedulingService } from "../services";
import type { ScheduledPostCreateData, ScheduledPostUpdateData } from "../types";
import { SCHEDULED_POSTS_QUERY_KEY } from "./useScheduledPosts";

/**
 * Hook providing all scheduled post mutations.
 */
export function useScheduledPostMutations() {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: SCHEDULED_POSTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["scheduled-post-stats"] });
  };

  // Create scheduled post
  const createMutation = useMutation({
    mutationFn: (data: ScheduledPostCreateData) =>
      instagramSchedulingService.createScheduledPost(data),
    onSuccess: () => {
      invalidateQueries();
      toast.success("Post agendado com sucesso!");
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      const message = error.response?.data?.error || "Erro ao agendar post";
      toast.error(message);
    },
  });

  // Update scheduled post
  const updateMutation = useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: ScheduledPostUpdateData;
    }) => instagramSchedulingService.updateScheduledPost(postId, data),
    onSuccess: () => {
      invalidateQueries();
      toast.success("Post atualizado com sucesso!");
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      const message = error.response?.data?.error || "Erro ao atualizar post";
      toast.error(message);
    },
  });

  // Delete scheduled post
  const deleteMutation = useMutation({
    mutationFn: (postId: number) =>
      instagramSchedulingService.deleteScheduledPost(postId),
    onSuccess: () => {
      invalidateQueries();
      toast.success("Post excluido com sucesso!");
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      const message = error.response?.data?.error || "Erro ao excluir post";
      toast.error(message);
    },
  });

  // Cancel scheduled post
  const cancelMutation = useMutation({
    mutationFn: (postId: number) =>
      instagramSchedulingService.cancelScheduledPost(postId),
    onSuccess: (data) => {
      invalidateQueries();
      toast.success(data.message);
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      const message = error.response?.data?.error || "Erro ao cancelar post";
      toast.error(message);
    },
  });

  // Publish now
  const publishNowMutation = useMutation({
    mutationFn: (postId: number) =>
      instagramSchedulingService.publishNow(postId),
    onSuccess: (data) => {
      invalidateQueries();
      toast.success(data.message);
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      const message = error.response?.data?.error || "Erro ao publicar post";
      toast.error(message);
    },
  });

  // Retry failed post
  const retryMutation = useMutation({
    mutationFn: (postId: number) =>
      instagramSchedulingService.retryPost(postId),
    onSuccess: (data) => {
      invalidateQueries();
      toast.success(data.message);
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      const message = error.response?.data?.error || "Erro ao reagendar post";
      toast.error(message);
    },
  });

  return {
    // Create
    createScheduledPost: createMutation.mutate,
    createScheduledPostAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    // Update
    updateScheduledPost: updateMutation.mutate,
    updateScheduledPostAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    // Delete
    deleteScheduledPost: deleteMutation.mutate,
    deleteScheduledPostAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    // Cancel
    cancelScheduledPost: cancelMutation.mutate,
    cancelScheduledPostAsync: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,

    // Publish Now
    publishNow: publishNowMutation.mutate,
    publishNowAsync: publishNowMutation.mutateAsync,
    isPublishing: publishNowMutation.isPending,

    // Retry
    retryScheduledPost: retryMutation.mutate,
    retryScheduledPostAsync: retryMutation.mutateAsync,
    isRetrying: retryMutation.isPending,

    // Combined loading state
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      cancelMutation.isPending ||
      publishNowMutation.isPending ||
      retryMutation.isPending,
  };
}
