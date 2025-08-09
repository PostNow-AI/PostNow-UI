/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Eye, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IdeaEditorProps {
  ideas: any[];
  onBack: () => void;
  onClose: () => void;
}

export const IdeaEditor = ({ ideas, onBack, onClose }: IdeaEditorProps) => {
  const [editingIdeas, setEditingIdeas] = useState(ideas);
  const [viewingIdea, setViewingIdea] = useState<any>(null);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [deletingIdea, setDeletingIdea] = useState<any>(null);
  const queryClient = useQueryClient();

  // Group ideas by platform
  const ideasByPlatform = editingIdeas.reduce(
    (acc: Record<string, any[]>, idea: any) => {
      const platform = idea.platform_display || idea.platform;
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push(idea);
      return acc;
    },
    {}
  );

  const updateIdeaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.patch(`/api/v1/ideabank/ideas/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ideia atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea-stats"] });
    },
    onError: (error: any, variables) => {
      toast.error(error.response?.data?.error || "Erro ao atualizar ideia");

      // Revert local state if backend update fails
      if (variables.data.status) {
        const originalIdeas = ideas; // Use original ideas to revert
        setEditingIdeas([...originalIdeas]);
      }
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/v1/ideabank/ideas/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ideia deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea-stats"] });
      setDeletingIdea(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Erro ao deletar ideia");
    },
  });

  const handleIdeaUpdate = (index: number, field: string, value: string) => {
    const updatedIdeas = [...editingIdeas];
    updatedIdeas[index] = { ...updatedIdeas[index], [field]: value };
    setEditingIdeas(updatedIdeas);
  };

  const handleSaveIdea = (idea: any) => {
    updateIdeaMutation.mutate({
      id: idea.id,
      data: {
        title: idea.title,
        description: idea.description,
        content: idea.content,
        status: idea.status,
      },
    });
  };

  const handleStatusChange = (idea: any, status: string) => {
    // Update local state immediately for better UX
    const updatedIdeas = editingIdeas.map((item) =>
      item.id === idea.id ? { ...item, status } : item
    );
    setEditingIdeas(updatedIdeas);

    // Then update the backend
    updateIdeaMutation.mutate({
      id: idea.id,
      data: { status },
    });
  };

  const handleDeleteIdea = (idea: any) => {
    deleteIdeaMutation.mutate(idea.id);
    // Remove from local state immediately
    const updatedIdeas = editingIdeas.filter((item) => item.id !== idea.id);
    setEditingIdeas(updatedIdeas);
  };

  const handleEditIdea = (idea: any) => {
    setEditingIdea({ ...idea });
  };

  const handleSaveEditIdea = () => {
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

    // Update local state
    const updatedIdeas = editingIdeas.map((item) =>
      item.id === editingIdea.id ? editingIdea : item
    );
    setEditingIdeas(updatedIdeas);
    setEditingIdea(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(ideasByPlatform).map(([platform, platformIdeas]) => (
          <div key={platform} className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <h2 className="text-xl font-semibold">{platform}</h2>
              <span className="text-sm text-muted-foreground">
                ({platformIdeas.length}{" "}
                {platformIdeas.length === 1 ? "ideia" : "ideias"})
              </span>
            </div>

            <div className="space-y-4">
              {platformIdeas.map((idea, platformIndex) => {
                const globalIndex = editingIdeas.findIndex(
                  (i) => i.id === idea.id || i === idea
                );
                return (
                  <Card key={idea.id || `${platform}-${platformIndex}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {idea.content_type_display || idea.content_type}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            Conteúdo para {platform}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={idea.status || "draft"}
                            onValueChange={(value) =>
                              handleStatusChange(idea, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Rascunho</SelectItem>
                              <SelectItem value="approved">Aprovado</SelectItem>
                              <SelectItem value="archived">
                                Arquivado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingIdea(idea)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditIdea(idea)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletingIdea(idea)}
                            title="Deletar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveIdea(idea)}
                            disabled={updateIdeaMutation.isPending}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${globalIndex}`}>Título</Label>
                        <Input
                          id={`title-${globalIndex}`}
                          value={idea.title}
                          onChange={(e) =>
                            handleIdeaUpdate(
                              globalIndex,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Título da ideia"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${globalIndex}`}>
                          Descrição
                        </Label>
                        <RichTextEditor
                          value={idea.description}
                          onChange={(value) =>
                            handleIdeaUpdate(
                              globalIndex,
                              "description",
                              value || ""
                            )
                          }
                          placeholder="Descrição breve da ideia"
                          height={120}
                          preview="edit"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`content-${globalIndex}`}>
                          Conteúdo
                        </Label>
                        <RichTextEditor
                          value={idea.content}
                          onChange={(value) =>
                            handleIdeaUpdate(
                              globalIndex,
                              "content",
                              value || ""
                            )
                          }
                          placeholder="Conteúdo detalhado da ideia"
                          height={300}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <Dialog
        open={viewingIdea !== null}
        onOpenChange={(open) => {
          if (!open) setViewingIdea(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewingIdea?.title || "Visualizar Ideia"}
            </DialogTitle>
            <DialogDescription>
              {viewingIdea?.platform_display || viewingIdea?.platform} •{" "}
              {viewingIdea?.content_type_display || viewingIdea?.content_type}
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
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingIdea.status}
                  onValueChange={(value) =>
                    setEditingIdea({ ...editingIdea, status: value })
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
              onClick={() => deletingIdea && handleDeleteIdea(deletingIdea)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
