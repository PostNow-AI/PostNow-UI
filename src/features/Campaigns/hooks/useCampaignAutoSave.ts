// @ts-nocheck
/**
 * Hook para auto-save de campanha em criação.
 * IMPORTANTE: Cada campanha tem seu próprio draft ID único.
 * Salva a cada 30 segundos automaticamente.
 */

import { useEffect, useState, useRef } from "react";
import { campaignService } from "../services";
import type { CampaignDraft } from "../types";

interface AutoSaveOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  draftId?: string; // ID único do draft (se não passar, gera um novo)
}

export const useCampaignAutoSave = (
  draft: Partial<CampaignDraft> | null,
  options: AutoSaveOptions = {}
) => {
  const { enabled = true, interval = 30000 } = options;
  
  // Gerar ID único para este draft (persiste durante toda a sessão)
  const draftIdRef = useRef<string>(
    options.draftId || `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  
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
          // Salvar com ID único do draft
          await campaignService.saveDraft({
            ...draft,
            draft_id: draftIdRef.current, // ID ÚNICO!
          });
          setLastSave(new Date());
          setHasChanges(false);
          console.log(`✅ Auto-save: ${draftIdRef.current}`);
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
    draftId: draftIdRef.current, // Expor ID do draft
  };
};

