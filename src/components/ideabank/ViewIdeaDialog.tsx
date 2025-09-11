import type { CampaignIdea } from "@/lib/services/ideaBankService";
import { ideaToCampaignData } from "@/utils";
import { Edit } from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui";
import { JsonContentViewer } from "./JsonContentViewer";

interface ViewIdeaDialogProps {
  viewingIdea: CampaignIdea | null;
  setViewingIdea: (idea: CampaignIdea | null) => void;
  setEditingIdea: (idea: CampaignIdea | null) => void;
  setDeletingIdea: (idea: CampaignIdea | null) => void;
}

export const ViewIdeaDialog = ({
  viewingIdea,
  setViewingIdea,
  setEditingIdea,
  setDeletingIdea,
}: ViewIdeaDialogProps) => {
  return (
    <Dialog
      open={viewingIdea !== null}
      onOpenChange={(open) => {
        if (!open) setViewingIdea(null);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualizar Campanha</DialogTitle>
          <DialogDescription>
            Detalhes da campanha para visualização
          </DialogDescription>
        </DialogHeader>
        {viewingIdea && (
          <div className="space-y-4">
            {/* Campos básicos */}
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Título
                  {!viewingIdea.title && (
                    <Badge variant="destructive" className="text-xs">
                      Campo Vazio
                    </Badge>
                  )}
                </h4>
                <div
                  className={`p-3 rounded-md border ${
                    !viewingIdea.title
                      ? "bg-destructive/10 border-destructive"
                      : "bg-background"
                  }`}
                >
                  {viewingIdea.title || "Sem título"}
                </div>
                {!viewingIdea.title && (
                  <p className="text-sm text-destructive mt-2">
                    Este campo está vazio. Adicione um título para sua campanha.
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Descrição
                  {!viewingIdea.description && (
                    <Badge variant="destructive" className="text-xs">
                      Campo Vazio
                    </Badge>
                  )}
                </h4>
                <div
                  className={`p-3 rounded-md border ${
                    !viewingIdea.description
                      ? "bg-destructive/10 border-destructive"
                      : "bg-background"
                  }`}
                >
                  {viewingIdea.description || "Sem descrição"}
                </div>
                {!viewingIdea.description && (
                  <p className="text-sm text-destructive mt-2">
                    Este campo está vazio. Adicione uma descrição para sua
                    campanha.
                  </p>
                )}
              </div>
            </div>

            {/* Conteúdo JSON */}
            <div>
              <h4 className="font-medium mb-2">Conteúdo Estruturado</h4>
              <JsonContentViewer
                image={viewingIdea.image_url || undefined}
                content={
                  viewingIdea.content ||
                  JSON.stringify(ideaToCampaignData(viewingIdea), null, 2)
                }
                readOnly={true}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => {
                  setEditingIdea(viewingIdea);
                  setViewingIdea(null);
                }}
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                onClick={() => {
                  setDeletingIdea(viewingIdea);
                  setViewingIdea(null);
                }}
                variant="destructive"
              >
                Excluir
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
