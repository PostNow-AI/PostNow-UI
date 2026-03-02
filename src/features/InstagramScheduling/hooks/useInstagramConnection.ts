/**
 * Hook for managing Instagram OAuth connection flow.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { instagramSchedulingService } from "../services";
import type { InstagramAccount } from "../types";

/**
 * Hook to manage Instagram OAuth connection flow.
 */
export function useInstagramConnection() {
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * Initiate OAuth connection flow.
   * Opens the Meta OAuth URL in a new window or redirects.
   */
  const initiateConnection = async (redirectInSameWindow = false) => {
    setIsConnecting(true);
    try {
      const { url } = await instagramSchedulingService.getOAuthUrl();

      if (redirectInSameWindow) {
        // Redirect in same window (recommended for mobile)
        window.location.href = url;
      } else {
        // Open in new window/tab
        window.open(url, "_self");
      }
    } catch (error) {
      const err = error as Error & { response?: { data?: { error?: string } } };
      const message =
        err.response?.data?.error || "Erro ao iniciar conexão com Instagram";
      toast.error(message);
      setIsConnecting(false);
    }
  };

  /**
   * Process OAuth callback with authorization code.
   */
  const processCallbackMutation = useMutation({
    mutationFn: (code: string) =>
      instagramSchedulingService.processOAuthCallback(code),
    onSuccess: (data: InstagramAccount) => {
      // Invalidate accounts query to refetch
      queryClient.invalidateQueries({ queryKey: ["instagram-accounts"] });
      toast.success(
        `Conta @${data.instagram_username} conectada com sucesso!`
      );
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      const message =
        error.response?.data?.error ||
        "Erro ao processar autorização do Instagram";
      toast.error(message);
    },
  });

  return {
    // Connection flow
    initiateConnection,
    isConnecting,

    // OAuth callback processing
    processCallback: processCallbackMutation.mutateAsync,
    isProcessingCallback: processCallbackMutation.isPending,
    callbackError: processCallbackMutation.error,
  };
}
