/**
 * Hook for managing Instagram accounts.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { instagramSchedulingService } from "../services";

const QUERY_KEY = ["instagram-accounts"];

/**
 * Hook to fetch and manage Instagram accounts.
 */
export function useInstagramAccounts() {
  const queryClient = useQueryClient();

  // Query for fetching accounts
  const accountsQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => instagramSchedulingService.getAccounts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for disconnecting account
  const disconnectMutation = useMutation({
    mutationFn: (accountId: number) =>
      instagramSchedulingService.disconnectAccount(accountId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success(data.message);
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      const message =
        error.response?.data?.error || "Erro ao desconectar conta";
      toast.error(message);
    },
  });

  return {
    // Query state
    accounts: accountsQuery.data ?? [],
    isLoading: accountsQuery.isLoading,
    isError: accountsQuery.isError,
    error: accountsQuery.error,
    refetch: accountsQuery.refetch,

    // Connected accounts only
    connectedAccounts: (accountsQuery.data ?? []).filter(
      (acc) => acc.status === "connected" && acc.is_token_valid
    ),

    // Has any connected account
    hasConnectedAccount: (accountsQuery.data ?? []).some(
      (acc) => acc.status === "connected" && acc.is_token_valid
    ),

    // Mutations
    disconnectAccount: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
  };
}
