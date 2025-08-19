import { socialAccountsService } from "@/lib/services/socialAccountsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { SocialAccount } from "./useDashboardLayout";

export const useSocialAccounts = (userId?: string) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch social accounts
  const { data: socialAccounts = [], isLoading } = useQuery({
    queryKey: ["social-accounts", userId],
    queryFn: async (): Promise<SocialAccount[]> => {
      const response = await socialAccountsService.getSocialAccounts();
      return response.social_accounts || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Find Google account
  const googleAccount = socialAccounts.find(
    (acc: SocialAccount) => acc.provider === "google"
  );

  // Disconnect social account mutation
  const disconnectMutation = useMutation({
    mutationFn: async (accountId: number) => {
      await socialAccountsService.disconnectAccount(accountId);
    },
    onSuccess: () => {
      toast.success("Conta desconectada com sucesso!");
      // Invalidate social accounts query
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
      // Also invalidate user picture query since it depends on social accounts
      queryClient.invalidateQueries({ queryKey: ["user-picture"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao desconectar conta";
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsDisconnecting(false);
    },
  });

  const handleConnectGoogle = () => {
    // Implement Google connection logic
    toast.info("Funcionalidade em desenvolvimento", {
      description: "A conexão com Google será implementada em breve.",
    });
  };

  const handleDisconnect = async (account: SocialAccount) => {
    setIsDisconnecting(true);
    disconnectMutation.mutate(account.id);
  };

  return {
    socialAccountsData: {
      social_accounts: socialAccounts,
      total_count: socialAccounts.length,
    },
    isLoading,
    error: null, // No error handling in this hook currently
    isDisconnecting,
    handleConnectGoogle,
    handleDisconnect,
    getGoogleAccount: () => googleAccount,
  };
};
