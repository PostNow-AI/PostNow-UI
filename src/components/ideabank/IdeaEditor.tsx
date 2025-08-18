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
  Badge,
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
  IdeaDiffViewer,
  Input,
  Label,
  ProgressBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Loader2, Save, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JsonContentViewer } from "./JsonContentViewer";

interface IdeaEditorProps {
  ideas: any[];
  onBack: () => void;
  onClose: () => void;
}

// Função para detectar se uma ideia é uma campanha
const isCampaignIdea = (idea: any): boolean => {
  try {
    if (!idea.content) return false;
    const content = JSON.parse(idea.content);
    return content.variacao_a && content.variacao_b && content.variacao_c;
  } catch {
    return false;
  }
};

// Função para converter qualquer ideia em dados de campanha
const ideaToCampaignData = (idea: any) => {
  try {
    // Se já é uma campanha, retorna os dados
    if (isCampaignIdea(idea)) {
      const content = JSON.parse(idea.content);
      return {
        plataforma: content.plataforma || idea.platform,
        tipo_conteudo: content.tipo_conteudo || idea.content_type,
        titulo_principal: content.titulo_principal || idea.title,
        variacao_a: content.variacao_a || {},
        variacao_b: content.variacao_b || {},
        variacao_c: content.variacao_c || {},
        estrategia_implementacao:
          content.estrategia_implementacao || idea.description,
        metricas_sucesso: content.metricas_sucesso || [],
        proximos_passos: content.proximos_passos || [],
      };
    }

    // Se não é uma campanha, cria uma estrutura de campanha a partir da ideia
    const baseVariation = {
      headline: idea.headline || idea.title,
      copy: idea.copy || idea.description,
      cta: idea.cta || "Clique para saber mais!",
      hashtags: idea.hashtags || ["#ideia", "#conteudo"],
      visual_description: idea.visual_description || "Descrição visual padrão",
      color_composition: idea.color_composition || "Paleta de cores padrão",
    };

    return {
      plataforma: idea.platform || "instagram",
      tipo_conteudo: idea.content_type || "post",
      titulo_principal: idea.title || "Ideia",
      variacao_a: { ...baseVariation },
      variacao_b: { ...baseVariation },
      variacao_c: { ...baseVariation },
      estrategia_implementacao:
        idea.description || "Implementar conforme planejado",
      metricas_sucesso: ["Engajamento", "Alcance", "Conversões"],
      proximos_passos: ["Monitorar resultados", "Otimizar campanha"],
    };
  } catch {
    // Fallback para ideias sem conteúdo estruturado
    const baseVariation = {
      headline: idea.title || "Ideia",
      copy: idea.description || "Descrição da ideia",
      cta: "Clique para saber mais!",
      hashtags: ["#ideia", "#conteudo"],
      visual_description: "Descrição visual padrão",
      color_composition: "Paleta de cores padrão",
    };

    return {
      plataforma: idea.platform || "instagram",
      tipo_conteudo: idea.content_type || "post",
      titulo_principal: idea.title || "Ideia",
      variacao_a: { ...baseVariation },
      variacao_b: { ...baseVariation },
      variacao_c: { ...baseVariation },
      estrategia_implementacao:
        idea.description || "Implementar conforme planejado",
      metricas_sucesso: ["Engajamento", "Alcance", "Conversões"],
      proximos_passos: ["Monitorar resultados", "Otimizar campanha"],
    };
  }
};

export const IdeaEditor = ({ ideas, onBack, onClose }: IdeaEditorProps) => {
  const [editingIdeas, setEditingIdeas] = useState(ideas);
  const [viewingIdea, setViewingIdea] = useState<any>(null);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [deletingIdea, setDeletingIdea] = useState<any>(null);
  const [improvingIdea, setImprovingIdea] = useState<any>(null);
  const [improvementPrompt, setImprovementPrompt] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [originalIdea, setOriginalIdea] = useState<any>(null);
  const [improvedIdea, setImprovedIdea] = useState<any>(null);
  const [improvementProgress, setImprovementProgress] = useState<{
    percentage: number;
    currentStep: number;
    totalSteps: number;
    currentStepName: string;
    elapsedTime: number;
  } | null>(null);
  const [improvementStatus, setImprovementStatus] = useState<
    "idle" | "generating" | "complete" | "error"
  >("idle");
  const [improvementError, setImprovementError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Sincronizar o estado local com as props quando elas mudarem
  useEffect(() => {
    if (ideas && ideas.length > 0) {
      setEditingIdeas(ideas);
    }
  }, [ideas]);

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
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
      setDeletingIdea(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Erro ao deletar ideia");
    },
  });

  const improveIdeaMutation = useMutation({
    mutationFn: async ({
      ideaId,
      improvementPrompt,
    }: {
      ideaId: number;
      improvementPrompt: string;
    }) => {
      setImprovementStatus("generating");
      setImprovementError(null);

      // Simulate progress updates for improvement
      const progressInterval = setInterval(() => {
        setImprovementProgress((prev) => {
          if (!prev) {
            return {
              percentage: 0,
              currentStep: 0,
              totalSteps: 6,
              currentStepName: "Iniciando melhoria...",
              elapsedTime: 0,
            };
          }

          const newStep = Math.min(prev.currentStep + 1, prev.totalSteps);
          const newPercentage = Math.round((newStep / prev.totalSteps) * 100);

          const stepNames = [
            "Iniciando melhoria...",
            "Analisando ideia atual...",
            "Processando prompt de melhoria...",
            "Gerando conteúdo melhorado...",
            "Validando e otimizando...",
            "Concluído!",
          ];

          return {
            percentage: newPercentage,
            currentStep: newStep,
            totalSteps: prev.totalSteps,
            currentStepName: stepNames[newStep - 1] || "Processando...",
            elapsedTime: prev.elapsedTime + 1,
          };
        });
      }, 600);

      try {
        const response = await api.post(
          `/api/v1/ideabank/ideas/${ideaId}/improve/`,
          {
            improvement_prompt: improvementPrompt,
          }
        );

        clearInterval(progressInterval);
        setImprovementStatus("complete");
        setImprovementProgress((prev) =>
          prev
            ? {
                ...prev,
                percentage: 100,
                currentStep: prev.totalSteps,
                currentStepName: "Concluído!",
              }
            : null
        );

        return response.data;
      } catch (error) {
        clearInterval(progressInterval);
        setImprovementStatus("error");
        setImprovementError(
          error instanceof Error ? error.message : "Erro desconhecido"
        );
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
      toast.success("Ideia melhorada com sucesso!");

      // Store original and improved versions for comparison
      setOriginalIdea({
        title: improvingIdea?.title,
        description: improvingIdea?.description,
        content: improvingIdea?.content,
      });
      setImprovedIdea({
        title: data.idea?.title || data.title,
        description: data.idea?.description || data.description,
        content: data.idea?.content || data.content,
      });

      // Update local state with improved idea
      setEditingIdeas((prev) =>
        prev.map((idea) =>
          idea.id === improvingIdea?.id
            ? { ...idea, ...(data.idea || data), status: "draft" }
            : idea
        )
      );

      setImprovingIdea(null);
      setImprovementPrompt("");
      setShowDiff(true);
      setImprovementStatus("idle");
      setImprovementProgress(null);
      setImprovementError(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || "Erro ao melhorar ideia";
      toast.error(errorMessage);
      setImprovementStatus("idle");
      setImprovementProgress(null);
      setImprovementError(null);
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

  const handleImproveIdea = (idea: any) => {
    setImprovingIdea(idea);
    setImprovementPrompt("");
  };

  const handleSubmitImprovement = () => {
    if (!improvingIdea || !improvementPrompt.trim()) {
      toast.error("Por favor, descreva como a IA pode melhorar a ideia");
      return;
    }

    improveIdeaMutation.mutate({
      ideaId: improvingIdea.id,
      improvementPrompt: improvementPrompt.trim(),
    });
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
                            onClick={() => handleImproveIdea(idea)}
                            title="Melhorar com IA"
                          >
                            <Sparkles className="h-4 w-4" />
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
                        <Label htmlFor={`title-${globalIndex}`}>
                          Título
                          {!idea.title && (
                            <Badge
                              variant="destructive"
                              className="ml-2 text-xs"
                            >
                              Campo Vazio
                            </Badge>
                          )}
                        </Label>
                        <Input
                          id={`title-${globalIndex}`}
                          value={idea.title || ""}
                          onChange={(e) =>
                            handleIdeaUpdate(
                              globalIndex,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Título da ideia"
                          className={
                            !idea.title
                              ? "border-destructive bg-destructive/5"
                              : ""
                          }
                        />
                        {!idea.title && (
                          <p className="text-sm text-destructive">
                            Este campo está vazio. Adicione um título para sua
                            ideia.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${globalIndex}`}>
                          Descrição
                          {!idea.description && (
                            <Badge
                              variant="destructive"
                              className="ml-2 text-xs"
                            >
                              Campo Vazio
                            </Badge>
                          )}
                        </Label>
                        <Textarea
                          id={`description-${globalIndex}`}
                          value={idea.description || ""}
                          onChange={(e) =>
                            handleIdeaUpdate(
                              globalIndex,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Descrição breve da ideia"
                          className={`min-h-[100px] ${
                            !idea.description
                              ? "border-destructive bg-destructive/5"
                              : ""
                          }`}
                        />
                        {!idea.description && (
                          <p className="text-sm text-destructive">
                            Este campo está vazio. Adicione uma descrição para
                            sua ideia.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`content-${globalIndex}`}>
                          Conteúdo
                        </Label>
                        <JsonContentViewer
                          content={idea.content || ""}
                          readOnly={false}
                          onContentChange={(newContent) =>
                            handleIdeaUpdate(globalIndex, "content", newContent)
                          }
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
                    Este campo está vazio. Adicione uma descrição para sua
                    ideia.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Conteúdo </Label>
                <JsonContentViewer
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

      {/* AI Improvement Modal */}
      <Dialog
        open={improvingIdea !== null}
        onOpenChange={(open) => {
          if (!open) {
            setImprovingIdea(null);
            setImprovementPrompt("");
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Melhorar Campanha com IA
            </DialogTitle>
            <DialogDescription>
              Descreva como você gostaria que a IA melhorasse esta campanha.
              Seja específico sobre o que você quer aprimorar.
            </DialogDescription>
          </DialogHeader>

          {improvingIdea && (
            <div className="space-y-4">
              {improvementStatus === "generating" ? (
                <div className="space-y-4">
                  <ProgressBar
                    percentage={improvementProgress?.percentage || 0}
                    currentStep={improvementProgress?.currentStep || 0}
                    totalSteps={improvementProgress?.totalSteps || 6}
                    currentStepName={improvementProgress?.currentStepName || ""}
                    elapsedTime={improvementProgress?.elapsedTime || 0}
                    status={improvementStatus}
                    error={improvementError || undefined}
                  />
                </div>
              ) : (
                <>
                  {/* Current Idea Preview */}
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Campanha Atual:
                    </h4>
                    <h5 className="font-medium">{improvingIdea.title}</h5>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {improvingIdea.description}
                    </p>
                  </div>

                  {/* Improvement Prompt */}
                  <div className="space-y-2">
                    <Label htmlFor="improvement-prompt">
                      Como a IA pode melhorar esta campanha?
                    </Label>
                    <Textarea
                      id="improvement-prompt"
                      placeholder="Ex: Tornar o conteúdo mais envolvente, adicionar mais detalhes sobre o produto, criar um call-to-action mais persuasivo, adaptar para um tom mais formal..."
                      value={improvementPrompt}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setImprovementPrompt(e.target.value)
                      }
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setImprovingIdea(null);
                        setImprovementPrompt("");
                        setImprovementStatus("idle");
                        setImprovementProgress(null);
                        setImprovementError(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSubmitImprovement}
                      disabled={
                        improveIdeaMutation.isPending ||
                        !improvementPrompt.trim()
                      }
                      className="min-w-32"
                    >
                      {improveIdeaMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Melhorando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Melhorar
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Idea Comparison Modal */}
      <Dialog
        open={showDiff}
        onOpenChange={(open) => {
          if (!open) {
            setShowDiff(false);
            setOriginalIdea(null);
            setImprovedIdea(null);
          }
        }}
      >
        <DialogContent
          className="max-w-7xl max-h-[95vh] overflow-y-auto"
          style={{ width: "95vw", maxWidth: "1400px" }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Melhoria Aplicada com Sucesso
            </DialogTitle>
            <DialogDescription>
              Compare as alterações feitas pela IA na sua campanha
            </DialogDescription>
          </DialogHeader>

          {originalIdea && improvedIdea && (
            <div className="space-y-6">
              <IdeaDiffViewer
                originalIdea={originalIdea}
                improvedIdea={improvedIdea}
              />

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDiff(false);
                    setOriginalIdea(null);
                    setImprovedIdea(null);
                  }}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Modal */}
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
                      Este campo está vazio. Adicione um título para sua
                      campanha.
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
    </div>
  );
};
