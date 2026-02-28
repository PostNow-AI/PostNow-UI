import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFromOpportunityService } from "../services";
import type { CreateFromOpportunityState, CreatePostData, VisualStyle } from "../types";
import { useUrlParams } from "./useUrlParams";

export const useCreateFromOpportunity = () => {
  const queryClient = useQueryClient();
  const urlParams = useUrlParams();

  const [state, setState] = useState<CreateFromOpportunityState>({
    step: 1,
    topic: urlParams.topic,
    category: urlParams.category,
    score: urlParams.score,
    furtherDetails: "",
    selectedStyleId: null,
    isGenerating: false,
    generatedContent: null,
    generatedImageUrl: null,
    error: null,
  });

  // Fetch visual styles
  const {
    data: visualStyles = [],
    isLoading: isLoadingStyles,
    error: stylesError,
  } = useQuery<VisualStyle[]>({
    queryKey: ["visual-styles"],
    queryFn: createFromOpportunityService.getVisualStyles,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Generate post mutation
  const generatePostMutation = useMutation({
    mutationFn: createFromOpportunityService.generatePost,
    onSuccess: () => {
      toast.success("Post gerado com sucesso!");
      // Invalidate posts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      setState((prev) => ({
        ...prev,
        step: 4,
        isGenerating: false,
      }));
    },
    onError: (error: Error) => {
      toast.error("Erro ao gerar post. Tente novamente.");
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error.message,
      }));
    },
  });

  // Navigation handlers
  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.min(prev.step + 1, 4),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.max(prev.step - 1, 1),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, Math.min(step, 4)),
    }));
  }, []);

  // Update handlers
  const setFurtherDetails = useCallback((details: string) => {
    setState((prev) => ({
      ...prev,
      furtherDetails: details,
    }));
  }, []);

  const setSelectedStyleId = useCallback((styleId: number | null) => {
    setState((prev) => ({
      ...prev,
      selectedStyleId: styleId,
    }));
  }, []);

  // Generate post handler
  const generatePost = useCallback(() => {
    if (!state.selectedStyleId) {
      toast.error("Selecione um estilo visual");
      return;
    }

    setState((prev) => ({
      ...prev,
      step: 3,
      isGenerating: true,
      error: null,
    }));

    const postData: CreatePostData = {
      name: state.topic,
      objective: "engagement",
      type: "feed",
      further_details: state.furtherDetails || undefined,
      include_image: true,
      style_id: state.selectedStyleId,
    };

    generatePostMutation.mutate(postData);
  }, [state.topic, state.furtherDetails, state.selectedStyleId, generatePostMutation]);

  // Create another post (reset state)
  const createAnother = useCallback(() => {
    setState({
      step: 1,
      topic: urlParams.topic,
      category: urlParams.category,
      score: urlParams.score,
      furtherDetails: "",
      selectedStyleId: null,
      isGenerating: false,
      generatedContent: null,
      generatedImageUrl: null,
      error: null,
    });
  }, [urlParams]);

  return {
    // State
    ...state,
    visualStyles,
    isLoadingStyles,
    stylesError,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    setFurtherDetails,
    setSelectedStyleId,
    generatePost,
    createAnother,
  };
};
