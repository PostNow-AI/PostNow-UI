import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
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
  const queryClient = useQueryClient();

  // Get available options
  const { data: options } = useQuery({
    queryKey: ["idea-options"],
    queryFn: async () => {
      const response = await api.get("/api/v1/ideabank/public/options/");
      return response.data;
    },
  });

  // Generate ideas mutation
  const generateIdeasMutation = useMutation({
    mutationFn: async (data: IdeaGenerationFormData) => {
      const response = await api.post("/api/v1/ideabank/generate/", data);
      return response.data;
    },
    onSuccess: (data) => {
      setGeneratedIdeas(data.ideas);
      setIsGenerating(false);
      toast.success("Ideias geradas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea-stats"] });
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
            <IdeaGenerationForm
              options={options}
              onSubmit={handleGenerateIdeas}
              isGenerating={isGenerating}
            />
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
