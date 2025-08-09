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
  Input,
  Label,
  RichTextEditor,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useIdeaBank, type CampaignIdea } from "@/hooks/useIdeaBank";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Archive, FileText, Lightbulb, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const IdeaBankPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingIdea, setViewingIdea] = useState<CampaignIdea | null>(null);
  const [editingIdea, setEditingIdea] = useState<CampaignIdea | null>(null);
  const [deletingIdea, setDeletingIdea] = useState<CampaignIdea | null>(null);
  const { ideas, stats, isLoading } = useIdeaBank();
  const queryClient = useQueryClient();

  // Mutations
  const updateIdeaMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CampaignIdea>;
    }) => {
      const response = await api.patch(`/api/v1/ideabank/ideas/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea-stats"] });
      toast.success("Ideia atualizada com sucesso!");
      setEditingIdea(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar ideia");
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/ideabank/ideas/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea-stats"] });
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
    setEditingIdea(idea);
  };

  const handleDelete = (idea: CampaignIdea) => {
    setDeletingIdea(idea);
  };

  const handleSaveEdit = () => {
    if (!editingIdea) return;

    updateIdeaMutation.mutate({
      id: editingIdea.id,
      data: {
        title: editingIdea.title,
        description: editingIdea.description,
        content: editingIdea.content,
        status: editingIdea.status,
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingIdea) return;
    deleteIdeaMutation.mutate(deletingIdea.id);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            Banco de Ideias
          </h1>
          <p className="text-muted-foreground">
            Gere ideias criativas para suas campanhas usando IA
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Gerar Nova Ideia
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Ideias
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_ideas || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.draft_ideas || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.approved_ideas || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivadas</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.archived_ideas || 0}
            </div>
          </CardContent>
        </Card>
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
          className="max-h-[90vh]   overflow-hidden flex flex-col"
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

      {/* Edit Modal */}
      <Dialog
        open={editingIdea !== null}
        onOpenChange={(open) => {
          if (!open) setEditingIdea(null);
        }}
      >
        <DialogContent
          className="max-h-[90vh] overflow-hidden flex flex-col"
          style={{ width: "95vw", maxWidth: "1400px" }}
        >
          <DialogHeader>
            <DialogTitle>Editar Ideia</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na sua ideia
            </DialogDescription>
          </DialogHeader>
          {editingIdea && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editingIdea.title}
                  onChange={(e) =>
                    setEditingIdea({ ...editingIdea, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <RichTextEditor
                  value={editingIdea.description}
                  onChange={(value) =>
                    setEditingIdea({ ...editingIdea, description: value || "" })
                  }
                  height={150}
                  placeholder="Descrição da ideia..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Conteúdo</Label>
                <RichTextEditor
                  value={editingIdea.content}
                  onChange={(value) =>
                    setEditingIdea({ ...editingIdea, content: value || "" })
                  }
                  height={300}
                  placeholder="Conteúdo detalhado da ideia..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingIdea.status}
                  onValueChange={(value: "draft" | "approved" | "archived") =>
                    setEditingIdea({ ...editingIdea, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
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
                  onClick={handleSaveEdit}
                  disabled={updateIdeaMutation.isPending}
                >
                  {updateIdeaMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
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
    </div>
  );
};
