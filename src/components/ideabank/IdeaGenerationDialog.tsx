import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useIdeaGeneration } from "@/hooks/useIdeaGeneration";
import type { CampaignIdea } from "@/lib/services/ideaBankService";
import { Loader2 } from "lucide-react";
import { IdeaEditor } from "./IdeaEditor";
import { IdeaGenerationForm } from "./IdeaGenerationForm";

interface IdeaGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdeaGenerationDialog = ({
  isOpen,
  onClose,
}: IdeaGenerationDialogProps) => {
  const {
    generationState,
    options,
    handleGenerateIdeas,
    handleClose: handleHookClose,
    handleBack,
    isGenerating,
  } = useIdeaGeneration();

  const handleClose = () => {
    handleHookClose();
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
          {generationState.ideas.length === 0 ? (
            generationState.status === "generating" ? (
              <div className="space-y-4">
                <ProgressBar
                  percentage={generationState.progress?.percentage || 0}
                  currentStep={generationState.progress?.currentStep || 0}
                  totalSteps={generationState.progress?.totalSteps || 8}
                  currentStepName={
                    generationState.progress?.currentStepName || ""
                  }
                  elapsedTime={generationState.progress?.elapsedTime || 0}
                  status={generationState.status}
                  error={generationState.error || undefined}
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
              ideas={generationState.ideas as unknown as CampaignIdea[]}
              onBack={handleBack}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
