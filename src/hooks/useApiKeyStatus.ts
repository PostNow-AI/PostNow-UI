import { geminiKeyApi } from "@/lib/gemini-key-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useApiKeyStatus = () => {
  const [showKeyOverlay, setShowKeyOverlay] = useState(false);
  const queryClient = useQueryClient();

  // Get API key status
  const { data: keyStatus, isLoading } = useQuery({
    queryKey: ["gemini-key-status"],
    queryFn: () => geminiKeyApi.getStatus(),
  });

  // Delete API key mutation
  const deleteKeyMutation = useMutation({
    mutationFn: () => geminiKeyApi.deleteKey(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gemini-key-status"] });
      toast.success("Chave da API removida com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover chave da API");
    },
  });

  // Handlers
  const handleShowKeyOverlay = () => {
    setShowKeyOverlay(true);
  };

  const handleCloseKeyOverlay = () => {
    setShowKeyOverlay(false);
  };

  const handleDeleteKey = () => {
    deleteKeyMutation.mutate();
  };

  return {
    // State
    showKeyOverlay,

    // Data
    keyStatus,
    isLoading,

    // Mutation
    deleteKeyMutation,

    // Handlers
    handleShowKeyOverlay,
    handleCloseKeyOverlay,
    handleDeleteKey,
  };
};
