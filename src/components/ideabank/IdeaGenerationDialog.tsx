import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { ProgressBar } from "@/components/ui/progress-bar";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { IdeaEditor } from "./IdeaEditor";
import {
  IdeaGenerationForm,
  type IdeaGenerationFormData,
} from "./IdeaGenerationForm";

interface GeneratedIdea {
  id: number;
  title: string;
  description: string;
  content: string;
  platform: string;
  content_type: string;
  status: string;
  variation_type?: string;
  headline?: string;
  copy?: string;
  cta?: string;
  hashtags?: string[];
  visual_description?: string;
  color_composition?: string;
}

interface IdeaGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdeaGenerationDialog = ({
  isOpen,
  onClose,
}: IdeaGenerationDialogProps) => {
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{
    percentage: number;
    currentStep: number;
    totalSteps: number;
    currentStepName: string;
    elapsedTime: number;
  } | null>(null);
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "generating" | "complete" | "error"
  >("idle");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get available options
  const { data: options } = useQuery({
    queryKey: ["idea-options"],
    queryFn: async () => {
      const response = await api.get("/api/v1/ideabank/public/options/");
      return response.data;
    },
  });

  // Generate ideas mutation with progress tracking
  const generateIdeasMutation = useMutation({
    mutationFn: async (data: IdeaGenerationFormData) => {
      setGenerationStatus("generating");
      setGenerationError(null);

      // Simulate progress updates (since backend doesn't stream)
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (!prev) {
            return {
              percentage: 0,
              currentStep: 0,
              totalSteps: 8,
              currentStepName: "Iniciando geração...",
              elapsedTime: 0,
            };
          }

          const newStep = Math.min(prev.currentStep + 1, prev.totalSteps);
          const newPercentage = Math.round((newStep / prev.totalSteps) * 100);

          const stepNames = [
            "Iniciando geração...",
            "Analisando parâmetros da campanha...",
            "Criando estrutura da campanha...",
            "Gerando primeira ideia (A)...",
            "Gerando segunda ideia (B)...",
            "Gerando terceira ideia (C)...",
            "Finalizando e salvando...",
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
      }, 800);

      try {
        const response = await api.post(
          "/api/v1/ideabank/campaigns/generate/",
          data
        );

        clearInterval(progressInterval);
        setGenerationStatus("complete");
        setGenerationProgress((prev) =>
          prev
            ? {
                ...prev,
                percentage: 100,
                currentStep: prev.totalSteps,
                currentStepName: "Concluído!",
              }
            : null
        );

        return response.data;
      } catch (error) {
        clearInterval(progressInterval);
        setGenerationStatus("error");
        setGenerationError(
          error instanceof Error ? error.message : "Erro desconhecido"
        );
        throw error;
      }
    },
    onSuccess: (data) => {
      setGeneratedIdeas(data.ideas);
      setIsGenerating(false);
      toast.success("Campanha e 3 ideias geradas com sucesso!");
      // Refresh the campaigns-with-ideas query to show the new campaign
      queryClient.invalidateQueries({ queryKey: ["campaigns-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
    },
    onError: (error: unknown) => {
      setIsGenerating(false);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao gerar ideias";
      toast.error(errorMessage);
    },
  });

  const handleGenerateIdeas = (formData: IdeaGenerationFormData) => {
    setIsGenerating(true);
    generateIdeasMutation.mutate(formData);
  };

  const handleClose = () => {
    setGeneratedIdeas([]);
    setGenerationStatus("idle");
    setGenerationProgress(null);
    setGenerationError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-h-[90vh] overflow-hidden flex flex-col"
        style={{ width: "95vw", maxWidth: "1400px" }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5" />
            Gerar Ideias de Campanha
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros para gerar ideias criativas usando IA
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {generatedIdeas.length === 0 ? (
            generationStatus === "generating" ? (
              <div className="space-y-4">
                <ProgressBar
                  percentage={generationProgress?.percentage || 0}
                  currentStep={generationProgress?.currentStep || 0}
                  totalSteps={generationProgress?.totalSteps || 8}
                  currentStepName={generationProgress?.currentStepName || ""}
                  elapsedTime={generationProgress?.elapsedTime || 0}
                  status={generationStatus}
                  error={generationError || undefined}
                />
              </div>
            ) : (
              <IdeaGenerationForm
                options={options}
                onSubmit={handleGenerateIdeas}
                isGenerating={isGenerating}
              />
            )
          ) : (
            <IdeaEditor
              ideas={generatedIdeas}
              onBack={() => setGeneratedIdeas([])}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
