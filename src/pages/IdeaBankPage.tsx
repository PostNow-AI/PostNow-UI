import { ApiKeyStatus } from "@/components/ideabank/ApiKeyStatus";
import { IdeaEditor } from "@/components/ideabank/IdeaEditor";
import { IdeaGenerationDialog } from "@/components/ideabank/IdeaGenerationDialog";
import { IdeaList } from "@/components/ideabank/IdeaList";
import { SubscriptionOverlay } from "@/components/subscription/SubscriptionOverlay";
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
import { useSubscription } from "@/hooks/useSubscription";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const IdeaBankPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingIdea, setViewingIdea] = useState<CampaignIdea | null>(null);
  const [deletingIdea, setDeletingIdea] = useState<CampaignIdea | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorIdeas, setEditorIdeas] = useState<CampaignIdea[]>([]);
  const [showSubscriptionOverlay, setShowSubscriptionOverlay] = useState(false);

  const { ideas, isLoading } = useIdeaBank();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const queryClient = useQueryClient();

  // Mostrar overlay de assinatura se usuário não for assinante
  useEffect(() => {
    if (!subscriptionLoading && !isSubscribed) {
      setShowSubscriptionOverlay(true);
    }
  }, [isSubscribed, subscriptionLoading]);

  const handleNewIdeaClick = () => {
    if (!isSubscribed) {
      setShowSubscriptionOverlay(true);
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

  // Se estiver carregando, mostrar loading
  if (subscriptionLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">
              Verificando status de assinatura...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se não for assinante, mostrar tela restrita
  if (!isSubscribed) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <div className="h-10 w-10 text-muted-foreground">🔒</div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Acesso Restrito</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O Banco de Ideias é uma funcionalidade exclusiva para assinantes.
            Para acessar todas as funcionalidades do Sonora, entre em contato
            conosco.
          </p>
        </div>

        {/* Card de Assinatura */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              💳 Assine o Sonora
            </CardTitle>
            <CardDescription>
              Desbloqueie todas as funcionalidades e crie campanhas incríveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Geração Ilimitada</h4>
                  <p className="text-sm text-muted-foreground">
                    Use a IA para criar ideias
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Banco Completo</h4>
                  <p className="text-sm text-muted-foreground">
                    Salve suas campanhas
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowSubscriptionOverlay(true)}
              className="w-full"
            >
              💳 Ver Opções de Assinatura
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Overlay */}
        {showSubscriptionOverlay && (
          <SubscriptionOverlay
            onClose={() => setShowSubscriptionOverlay(false)}
          />
        )}
      </div>
    );
  }

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
          <Button onClick={handleNewIdeaClick}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Ideia
          </Button>
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

      {/* Subscription Overlay */}
      {showSubscriptionOverlay && (
        <SubscriptionOverlay
          onClose={() => setShowSubscriptionOverlay(false)}
        />
      )}
    </div>
  );
};
