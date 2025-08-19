import type { ImprovementProgress } from "@/hooks/useIdeaEditor";
import type {
  CampaignIdea,
  ImprovementResponse,
} from "@/lib/services/ideaBankService";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2, Sparkles } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Label,
  ProgressBar,
  Textarea,
} from "../ui";

interface AiImprovementProps {
  improvingIdea: CampaignIdea | null;
  setImprovingIdea: (idea: CampaignIdea | null) => void;
  improvementPrompt: string;
  setImprovementPrompt: (prompt: string) => void;
  improvementStatus: "idle" | "generating" | "error" | "complete";
  setImprovementStatus: (
    status: "idle" | "generating" | "error" | "complete"
  ) => void;
  improvementProgress: ImprovementProgress | null;
  setImprovementProgress: (progress: ImprovementProgress | null) => void;
  improvementError: string | null;
  setImprovementError: (error: string | null) => void;
  improveIdeaMutation: UseMutationResult<
    ImprovementResponse,
    AxiosError<{ error: string }>,
    { ideaId: number; improvementPrompt: string }
  >;
  handleSubmitImprovement: () => void;
}

export const AiImprovement = ({
  improvingIdea,
  setImprovingIdea,
  improvementPrompt,
  setImprovementPrompt,
  improvementStatus,
  setImprovementStatus,
  improvementProgress,
  setImprovementProgress,
  improvementError,
  setImprovementError,
  improveIdeaMutation,
  handleSubmitImprovement,
}: AiImprovementProps) => {
  return (
    <Dialog
      open={improvingIdea !== null}
      onOpenChange={(open) => {
        if (!open) {
          setImprovingIdea(null);
          setImprovementPrompt("");
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Melhorar Campanha com IA
          </DialogTitle>
          <DialogDescription>
            Descreva como você gostaria que a IA melhorasse esta campanha. Seja
            específico sobre o que você quer aprimorar.
          </DialogDescription>
        </DialogHeader>

        {improvingIdea && (
          <div className="space-y-4">
            {improvementStatus === "generating" ? (
              <div className="space-y-4">
                <ProgressBar
                  percentage={improvementProgress?.percentage || 0}
                  currentStep={improvementProgress?.currentStep || 0}
                  totalSteps={improvementProgress?.totalSteps || 6}
                  currentStepName={improvementProgress?.currentStepName || ""}
                  elapsedTime={improvementProgress?.elapsedTime || 0}
                  status={improvementStatus}
                  error={improvementError || undefined}
                />
              </div>
            ) : (
              <>
                {/* Current Idea Preview */}
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Campanha Atual:
                  </h4>
                  <h5 className="font-medium">{improvingIdea.title}</h5>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {improvingIdea.description}
                  </p>
                </div>

                {/* Improvement Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="improvement-prompt">
                    Como a IA pode melhorar esta campanha?
                  </Label>
                  <Textarea
                    id="improvement-prompt"
                    placeholder="Ex: Tornar o conteúdo mais envolvente, adicionar mais detalhes sobre o produto, criar um call-to-action mais persuasivo, adaptar para um tom mais formal..."
                    value={improvementPrompt}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setImprovementPrompt(e.target.value)
                    }
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImprovingIdea(null);
                      setImprovementPrompt("");
                      setImprovementStatus("idle");
                      setImprovementProgress(null);
                      setImprovementError(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmitImprovement}
                    disabled={
                      improveIdeaMutation.isPending || !improvementPrompt.trim()
                    }
                    className="min-w-32"
                  >
                    {improveIdeaMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Melhorando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Melhorar
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
