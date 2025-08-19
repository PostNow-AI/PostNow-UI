import { geminiKeyApi } from "@/lib/gemini-key-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export const useGeminiKeyOverlay = (onClose: () => void) => {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  // Save API key mutation
  const saveMutation = useMutation({
    mutationFn: async () => geminiKeyApi.setKey(apiKey.trim()),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["gemini-key-status"] });
      onClose();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Erro ao salvar chave da API");
      }
    },
  });

  // Handlers
  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Por favor, insira sua chave da API");
      return;
    }
    saveMutation.mutate();
  };

  const handleClose = () => {
    onClose();
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleHideTutorial = () => {
    setShowTutorial(false);
  };

  const resetForm = () => {
    setApiKey("");
    setShowTutorial(false);
  };

  return {
    // State
    apiKey,
    showTutorial,

    // Mutation
    saveMutation,

    // Handlers
    handleSave,
    handleClose,
    handleShowTutorial,
    handleHideTutorial,
    resetForm,

    // Setters
    setApiKey,
  };
};
