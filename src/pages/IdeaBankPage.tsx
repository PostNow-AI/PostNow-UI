import { CampaignIdeaList } from "@/components/ideabank/CampaignIdeaList";

import { IdeaEditor } from "@/components/ideabank/IdeaEditor";
import { IdeaGenerationDialog } from "@/components/ideabank/IdeaGenerationDialog";

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
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useIdeaBankPage } from "@/hooks/useIdeaBankPage";
import { Plus } from "lucide-react";

export const IdeaBankPage = () => {
  const {
    // State
    isDialogOpen,
    viewingIdea,
    deletingIdea,
    deletingCampaign,
    showEditor,
    editorIdeas,

    // Data
    campaigns,
    isLoading,

    // Handlers
    handleNewIdeaClick,
    handleEditIdea,
    handleDeleteIdea,
    handleEditCampaign,
    handleDeleteCampaign,
    handleConfirmDeleteIdea,
    handleConfirmDeleteCampaign,

    // Setters
    setIsDialogOpen,
    setViewingIdea,
    setShowEditor,
    setEditorIdeas,
    setDeletingIdea,
    setDeletingCampaign,
  } = useIdeaBankPage();

  const handleEditorBack = () => {
    setShowEditor(false);
    setEditorIdeas([]);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Banco de Ideias</h1>
          <p className="text-muted-foreground">
            Gerencie suas campanhas e ideias criativas
          </p>
        </div>
        <div className="flex items-center gap-4">
          {campaigns.length > 0 && (
            <Button
              onClick={handleNewIdeaClick}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova campanha
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {showEditor ? (
        <IdeaEditor ideas={editorIdeas} onBack={handleEditorBack} />
      ) : (
        <CampaignIdeaList
          campaigns={campaigns}
          isLoading={isLoading}
          onEditIdea={handleEditIdea}
          onDeleteIdea={handleDeleteIdea}
          onEditCampaign={handleEditCampaign}
          onDeleteCampaign={handleDeleteCampaign}
          handleNewIdeaClick={handleNewIdeaClick}
        />
      )}

      {/* Dialogs */}
      <IdeaGenerationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* Delete Idea Confirmation */}
      <AlertDialog
        open={!!deletingIdea}
        onOpenChange={() => setDeletingIdea(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a ideia "{deletingIdea?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteIdea}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Campaign Confirmation */}
      <AlertDialog
        open={!!deletingCampaign}
        onOpenChange={() => setDeletingCampaign(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a campanha "
              {deletingCampaign?.title}"? Esta ação não pode ser desfeita e
              excluirá todas as ideias associadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteCampaign}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Idea Dialog */}
      <Dialog open={!!viewingIdea} onOpenChange={() => setViewingIdea(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingIdea?.title}</DialogTitle>
            <DialogDescription>{viewingIdea?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Ideia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <strong>Plataforma:</strong>{" "}
                    {viewingIdea?.platform_display || viewingIdea?.platform}
                  </div>
                  <div>
                    <strong>Tipo de Conteúdo:</strong>{" "}
                    {viewingIdea?.content_type_display ||
                      viewingIdea?.content_type}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        viewingIdea?.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : viewingIdea?.status === "archived"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {viewingIdea?.status === "approved"
                        ? "Aprovada"
                        : viewingIdea?.status === "archived"
                        ? "Arquivada"
                        : "Rascunho"}
                    </span>
                  </div>
                  {viewingIdea?.content && (
                    <div>
                      <strong>Conteúdo:</strong>
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <pre className="whitespace-pre-wrap text-sm">
                          {viewingIdea.content}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
