/**
 * Hook para auto-save de campanha em criação.
 * Salva a cada 30 segundos automaticamente.
 */

import { useEffect, useState } from "react";
import { campaignService } from "../services";
import type { CampaignDraft } from "../types";

interface AutoSaveOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
}

export const useCampaignAutoSave = (
  draft: Partial<CampaignDraft> | null,
  options: AutoSaveOptions = {}
) => {
  const { enabled = true, interval = 30000 } = options; // 30 segundos padrão
  const [lastSave, setLastSave] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!enabled || !draft || !hasChanges) {
      return;
    }

    const saveInterval = setInterval(async () => {
      if (hasChanges && !isSaving) {
        setIsSaving(true);
        
        try {
          await campaignService.saveDraft(draft);
          setLastSave(new Date());
          setHasChanges(false);
        } catch (error) {
          console.error("Auto-save failed:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, interval);

    return () => clearInterval(saveInterval);
  }, [draft, hasChanges, isSaving, enabled, interval]);

  const markAsChanged = () => {
    setHasChanges(true);
  };

  return {
    lastSave,
    isSaving,
    markAsChanged,
  };
};

