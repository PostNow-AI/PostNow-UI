import { ApiKeyStatus } from "@/components/ideabank/ApiKeyStatus";
import { IdeaEditor } from "@/components/ideabank/IdeaEditor";
import { IdeaGenerationDialog } from "@/components/ideabank/IdeaGenerationDialog";
import { IdeaList } from "@/components/ideabank/IdeaList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useIdeaBank, type CampaignIdea } from "@/hooks/useIdeaBank";
import { api, geminiKeyApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const IdeaBankPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingIdea, setViewingIdea] = useState<CampaignIdea | null>(null);
  const [deletingIdea, setDeletingIdea] = useState<CampaignIdea | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorIdeas, setEditorIdeas] = useState<CampaignIdea[]>([]);

  const { ideas, isLoading } = useIdeaBank();
  const queryClient = useQueryClient();

  // Verificar status da chave da API
  const { data: keyStatus } = useQuery({
    queryKey: ["gemini-key-status"],
    queryFn: () => geminiKeyApi.getStatus(),
    retry: false,
  });

  const handleNewIdeaClick = () => {
    if (!keyStatus?.has_key) {
      toast.error(
        "Configure sua chave da API do Gemini para gerar novas ideias"
      );
      return;
    }
    setIsDialogOpen(true);
  };

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/ideabank/ideas/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
      toast.success("Ideia deletada com sucesso!");
      setDeletingIdea(null);
    },
    onError: () => {
      toast.error("Erro ao deletar ideia");
    },
  });

  // Handlers
  const handleView = (idea: CampaignIdea) => {
    setViewingIdea(idea);
  };

  const handleEdit = (idea: CampaignIdea) => {
    setEditorIdeas([idea]);
    setShowEditor(true);
  };

  const handleDelete = (idea: CampaignIdea) => {
    setDeletingIdea(idea);
  };

  const handleConfirmDelete = () => {
    if (!deletingIdea) return;
    deleteIdeaMutation.mutate(deletingIdea.id);
  };

  const handleEditorBack = () => {
    setShowEditor(false);
    setEditorIdeas([]);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditorIdeas([]);
  };

  // Se estiver mostrando o editor, renderizar apenas ele
  if (showEditor) {
    return (
      <IdeaEditor
        ideas={editorIdeas}
        onBack={handleEditorBack}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Ideias</h1>
          <p className="text-muted-foreground">
            Gerencie suas ideias de campanhas e use IA para criar novas
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ApiKeyStatus />
          {keyStatus?.has_key && (
            <Button
              onClick={handleNewIdeaClick}
              className="relative"
              title={
                !keyStatus?.has_key
                  ? "Configure sua chave da API do Gemini para gerar novas ideias"
                  : ""
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Ideia
            </Button>
          )}
        </div>
      </div>

      {/* Ideas List */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Ideias</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as suas ideias de campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IdeaList
            ideas={ideas}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Generation Dialog */}
      <IdeaGenerationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* View Modal */}
      <Dialog
        open={viewingIdea !== null}
        onOpenChange={(open) => {
          if (!open) setViewingIdea(null);
        }}
      >
        <DialogContent
          className="max-h-[90vh] overflow-hidden flex flex-col"
          style={{ width: "95vw", maxWidth: "1400px" }}
        >
          {" "}
          <DialogHeader>
            <DialogTitle>
              {viewingIdea?.title || "Visualizar Ideia"}
            </DialogTitle>
            <DialogDescription>
              {viewingIdea?.platform_display} •{" "}
              {viewingIdea?.content_type_display}
            </DialogDescription>
          </DialogHeader>
          {viewingIdea && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Descrição:</h4>
                <div className="p-3 bg-muted rounded-md">
                  <div className="prose prose-sm max-w-none">
                    {viewingIdea.description || "Sem descrição"}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Conteúdo:</h4>
                <div className="p-3 bg-muted rounded-md">
                  <div className="prose prose-sm max-w-none flex-1 overflow-y-auto max-h-[50vh] pr-2 whitespace-pre-wrap">
                    {viewingIdea.content || "Sem conteúdo"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={deletingIdea !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingIdea(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a ideia "{deletingIdea?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteIdeaMutation.isPending}
            >
              {deleteIdeaMutation.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Api Key Status */}
      <ApiKeyStatus />
    </div>
  );
};
