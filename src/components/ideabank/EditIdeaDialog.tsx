import type { CampaignIdea } from "@/lib/services/ideaBankService";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Save } from "lucide-react";
import {
  Badge,
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
} from "../ui";
import { JsonContentViewer } from "./JsonContentViewer";

interface EditIdeaDialogProps {
  editingIdea: CampaignIdea | null;
  setEditingIdea: (idea: CampaignIdea | null) => void;
  handleSaveEditIdea: () => void;
  updateIdeaMutation: UseMutationResult<
    CampaignIdea,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AxiosError<{ error: string }, any>,
    { id: number; data: Partial<CampaignIdea> },
    unknown
  >;
}

export const EditIdeaDialog = ({
  editingIdea,
  setEditingIdea,
  handleSaveEditIdea,
  updateIdeaMutation,
}: EditIdeaDialogProps) => {
  return (
    <Dialog
      open={editingIdea !== null}
      onOpenChange={(open) => {
        if (!open) setEditingIdea(null);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ideia</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias na sua ideia
          </DialogDescription>
        </DialogHeader>
        {editingIdea && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Título
                {!editingIdea.title && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Campo Vazio
                  </Badge>
                )}
              </Label>
              <Input
                id="edit-title"
                value={editingIdea.title || ""}
                onChange={(e) =>
                  setEditingIdea({ ...editingIdea, title: e.target.value })
                }
                className={
                  !editingIdea.title
                    ? "border-destructive bg-destructive/5"
                    : ""
                }
              />
              {!editingIdea.title && (
                <p className="text-sm text-destructive">
                  Este campo está vazio. Adicione um título para sua ideia.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">
                Descrição
                {!editingIdea.description && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Campo Vazio
                  </Badge>
                )}
              </Label>
              <Textarea
                id="edit-description"
                value={editingIdea.description || ""}
                onChange={(e) =>
                  setEditingIdea({
                    ...editingIdea,
                    description: e.target.value,
                  })
                }
                className={`min-h-[100px] ${
                  !editingIdea.description
                    ? "border-destructive bg-destructive/5"
                    : ""
                }`}
              />
              {!editingIdea.description && (
                <p className="text-sm text-destructive">
                  Este campo está vazio. Adicione uma descrição para sua ideia.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Conteúdo </Label>
              <JsonContentViewer
                image={editingIdea.image_url || undefined}
                content={editingIdea.content || ""}
                readOnly={false}
                onContentChange={(newContent) =>
                  setEditingIdea({ ...editingIdea, content: newContent })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editingIdea.status}
                onValueChange={(value) =>
                  setEditingIdea({
                    ...editingIdea,
                    status: value as "draft" | "approved" | "archived",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingIdea(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEditIdea}
                disabled={updateIdeaMutation.isPending}
              >
                {updateIdeaMutation.isPending ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
