// @ts-nocheck
/**
 * Dialog para regenerar post com feedback específico.
 * Component < 150 linhas (React Rule).
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Checkbox,
  Label,
  Textarea,
  Separator,
} from "@/components/ui";
import { RefreshCw } from "lucide-react";
import type { CampaignPost } from "../../types";

interface RegenerateFeedbackDialogProps {
  post: CampaignPost | null;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (postId: number, feedback: { items: string[]; note: string }) => void;
}

const FEEDBACK_OPTIONS = [
  { id: "text_too_long", label: "Texto muito longo" },
  { id: "text_too_short", label: "Texto muito curto" },
  { id: "tone_inadequate", label: "Tom inadequado" },
  { id: "cta_weak", label: "CTA fraco" },
  { id: "image_off_brand", label: "Imagem fora da marca" },
  { id: "style_inadequate", label: "Estilo visual inadequado" },
  { id: "too_generic", label: "Muito genérico" },
];

export const RegenerateFeedbackDialog = ({
  post,
  isOpen,
  onClose,
  onRegenerate,
}: RegenerateFeedbackDialogProps) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [userNote, setUserNote] = useState("");

  const handleToggleIssue = (issueId: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleRegenerate = () => {
    if (post) {
      onRegenerate(post.id, {
        items: selectedIssues,
        note: userNote,
      });
      setSelectedIssues([]);
      setUserNote("");
      onClose();
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            🔄 O que não gostou neste post?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Selecione os problemas:</Label>
            {FEEDBACK_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedIssues.includes(option.id)}
                  onCheckedChange={() => handleToggleIssue(option.id)}
                />
                <Label
                  htmlFor={option.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="note">Ou descreva o que quer mudar:</Label>
            <Textarea
              id="note"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Ex: Precisa ser mais direto e ter CTA mais forte no final"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleRegenerate}
              disabled={selectedIssues.length === 0 && !userNote.trim()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

