import {
  ideaBankService,
  type CampaignIdea,
} from "@/lib/services/ideaBankService";
import { handleIdeaGenerationError } from "@/lib/utils/aiErrorHandling";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUserCredits } from "../features/Credits/hooks/useCredits";
import { useCostEstimate } from "./useAIModels";

export interface FormData {
  title: string;
  description: string;
  content: string;
  platform: string;
  content_type: string;
  variation_type: string;
  preferred_provider?: string;
  preferred_model?: string;
}

export interface AddIdeaGenerationProgress {
  percentage: number;
  currentStep: number;
  totalSteps: number;
  currentStepName: string;
  elapsedTime: number;
}

const INITIAL_FORM_DATA: FormData = {
  title: "",
  description: "",
  content: "",
  platform: "instagram",
  content_type: "post",
  variation_type: "a",
};

const GENERATION_STEPS = [
  "Inicializando geração de ideia...",
  "Analisando campanha existente...",
  "Processando parâmetros da ideia...",
  "Construindo prompt específico...",
  "Conectando com Gemini AI...",
  "Gerando conteúdo da ideia...",
  "Processando resposta da IA...",
  "Validando formato JSON...",
  "Estruturando dados finais...",
  "Finalizando geração...",
];

export const useAddIdeaDialog = (
  campaignId: number,
  onEditIdea: (idea: CampaignIdea) => void
) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] =
    useState<AddIdeaGenerationProgress | null>(null);
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "generating" | "complete" | "error"
  >("idle");
  const [generationError, setGenerationError] = useState<string>("");

  // Ref to store progress interval for cleanup
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const estimateCost = useCostEstimate();
  const { data: userCredits } = useUserCredits();

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  // Helper functions
  const validateFormData = () => {
    if (!formData.platform || !formData.content_type) {
      throw new Error(
        "Selecione a plataforma e tipo de conteúdo antes de gerar com IA"
      );
    }
  };

  const initializeGeneration = () => {
    setIsGenerating(true);
    setGenerationStatus("generating");
    setGenerationProgress({
      percentage: 0,
      currentStep: 0,
      totalSteps: GENERATION_STEPS.length,
      currentStepName: GENERATION_STEPS[0],
      elapsedTime: 0,
    });
  };

  const startProgressSimulation = () => {
    return setInterval(() => {
      setGenerationProgress((prev: AddIdeaGenerationProgress | null) => {
        if (!prev || prev.percentage >= 100) {
          return prev;
        }
        return {
          ...prev,
          percentage: Math.min(prev.percentage + 10, 100),
          currentStep: Math.min(prev.currentStep + 1, prev.totalSteps),
          currentStepName:
            GENERATION_STEPS[prev.currentStep] || "Processando...",
          elapsedTime: prev.elapsedTime + 1,
        };
      });
    }, 1000);
  };

  const completeGeneration = () => {
    setGenerationStatus("complete");
    setGenerationProgress((prev: AddIdeaGenerationProgress | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        percentage: 100,
        currentStep: prev.totalSteps,
        currentStepName: "Geração concluída!",
        elapsedTime: prev.elapsedTime,
      };
    });
  };

  const handleGenerationError = (error: unknown) => {
    setGenerationStatus("error");
    const errorResult = handleIdeaGenerationError(error, "generate");
    setGenerationError(errorResult.description);
    toast.error(errorResult.title, {
      description: errorResult.description,
    });
  };

  const updateFormWithGeneratedContent = (response: CampaignIdea) => {
    setFormData((prev) => ({
      ...prev,
      title: response.title || prev.title,
      description: response.description || prev.description,
      content: response.content || prev.content,
    }));
    if (onEditIdea) {
      onEditIdea(response);
    }
  };

  // Generate idea with AI mutation
  const generateIdeaMutation = useMutation({
    mutationFn: async () => {
      // Validate form data
      validateFormData();

      // Initialize generation state
      initializeGeneration();

      // Start progress simulation
      progressIntervalRef.current = startProgressSimulation();

      // Call the backend to generate idea
      const response = await ideaBankService.generateSingleIdea(campaignId, {
        platform: formData.platform,
        content_type: formData.content_type,
        variation_type: formData.variation_type,
        title: formData.title,
        description: formData.description,
        content: formData.content,
      });

      return response;
    },
    onSuccess: (response) => {
      // Clear progress simulation
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Complete generation
      completeGeneration();

      // Update form with generated content
      if (response) {
        updateFormWithGeneratedContent(response);
      }

      toast.success("Ideia gerada com sucesso!");
    },
    onError: (error) => {
      // Clear progress simulation on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Handle error
      handleGenerationError(error);
    },
    onSettled: () => {
      // Always clean up generation state
      setIsGenerating(false);
    },
  });

  // Handlers
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateWithAI = async () => {
    try {
      // Estimate cost before generating
      const costEstimate = await estimateCost.mutateAsync({
        platforms: [formData.platform],
        target_audience: "",
        campaign_objective: "",
        brand_voice: "",
        preferred_provider: formData.preferred_provider,
        preferred_model: formData.preferred_model,
      });

      // Check if user has enough credits
      if (userCredits && userCredits.balance < costEstimate.estimated_cost) {
        toast.error(
          `Créditos insuficientes. Necessário: ${costEstimate.estimated_cost.toFixed(
            2
          )}, Disponível: ${userCredits.balance.toFixed(2)}`
        );
        return;
      }

      generateIdeaMutation.mutate();
    } catch {
      toast.error("Erro ao estimar custo. Tente novamente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdIdea = await ideaBankService.generateSingleIdea(campaignId, {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        platform: formData.platform,
        content_type: formData.content_type,
        variation_type: formData.variation_type,
        preferred_provider: formData.preferred_provider,
        preferred_model: formData.preferred_model,
      });
      toast.success("Ideia criada com sucesso!");
      onEditIdea(createdIdea);
      return createdIdea;
    } catch {
      toast.error("Erro ao criar ideia");
      throw new Error("Erro ao criar ideia");
    }
  };

  const handleClose = () => {
    if (isGenerating) {
      toast.error("Aguarde a geração terminar antes de fechar");
      return;
    }
    // Reset form and state
    setFormData(INITIAL_FORM_DATA);
    setGenerationProgress(null);
    setGenerationStatus("idle");
    setGenerationError("");

    // Clean up any running progress simulation
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setGenerationProgress(null);
    setGenerationStatus("idle");
    setGenerationError("");

    // Clean up any running progress simulation
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  return {
    // State
    formData,
    isGenerating,
    generationProgress,
    generationStatus,
    generationError,

    // Handlers
    handleInputChange,
    handleGenerateWithAI,
    handleSubmit,
    handleClose,
    resetForm,

    // Mutation
    generateIdeaMutation,
  };
};
