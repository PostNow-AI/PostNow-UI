import {
  ideaBankService,
  type CampaignIdea,
} from "@/lib/services/ideaBankService";
import { handleIdeaGenerationError } from "@/lib/utils/aiErrorHandling";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface ImprovementProgress {
  percentage: number;
  currentStep: number;
  totalSteps: number;
  currentStepName: string;
  elapsedTime: number;
}

export const useIdeaEditor = (ideas: CampaignIdea[]) => {
  const [editingIdeas, setEditingIdeas] = useState(ideas);
  const [viewingIdea, setViewingIdea] = useState<CampaignIdea | null>(null);
  const [editingIdea, setEditingIdea] = useState<CampaignIdea | null>(null);
  const [deletingIdea, setDeletingIdea] = useState<CampaignIdea | null>(null);
  const [improvingIdea, setImprovingIdea] = useState<CampaignIdea | null>(null);
  const [improvementPrompt, setImprovementPrompt] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [originalIdea, setOriginalIdea] = useState<CampaignIdea | null>(null);
  const [improvedIdea, setImprovedIdea] = useState<CampaignIdea | null>(null);
  const [improvementProgress, setImprovementProgress] =
    useState<ImprovementProgress | null>(null);
  const [improvementStatus, setImprovementStatus] = useState<
    "idle" | "generating" | "complete" | "error"
  >("idle");
  const [improvementError, setImprovementError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with props when they change
  useEffect(() => {
    if (ideas && ideas.length > 0) {
      setEditingIdeas(ideas);
    }
  }, [ideas]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  // Group ideas by platform
  const ideasByPlatform = editingIdeas.reduce(
    (acc: Record<string, CampaignIdea[]>, idea: CampaignIdea) => {
      const platform = idea.platform_display || idea.platform;
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push(idea);
      return acc;
    },
    {}
  );

  const updateIdeaMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CampaignIdea>;
    }) => {
      const response = await ideaBankService.updateIdea(id, data);
      return response;
    },
    onSuccess: () => {
      toast.success("Ideia atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
    },
    onError: (error: AxiosError<{ error: string }>, variables) => {
      toast.error(error.response?.data?.error || "Erro ao atualizar ideia");

      // Revert local state if backend update fails
      if (variables.data.status) {
        const originalIdeas = ideas; // Use original ideas to revert
        setEditingIdeas([...originalIdeas]);
      }
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await ideaBankService.deleteIdea(id);
      return response;
    },
    onSuccess: () => {
      toast.success("Ideia deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
      setDeletingIdea(null);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "Erro ao deletar ideia");
    },
  });

  const improveIdeaMutation = useMutation({
    mutationFn: async ({
      ideaId,
      improvementPrompt,
    }: {
      ideaId: number;
      improvementPrompt: string;
    }) => {
      setImprovementStatus("generating");
      setImprovementError(null);

      // Simulate progress updates for improvement
      progressIntervalRef.current = setInterval(() => {
        setImprovementProgress((prev) => {
          if (!prev) {
            return {
              percentage: 0,
              currentStep: 0,
              totalSteps: 6,
              currentStepName: "Iniciando melhoria...",
              elapsedTime: 0,
            };
          }

          const newStep = Math.min(prev.currentStep + 1, prev.totalSteps);
          const newPercentage = Math.round((newStep / prev.totalSteps) * 100);

          const stepNames = [
            "Iniciando melhoria...",
            "Analisando ideia atual...",
            "Processando prompt de melhoria...",
            "Gerando conteúdo melhorado...",
            "Validando e otimizando...",
            "Concluído!",
          ];

          return {
            percentage: newPercentage,
            currentStep: newStep,
            totalSteps: prev.totalSteps,
            currentStepName: stepNames[newStep - 1] || "Processando...",
            elapsedTime: prev.elapsedTime + 1,
          };
        });
      }, 600);

      try {
        const response = await ideaBankService.improveIdea(
          ideaId,
          improvementPrompt
        );

        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }

        setImprovementStatus("complete");
        setImprovementProgress((prev) =>
          prev
            ? {
                ...prev,
                percentage: 100,
                currentStep: prev.totalSteps,
                currentStepName: "Concluído!",
              }
            : null
        );

        return response;
      } catch (error) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }

        setImprovementStatus("error");
        setImprovementError(
          error instanceof Error ? error.message : "Erro desconhecido"
        );
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
      toast.success("Ideia melhorada com sucesso!");

      // Store original and improved versions for comparison
      setOriginalIdea(improvingIdea ? { ...improvingIdea } : null);
      setImprovedIdea(data.idea ? { ...data.idea } : null);

      // Update local state with improved idea
      setEditingIdeas((prev) =>
        prev.map((idea) =>
          idea.id === improvingIdea?.id
            ? { ...idea, ...data.improved_idea, status: "draft" }
            : idea
        )
      );

      setImprovingIdea(null);
      setImprovementPrompt("");
      setShowDiff(true);
      setImprovementStatus("idle");
      setImprovementProgress(null);
      setImprovementError(null);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const errorResult = handleIdeaGenerationError(error, "improve");
      toast.error(errorResult.title, {
        description: errorResult.description,
      });
      setImprovementStatus("idle");
      setImprovementProgress(null);
      setImprovementError(null);
    },
  });

  // Handlers
  const handleIdeaUpdate = (index: number, field: string, value: string) => {
    const updatedIdeas = [...editingIdeas];
    updatedIdeas[index] = { ...updatedIdeas[index], [field]: value };
    setEditingIdeas(updatedIdeas);
  };

  const handleSaveIdea = (idea: {
    id: number;
    title: string;
    description: string;
    content: string;
    status: "draft" | "approved" | "archived";
  }) => {
    updateIdeaMutation.mutate({
      id: idea.id || 0,
      data: {
        title: idea.title || "",
        description: idea.description || "",
        content: idea.content || "",
        status: idea.status || "draft",
      },
    });
  };

  const handleStatusChange = (
    idea: {
      id: number;
      title: string;
      description: string;
      content: string;
      status: "draft" | "approved" | "archived";
    },
    status: "draft" | "approved" | "archived"
  ) => {
    // Update local state immediately for better UX
    const updatedIdeas = editingIdeas.map((item) =>
      item.id === idea.id ? { ...item, status } : item
    );
    setEditingIdeas(updatedIdeas);

    // Then update the backend
    updateIdeaMutation.mutate({
      id: idea.id,
      data: { status },
    });
  };

  const handleDeleteIdea = (idea: {
    id: number;
    title: string;
    description: string;
    content: string;
    status: "draft" | "approved" | "archived";
  }) => {
    deleteIdeaMutation.mutate(idea.id);
    // Remove from local state immediately
    const updatedIdeas = editingIdeas.filter((item) => item.id !== idea.id);
    setEditingIdeas(updatedIdeas);
  };

  const handleImproveIdea = (idea: {
    id: number;
    title: string;
    description: string;
    content: string;
    status: "draft" | "approved" | "archived";
    platform: string;
    platform_display: string;
    content_type: string;
    content_type_display: string;
    campaign_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    improvement_prompt?: string;
    improved_from_id?: number;
    improved_by_ai?: boolean;
    improvement_status?: string;
    improvement_progress?: number;
    improvement_error?: string | null;
  }) => {
    setImprovingIdea(idea as unknown as CampaignIdea);
    setImprovementPrompt("");
  };

  const handleSubmitImprovement = () => {
    if (!improvingIdea || !improvementPrompt.trim()) {
      toast.error("Por favor, descreva como a IA pode melhorar a ideia");
      return;
    }

    improveIdeaMutation.mutate({
      ideaId: improvingIdea.id,
      improvementPrompt: improvementPrompt.trim(),
    });
  };

  const handleSaveEditIdea = () => {
    if (!editingIdea) return;

    updateIdeaMutation.mutate({
      id: editingIdea.id,
      data: {
        title: editingIdea.title,
        description: editingIdea.description,
        content: editingIdea.content,
        status: editingIdea.status,
      },
    });

    // Update local state
    const updatedIdeas = editingIdeas.map((item) =>
      item.id === editingIdea.id ? editingIdea : item
    );
    setEditingIdeas(updatedIdeas);
    setEditingIdea(null);
  };

  const handleCloseImprovementDialog = () => {
    setImprovingIdea(null);
    setImprovementPrompt("");
    setImprovementStatus("idle");
    setImprovementProgress(null);
    setImprovementError(null);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleCloseDiffDialog = () => {
    setShowDiff(false);
    setOriginalIdea(null);
    setImprovedIdea(null);
  };

  const resetForm = () => {
    setEditingIdeas(ideas);
    setViewingIdea(null);
    setEditingIdea(null);
    setDeletingIdea(null);
    setImprovingIdea(null);
    setImprovementPrompt("");
    setShowDiff(false);
    setOriginalIdea(null);
    setImprovedIdea(null);
    setImprovementProgress(null);
    setImprovementStatus("idle");
    setImprovementError(null);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  return {
    // State
    editingIdeas,
    viewingIdea,
    editingIdea,
    deletingIdea,
    improvingIdea,
    improvementPrompt,
    showDiff,
    originalIdea,
    improvedIdea,
    improvementProgress,
    improvementStatus,
    improvementError,
    ideasByPlatform,

    // Mutations
    updateIdeaMutation,
    deleteIdeaMutation,
    improveIdeaMutation,

    // Handlers
    handleIdeaUpdate,
    handleSaveIdea,
    handleStatusChange,
    handleDeleteIdea,
    handleImproveIdea,
    handleSubmitImprovement,
    handleSaveEditIdea,
    handleCloseImprovementDialog,
    handleCloseDiffDialog,
    resetForm,

    // Setters
    setViewingIdea,
    setEditingIdea,
    setDeletingIdea,
    setImprovingIdea,
    setImprovementPrompt,
    setShowDiff,
    setOriginalIdea,
    setImprovedIdea,
    setImprovementProgress,
    setImprovementStatus,
    setImprovementError,
  };
};
