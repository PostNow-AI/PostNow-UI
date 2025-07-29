import { authApi } from "@/lib/auth";
import { initiateGoogleOAuth } from "@/lib/google-oauth";
import type { SocialAccount } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSocialAccounts() {
  const queryClient = useQueryClient();

  // Fetch social accounts
  const socialAccountsQuery = useQuery({
    queryKey: ["auth", "socialAccounts"],
    queryFn: authApi.getSocialAccounts,
  });

  // Disconnect social account mutation
  const disconnectMutation = useMutation({
    mutationFn: authApi.disconnectSocialAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "socialAccounts"] });
      toast.success(
        `Conta ${data.disconnected_provider} desconectada com sucesso`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha ao desconectar conta");
    },
  });

  const handleDisconnect = (account: SocialAccount) => {
    if (
      confirm(
        `Tem certeza de que deseja desconectar sua conta ${account.provider}?`
      )
    ) {
      disconnectMutation.mutate(account.id);
    }
  };

  const handleConnectGoogle = () => {
    try {
      initiateGoogleOAuth();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha na conexão com Google"
      );
    }
  };

  const getGoogleAccount = () => {
    return socialAccountsQuery.data?.social_accounts.find(
      (acc) => acc.provider === "google"
    );
  };

  return {
    // Data
    socialAccountsData: socialAccountsQuery.data,
    isLoading: socialAccountsQuery.isLoading,
    error: socialAccountsQuery.error,

    // Actions
    handleDisconnect,
    handleConnectGoogle,

    // Helpers
    getGoogleAccount,

    // Mutation states
    isDisconnecting: disconnectMutation.isPending,
  };
}
