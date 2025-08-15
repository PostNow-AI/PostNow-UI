import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import type { Campaign, CampaignIdea } from "@/hooks/useIdeaBank";
import { api } from "@/lib/api";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddIdeaDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ideaData: {
    title: string;
    description: string;
    content: string;
    platform: string;
    content_type: string;
    variation_type: string;
  }) => Promise<CampaignIdea>;
  onEditIdea?: (idea: CampaignIdea) => void;
}

export const AddIdeaDialog = ({
  campaign,
  isOpen,
  onClose,
  onSave,
  onEditIdea,
}: AddIdeaDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    platform: "",
    content_type: "",
    variation_type: "a",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.platform && formData.content_type) {
      setIsSubmitting(true);
      try {
        const createdIdea = await onSave(formData);

        // Reset form
        setFormData({
          title: "",
          description: "",
          content: "",
          platform: "",
          content_type: "",
          variation_type: "a",
        });

        // Close dialog
        onClose();

        // Show success message
        toast.success("Ideia criada com sucesso!");

        // Open the created idea in edit mode directly
        if (createdIdea && onEditIdea) {
          onEditIdea(createdIdea);
        }
      } catch (error) {
        console.error("Error saving idea:", error);
        toast.error("Erro ao criar ideia. Tente novamente.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGenerateWithAI = async () => {
    if (!campaign || !formData.platform || !formData.content_type) {
      return;
    }

    setIsGenerating(true);
    try {
      // Debug logging
      console.log("=== DEBUG: Sending data to AI ===");
      console.log("Form data:", formData);
      console.log("Campaign ID:", campaign.id);

      const requestData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        platform: formData.platform,
        content_type: formData.content_type,
        variation_type: formData.variation_type || "a",
      };

      console.log("Request data:", requestData);
      console.log("================================");

      // Call the AI generation endpoint
      const response = await api.post(
        `/api/v1/ideabank/campaigns/${campaign.id}/generate-idea/`,
        requestData
      );

      const generatedIdea = response.data;
      console.log("=== DEBUG: AI Response ===", generatedIdea);

      // Update form with AI-generated content
      setFormData((prev) => ({
        ...prev,
        title: generatedIdea.title || prev.title,
        description: generatedIdea.description || prev.description,
        content: generatedIdea.content || prev.content,
      }));

      toast.success(
        "Ideia gerada com IA com sucesso! Revise e ajuste conforme necessário."
      );
    } catch (error) {
      console.error("Error generating idea:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    // Only allow closing if not in the middle of an operation
    if (!isGenerating && !isSubmitting) {
      onClose();
    }
  };

  const platformOptions = [
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
  ];

  const contentTypeOptions = [
    { value: "post", label: "Post" },
    { value: "story", label: "Story" },
    { value: "reel", label: "Reel" },
    { value: "video", label: "Vídeo" },
    { value: "live", label: "Live" },
    { value: "carousel", label: "Carrossel" },
    { value: "custom", label: "Custom" },
  ];

  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-6xl"
        style={{ width: "50vw", maxWidth: "1400px" }}
      >
        <DialogHeader>
          <DialogTitle>Adicionar Nova Ideia</DialogTitle>
          <DialogDescription>
            Crie uma nova ideia para a campanha "{campaign.title}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Ideia</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Digite o título da ideia (opcional - será gerado pela IA)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva a ideia (opcional - será gerada pela IA)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Descreva o conteúdo da ideia (opcional - será gerado pela IA)"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => handleInputChange("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content_type">Tipo de Conteúdo *</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) =>
                  handleInputChange("content_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* AI Generation Section */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Geração com IA</Label>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              A IA irá gerar automaticamente o título, descrição e conteúdo da
              ideia baseado na campanha e nos parâmetros selecionados.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating || isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isGenerating ||
                isSubmitting ||
                !formData.platform ||
                !formData.content_type
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Gerar Ideia com IA"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
