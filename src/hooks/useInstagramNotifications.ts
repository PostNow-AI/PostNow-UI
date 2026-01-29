/**
 * useInstagramNotifications - Hook for managing Instagram notifications
 */

import { instagramService } from "@/services/instagramService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useInstagramNotifications(unreadOnly: boolean = false) {
  const queryClient = useQueryClient();

  const {
    data: notificationsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["instagram", "notifications", unreadOnly],
    queryFn: () => instagramService.getNotifications(unreadOnly),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      instagramService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instagram", "notifications"],
      });
    },
  });

  return {
    notifications: notificationsResponse?.results || [],
    unreadCount: notificationsResponse?.unread_count || 0,
    totalCount: notificationsResponse?.count || 0,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
}
