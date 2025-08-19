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
import { useIdeaEditor } from "@/hooks/useIdeaEditor";
import type { CampaignIdea } from "@/lib/services/ideaBankService";
import { ideaToCampaignData } from "@/utils";
import { ArrowLeft, Edit, Loader2, Save, Sparkles, Trash2 } from "lucide-react";
import { JsonContentViewer } from "./JsonContentViewer";

interface IdeaEditorProps {
  ideas: CampaignIdea[];
  onBack: () => void;
}

export const IdeaEditor = ({ ideas, onBack }: IdeaEditorProps) => {
  const {
    editingIdeas,
    viewingIdea,
    editingIdea,
    deletingIdea,
    improvingIdea,
    improvementPrompt,
    showDiff,
    originalIdea,
    improvedIdea,
    improvementProgress,
    improvementStatus,
    improvementError,
    ideasByPlatform,
    updateIdeaMutation,
    improveIdeaMutation,
    handleIdeaUpdate,
    handleSaveIdea,
    handleStatusChange,
    handleDeleteIdea,
    handleImproveIdea,
    handleSubmitImprovement,
    handleSaveEditIdea,
    setViewingIdea,
    setEditingIdea,
    setDeletingIdea,
    setImprovingIdea,
    setImprovementPrompt,
    setShowDiff,
    setOriginalIdea,
    setImprovedIdea,
    setImprovementProgress,
    setImprovementStatus,
    setImprovementError,
  } = useIdeaEditor(ideas);

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
                              handleStatusChange(
                                idea,
                                value as "draft" | "approved" | "archived"
                              )
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
                            onClick={() =>
                              handleImproveIdea({
                                ...idea,
                                campaign_id: 0,
                                user_id: 0,
                              })
                            }
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
