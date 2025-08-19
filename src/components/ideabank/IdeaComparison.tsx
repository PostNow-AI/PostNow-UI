import type { CampaignIdea } from "@/lib/services/ideaBankService";
import { Sparkles } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  IdeaDiffViewer,
} from "../ui";

interface IdeaComparisonProps {
  showDiff: boolean;
  setShowDiff: (showDiff: boolean) => void;
  originalIdea: CampaignIdea | null;
  improvedIdea: CampaignIdea | null;
  setOriginalIdea: (idea: CampaignIdea | null) => void;
  setImprovedIdea: (idea: CampaignIdea | null) => void;
}

export const IdeaComparison = ({
  showDiff,
  setShowDiff,
  originalIdea,
  improvedIdea,
  setOriginalIdea,
  setImprovedIdea,
}: IdeaComparisonProps) => {
  return (
    <Dialog
      open={showDiff}
      onOpenChange={(open) => {
        if (!open) {
          setShowDiff(false);
          setOriginalIdea(null);
          setImprovedIdea(null);
        }
      }}
    >
      <DialogContent
        className="max-w-7xl max-h-[95vh] overflow-y-auto"
        style={{ width: "95vw", maxWidth: "1400px" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Melhoria Aplicada com Sucesso
          </DialogTitle>
          <DialogDescription>
            Compare as alterações feitas pela IA na sua campanha
          </DialogDescription>
        </DialogHeader>

        {originalIdea && improvedIdea && (
          <div className="space-y-6">
            <IdeaDiffViewer
              originalIdea={originalIdea}
              improvedIdea={improvedIdea}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDiff(false);
                  setOriginalIdea(null);
                  setImprovedIdea(null);
                }}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
