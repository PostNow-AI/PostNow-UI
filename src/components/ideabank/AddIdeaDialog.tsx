import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { ProgressBar } from "../ui/progress-bar";
import { Textarea } from "../ui/textarea";

interface AddIdeaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<CampaignIdea>;
  onEditIdea: (idea: CampaignIdea) => void;
  campaignId: number;
}

interface FormData {
  title: string;
  description: string;
  content: string;
  platform: string;
  content_type: string;
  variation_type: string;
}

import type { CampaignIdea } from "@/hooks/useIdeaBank";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";

interface GenerationProgress {
  percentage: number;
  currentStep: number;
  totalSteps: number;
  currentStepName: string;
  elapsedTime: number;
}

const AddIdeaDialog: React.FC<AddIdeaDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  onEditIdea,
  campaignId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    content: "",
    platform: "instagram",
    content_type: "post",
    variation_type: "a",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] =
    useState<GenerationProgress | null>(null);
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "generating" | "complete" | "error"
  >("idle");
  const [generationError, setGenerationError] = useState<string>("");

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateWithAI = async () => {
    if (!formData.platform || !formData.content_type) {
      toast.error(
        "Selecione a plataforma e tipo de conteúdo antes de gerar com IA"
      );
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("generating");
    setGenerationProgress({
      percentage: 0,
      currentStep: 0,
      totalSteps: 10,
      currentStepName: "Inicializando...",
      elapsedTime: 0,
    });

    try {
      // Simulate progress updates (in real implementation, this would come from backend)
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev: GenerationProgress | null) => {
          if (!prev || prev.percentage >= 100) {
            clearInterval(progressInterval);
            return prev;
          }
          return {
            ...prev,
            percentage: Math.min(prev.percentage + 10, 100),
            currentStep: Math.min(prev.currentStep + 1, prev.totalSteps),
            currentStepName: getStepName(prev.currentStep + 1),
            elapsedTime: prev.elapsedTime + 1,
          };
        });
      }, 1000);

      // Call the backend to generate idea
      const response = await api.post(
        `/api/v1/ideabank/campaigns/${campaignId}/generate-idea/`,
        {
          platform: formData.platform,
          content_type: formData.content_type,
          variation_type: formData.variation_type,
          title: formData.title,
          description: formData.description,
          content: formData.content,
        }
      );

      clearInterval(progressInterval);

      const result = response.data;
      setGenerationStatus("complete");
      setGenerationProgress((prev: GenerationProgress | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          percentage: 100,
          currentStep: prev.totalSteps,
          currentStepName: "Geração concluída!",
          elapsedTime: prev.elapsedTime,
        };
      });

      // Auto-fill form with generated content
      if (result.idea) {
        setFormData((prev) => ({
          ...prev,
          title: result.idea.title || prev.title,
          description: result.idea.description || prev.description,
          content: result.idea.content || prev.content,
        }));
        if (result.idea && onEditIdea) {
          onEditIdea(result.idea);
        }
      }

      toast.success("Ideia gerada com sucesso!");
    } catch (error) {
      setGenerationStatus("error");
      setGenerationError(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
      toast.error("Erro ao gerar ideia com IA");
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepName = (step: number): string => {
    const steps = [
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
    return steps[step - 1] || "Processando...";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createdIdea = await onSave(formData);

      // Close dialog and show success message
      onClose();
      toast.success("Ideia criada com sucesso!");

      // Open the created idea in edit mode directly
      onEditIdea(createdIdea);
    } catch {
      toast.error("Erro ao criar ideia");
    }
  };

  const handleClose = () => {
    if (isGenerating) {
      toast.error("Aguarde a geração terminar antes de fechar");
      return;
    }
    onClose();
  };

  const resetGeneration = () => {
    setGenerationStatus("idle");
    setGenerationProgress(null);
    setGenerationError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Ideia</DialogTitle>
        </DialogHeader>

        {generationStatus === "idle" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título (opcional)
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Deixe vazio para gerar automaticamente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição (opcional)
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Deixe vazio para gerar automaticamente"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Conteúdo (opcional)
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Deixe vazio para gerar automaticamente"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Plataforma
                </label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) =>
                    handleInputChange("platform", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Conteúdo
                </label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value) =>
                    handleInputChange("content_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="carousel">Carrossel</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="custom">Customizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={
                  isGenerating || !formData.platform || !formData.content_type
                }
                className="flex-1"
                variant="outline"
              >
                {isGenerating ? "Gerando..." : "Gerar Ideia com IA"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <ProgressBar
              percentage={generationProgress?.percentage || 0}
              currentStep={generationProgress?.currentStep || 0}
              totalSteps={generationProgress?.totalSteps || 10}
              currentStepName={generationProgress?.currentStepName || ""}
              elapsedTime={generationProgress?.elapsedTime || 0}
              status={generationStatus}
              error={generationError}
            />

            {generationStatus === "complete" && (
              <div className="flex space-x-3">
                <Button
                  onClick={resetGeneration}
                  variant="outline"
                  className="flex-1"
                >
                  Gerar Nova Ideia
                </Button>
                <Button
                  onClick={() => setGenerationStatus("idle")}
                  className="flex-1"
                >
                  Voltar ao Formulário
                </Button>
              </div>
            )}

            {generationStatus === "error" && (
              <div className="flex space-x-3">
                <Button
                  onClick={resetGeneration}
                  variant="outline"
                  className="flex-1"
                >
                  Tentar Novamente
                </Button>
                <Button
                  onClick={() => setGenerationStatus("idle")}
                  className="flex-1"
                >
                  Voltar ao Formulário
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { AddIdeaDialog };
