import { useAddIdeaDialog } from "@/hooks/useAddIdeaDialog";
import { useUserCredits } from "@/hooks/useCredits";
import type { CampaignIdea } from "@/lib/services/ideaBankService";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { ProgressBar } from "../ui/progress-bar";
import { Textarea } from "../ui/textarea";

interface AddIdeaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditIdea: (idea: CampaignIdea) => void;
  campaignId: number;
}

const AddIdeaDialog: React.FC<AddIdeaDialogProps> = ({
  isOpen,
  onClose,
  onEditIdea,
  campaignId,
}) => {
  const {
    formData,
    isGenerating,
    generationProgress,
    generationStatus,
    generationError,
    handleInputChange,
    handleGenerateWithAI,
    handleSubmit,
    handleClose,
  } = useAddIdeaDialog(campaignId, onEditIdea);

  const { data: userCredits } = useUserCredits();

  const handleCloseDialog = () => {
    handleClose();
    onClose();
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    try {
      await handleSubmit(e);
      onClose();
    } catch {
      // Error is already handled by the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Ideia</DialogTitle>
        </DialogHeader>

        {generationStatus === "generating" && generationProgress ? (
          <div className="space-y-2">
            <ProgressBar
              percentage={generationProgress.percentage}
              currentStep={generationProgress.currentStep}
              totalSteps={generationProgress.totalSteps}
              currentStepName={generationProgress.currentStepName}
              elapsedTime={generationProgress.elapsedTime}
              status="generating"
            />
          </div>
        ) : (
          <>
            {/* Credit Balance Display */}
            {userCredits && (
              <div className="space-y-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Saldo de Créditos</h3>
                      <Badge variant="secondary">
                        {userCredits.balance.toFixed(2)} créditos
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Seu saldo atual para geração de conteúdo
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Platform Selection */}
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
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Type Selection */}
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
                    <SelectValue placeholder="Selecione o tipo de conteúdo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="carousel">Carrossel</SelectItem>
                    <SelectItem value="ad">Anúncio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Digite o título da ideia"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Digite a descrição da ideia"
                  rows={3}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Conteúdo
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Digite o conteúdo da ideia"
                  rows={5}
                />
              </div>

              {/* Error Display */}
              {generationStatus === "error" && generationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{generationError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isGenerating}
                >
                  Cancelar
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGenerateWithAI}
                    disabled={
                      isGenerating ||
                      !formData.platform ||
                      !formData.content_type
                    }
                  >
                    {isGenerating ? "Gerando..." : "Gerar com IA"}
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddIdeaDialog;
