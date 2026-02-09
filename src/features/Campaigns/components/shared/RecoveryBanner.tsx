// @ts-nocheck
/**
 * Banner de recuperação de draft abandonado.
 * Descoberto como crítico nas simulações (75% recovery rate).
 */

import { Alert, AlertDescription, AlertTitle, Button } from "@/components/ui";
import { FileWarning, X } from "lucide-react";
import type { CampaignDraft } from "../../types";

interface RecoveryBannerProps {
  draft: CampaignDraft;
  onContinue: () => void;
  onDiscard: () => void;
}

export const RecoveryBanner = ({ draft, onContinue, onDiscard }: RecoveryBannerProps) => {
  const getProgressPercent = () => {
    const phases = ["briefing", "structure", "styles", "review", "approval"];
    const currentIndex = phases.indexOf(draft.current_phase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const progress = getProgressPercent();

  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
      <FileWarning className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="flex items-center justify-between">
        <span>Rascunho Recuperado</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onDiscard}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          Você tem uma campanha em progresso que não foi finalizada.
        </p>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Progresso:</span>
          <span>{Math.round(progress)}% completo</span>
          <span className="text-muted-foreground">
            (Fase: {draft.current_phase})
          </span>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button onClick={onContinue} size="sm">
            Continuar de Onde Parou
          </Button>
          <Button onClick={onDiscard} variant="outline" size="sm">
            Descartar Rascunho
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

