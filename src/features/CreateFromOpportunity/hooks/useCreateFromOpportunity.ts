import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFromOpportunityService } from "../services";
import type { CreateFromOpportunityState, CreatePostData, Opportunity, VisualStyle } from "../types";
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

  // Fetch user opportunities for navigation
  const {
    data: opportunities = [],
    isLoading: isLoadingOpportunities,
  } = useQuery<Opportunity[]>({
    queryKey: ["user-opportunities"],
    queryFn: createFromOpportunityService.getOpportunities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Find current opportunity index based on topic (partial match for URL compatibility)
  const currentOpportunityIndex = useMemo(() => {
    if (opportunities.length === 0) return -1;
    // Try exact match first
    const exactIndex = opportunities.findIndex((opp) => opp.topic === state.topic);
    if (exactIndex !== -1) return exactIndex;
    // Try partial match (topic from URL might be truncated)
    return opportunities.findIndex((opp) =>
      opp.topic.toLowerCase().includes(state.topic.toLowerCase()) ||
      state.topic.toLowerCase().includes(opp.topic.toLowerCase())
    );
  }, [opportunities, state.topic]);

  // Navigation info
  const canNavigatePrev = currentOpportunityIndex > 0;
  const canNavigateNext = currentOpportunityIndex < opportunities.length - 1 && currentOpportunityIndex !== -1;
  // If topic not found in list, allow navigating to first opportunity
  const canNavigateToFirst = currentOpportunityIndex === -1 && opportunities.length > 0;
  const totalOpportunities = opportunities.length;

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
    onSuccess: (data) => {
      toast.success("Post gerado com sucesso!");
      // Invalidate posts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      setState((prev) => ({
        ...prev,
        step: 4,
        isGenerating: false,
        generatedContent: data.post.content,
        generatedImageUrl: data.post.image_url || null,
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

  // Navigate to a specific opportunity
  const goToOpportunity = useCallback((index: number) => {
    if (index < 0 || index >= opportunities.length) return;

    const opp = opportunities[index];
    setState((prev) => ({
      ...prev,
      step: 1,
      topic: opp.topic,
      category: opp.category,
      score: opp.score,
      furtherDetails: "",
      selectedStyleId: null,
      generatedContent: null,
      generatedImageUrl: null,
      error: null,
    }));
  }, [opportunities]);

  // Navigate to previous opportunity
  const prevOpportunity = useCallback(() => {
    if (canNavigatePrev) {
      goToOpportunity(currentOpportunityIndex - 1);
    }
  }, [canNavigatePrev, currentOpportunityIndex, goToOpportunity]);

  // Navigate to next opportunity
  const nextOpportunity = useCallback(() => {
    if (canNavigateNext) {
      goToOpportunity(currentOpportunityIndex + 1);
    }
  }, [canNavigateNext, currentOpportunityIndex, goToOpportunity]);

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
      further_details: state.furtherDetails || "",
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

    // Opportunities navigation
    opportunities,
    isLoadingOpportunities,
    currentOpportunityIndex,
    totalOpportunities,
    canNavigatePrev,
    canNavigateNext: canNavigateNext || canNavigateToFirst,
    prevOpportunity,
    nextOpportunity: canNavigateToFirst ? () => goToOpportunity(0) : nextOpportunity,
    goToOpportunity,

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
