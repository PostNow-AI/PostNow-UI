/**
 * Schedule Post Dialog Component
 *
 * Modal for scheduling a post to Instagram.
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Instagram, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInstagramAccounts } from "../hooks/useInstagramAccounts";
import { useScheduledPostMutations } from "../hooks/useScheduledPostMutations";
import type { MediaType, ScheduledPostCreateData } from "../types";
import { DateTimePicker } from "./DateTimePicker";
import { InstagramAccountSelector } from "./InstagramAccountSelector";

interface SchedulePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Pre-fill from IdeaBank
  initialCaption?: string;
  initialImageUrl?: string;
  postIdeaId?: number;
  onSuccess?: () => void;
}

const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: "IMAGE", label: "Imagem" },
  { value: "CAROUSEL", label: "Carrossel" },
  { value: "REELS", label: "Reels" },
  { value: "STORY", label: "Story" },
];

export function SchedulePostDialog({
  open,
  onOpenChange,
  initialCaption = "",
  initialImageUrl,
  postIdeaId,
  onSuccess,
}: SchedulePostDialogProps) {
  const { connectedAccounts, isLoading: isLoadingAccounts } =
    useInstagramAccounts();
  const { createScheduledPostAsync, isCreating } = useScheduledPostMutations();

  // Form state
  const [accountId, setAccountId] = useState<number | undefined>();
  const [caption, setCaption] = useState(initialCaption);
  const [mediaType, setMediaType] = useState<MediaType>("IMAGE");
  const [mediaUrls, setMediaUrls] = useState<string[]>(
    initialImageUrl ? [initialImageUrl] : []
  );
  const [scheduledFor, setScheduledFor] = useState<Date | undefined>();

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setCaption(initialCaption);
      setMediaUrls(initialImageUrl ? [initialImageUrl] : []);
      setMediaType("IMAGE");
      setScheduledFor(undefined);
      setErrors({});

      // Auto-select first account if only one
      if (connectedAccounts.length === 1) {
        setAccountId(connectedAccounts[0].id);
      }
    }
  }, [open, initialCaption, initialImageUrl, connectedAccounts]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!accountId) {
      newErrors.account = "Selecione uma conta Instagram";
    }
    if (!caption.trim()) {
      newErrors.caption = "A legenda e obrigatoria";
    }
    if (caption.length > 2200) {
      newErrors.caption = `A legenda deve ter no maximo 2200 caracteres (atual: ${caption.length})`;
    }
    if (mediaUrls.length === 0) {
      newErrors.media = "Adicione pelo menos uma imagem ou video";
    }
    if (!scheduledFor) {
      newErrors.schedule = "Selecione a data e hora";
    }
    if (scheduledFor && scheduledFor <= new Date()) {
      newErrors.schedule = "A data deve ser no futuro";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const data: ScheduledPostCreateData = {
      instagram_account_id: accountId!,
      caption,
      media_type: mediaType,
      media_urls: mediaUrls,
      scheduled_for: scheduledFor!.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...(postIdeaId && { post_idea_id: postIdeaId }),
    };

    try {
      await createScheduledPostAsync(data);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Error handled by mutation
    }
  };

  const captionCount = caption.length;
  const captionLimit = 2200;
  const isOverLimit = captionCount > captionLimit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Agendar Post no Instagram
          </DialogTitle>
          <DialogDescription>
            Programe a publicacao automatica do seu conteudo no Instagram.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-6 py-4">
          {/* Account Selector */}
          <div className="space-y-2">
            <Label>Conta Instagram *</Label>
            {isLoadingAccounts ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando contas...
              </div>
            ) : (
              <InstagramAccountSelector
                accounts={connectedAccounts}
                value={accountId}
                onChange={setAccountId}
                hasError={!!errors.account}
              />
            )}
            {errors.account && (
              <p className="text-sm text-destructive">{errors.account}</p>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Legenda *</Label>
              <span
                className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
              >
                {captionCount}/{captionLimit}
              </span>
            </div>
            <Textarea
              placeholder="Digite a legenda do post..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={6}
              className={errors.caption ? "border-destructive" : ""}
            />
            {errors.caption && (
              <p className="text-sm text-destructive">{errors.caption}</p>
            )}
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <Label>Tipo de Midia</Label>
            <Select
              value={mediaType}
              onValueChange={(val) => setMediaType(val as MediaType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Media Preview */}
          {mediaUrls.length > 0 && (
            <div className="space-y-2">
              <Label>Midia</Label>
              <div className="grid grid-cols-3 gap-2">
                {mediaUrls.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md overflow-hidden bg-muted"
                  >
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {errors.media && (
                <p className="text-sm text-destructive">{errors.media}</p>
              )}
            </div>
          )}

          {/* Schedule Date/Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data e Hora de Publicacao *
            </Label>
            <DateTimePicker
              value={scheduledFor}
              onChange={setScheduledFor}
              minDate={new Date()}
              hasError={!!errors.schedule}
            />
            {errors.schedule && (
              <p className="text-sm text-destructive">{errors.schedule}</p>
            )}
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agendando...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Post
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
