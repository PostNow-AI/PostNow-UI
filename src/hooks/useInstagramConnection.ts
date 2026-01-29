/**
 * useInstagramConnection - Hook for managing Instagram connection state
 */

import { instagramService } from "@/services/instagramService";
import type { InstagramCallbackRequest } from "@/types/instagram";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useInstagramConnection() {
  const queryClient = useQueryClient();

  // Get connection status
  const {
    data: status,
    isLoading: isLoadingStatus,
    error: statusError,
  } = useQuery({
    queryKey: ["instagram", "status"],
    queryFn: () => instagramService.getStatus(),
    refetchInterval: 60000, // Refetch every minute
  });

  // Initiate connection
  const connectMutation = useMutation({
    mutationFn: () => instagramService.connect(),
    onSuccess: (data) => {
      // Redirect to Instagram OAuth
      window.location.href = data.authorization_url;
    },
    onError: (error: any) => {
      console.error("Failed to initiate Instagram connection:", error);
    },
  });

  // Handle OAuth callback
  const callbackMutation = useMutation({
    mutationFn: (data: InstagramCallbackRequest) =>
      instagramService.callback(data),
    onSuccess: () => {
      // Invalidate status query to refetch
      queryClient.invalidateQueries({ queryKey: ["instagram", "status"] });
      queryClient.invalidateQueries({ queryKey: ["instagram", "metrics"] });
    },
    onError: (error: any) => {
      console.error("Failed to complete Instagram connection:", error);
    },
  });

  // Disconnect account
  const disconnectMutation = useMutation({
    mutationFn: () => instagramService.disconnect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagram"] });
    },
    onError: (error: any) => {
      console.error("Failed to disconnect Instagram:", error);
    },
  });

  // Manual sync
  const syncMutation = useMutation({
    mutationFn: () => instagramService.sync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagram", "status"] });
      queryClient.invalidateQueries({ queryKey: ["instagram", "metrics"] });
    },
    onError: (error: any) => {
      console.error("Failed to sync Instagram data:", error);
    },
  });

  return {
    // Status
    status,
    isConnected: status?.connected ?? false,
    account: status?.account,
    daysUntilExpiration: status?.days_until_expiration,
    needsReconnection: status?.needs_reconnection ?? false,
    isLoadingStatus,
    statusError,

    // Actions
    connect: connectMutation.mutate,
    handleCallback: callbackMutation.mutate,
    disconnect: disconnectMutation.mutate,
    sync: syncMutation.mutate,

    // Loading states
    isConnecting: connectMutation.isPending,
    isProcessingCallback: callbackMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
    isSyncing: syncMutation.isPending,

    // Errors
    connectError: connectMutation.error,
    callbackError: callbackMutation.error,
    disconnectError: disconnectMutation.error,
    syncError: syncMutation.error,
  };
}
