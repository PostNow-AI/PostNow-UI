import { useState } from "react";

import { CampaignIdeaList } from "@/components/ideabank/CampaignIdeaList";
import { PostCreationDialog } from "@/components/ideabank/PostCreationDialog";
import { PostList } from "@/components/ideabank/PostList";
import { PostViewDialog } from "@/components/ideabank/PostViewDialog";

import { IdeaEditor } from "@/components/ideabank/IdeaEditor";
import { IdeaGenerationDialog } from "@/components/ideabank/IdeaGenerationDialog";
import { type CampaignIdea } from "@/lib/services/ideaBankService";
import { type Post as PostType } from "@/lib/services/postService";

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
import { useUserCredits } from "@/hooks/useCredits";
import { useIdeaBankPage } from "@/hooks/useIdeaBankPage";
import { Plus, Sparkles } from "lucide-react";

interface IdeaData {
  id: number;
  content: string;
  content_preview: string;
  image_url?: string;
  status: string;
  status_display: string;
  ai_provider: string;
  ai_model: string;
  post_name: string;
  post_type: string;
  created_at: string;
  updated_at: string;
}

interface PostData {
  id: number;
  name: string;
  objective: string;
  objective_display: string;
  type: string;
  type_display: string;
  target_gender?: string;
  target_gender_display?: string;
  target_age?: string;
  target_location?: string;
  target_salary?: string;
  target_interests?: string;
  has_target_audience: boolean;
  ideas_count: number;
  created_at: string;
  updated_at: string;
}

export const IdeaBankPage = () => {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isPostViewDialogOpen, setIsPostViewDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  const {
    // State
    isDialogOpen,
    viewingIdea,
    deletingIdea,
    deletingCampaign,
    deletingPost,
    showEditor,
    editorIdeas,

    // Data
    campaigns,
    // posts, // Temporarily commented out - unused
    isLoading,

    // Handlers
    handleNewIdeaClick,
    handleEditIdea,
    handleDeleteIdea,
    handleEditCampaign,
    handleDeleteCampaign,
    // handleEditPost, // Temporarily commented out - unused
    // handleDeletePost, // Temporarily commented out - unused
    handleConfirmDeleteIdea,
    handleConfirmDeleteCampaign,
    handleConfirmDeletePost,

    // Setters
    setIsDialogOpen,
    setViewingIdea,
    setShowEditor,
    setEditorIdeas,
    setDeletingIdea,
    setDeletingCampaign,
    setDeletingPost,
  } = useIdeaBankPage();

  const handleEditorBack = () => {
    setShowEditor(false);
    setEditorIdeas([]);
  };

  const handlePostCreated = (postData: PostData, ideaData: IdeaData) => {
    // Convert PostData to PostType and add the generated idea
    const postWithIdeas: PostType = {
      ...postData,
      ideas: [
        {
          id: ideaData.id,
          content: ideaData.content,
          content_preview: ideaData.content.substring(0, 200) + "...",
          status: "draft" as const,
          status_display: "Rascunho",
          ai_provider: "gemini",
          ai_model: "gemini-1.5-flash",
          post_name: postData.name,
          post_type: postData.type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          post_id: postData.id,
        },
      ],
    };

    // Open the PostViewDialog with the created post
    setSelectedPost(postWithIdeas);
    setIsPostViewDialogOpen(true);
  };

  const { data: userCredits } = useUserCredits();
  const balance = Number(userCredits?.balance) || 0;

  return (
    <div className="container px-4 pb-4 space-y-6">
      {showEditor ? (
        <IdeaEditor
          ideas={
            editorIdeas.filter(
              (idea) => "campaign_id" in idea
            ) as CampaignIdea[]
          }
          onBack={handleEditorBack}
        />
      ) : (
        <div className="space-y-8">
          {/* New Post-based System */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-600">
                  Biblioteca de posts
                </h2>
                <span className="text-muted-foreground">
                  Gerencie todos os conteúdos de Instagram gerados por IA
                </span>
              </div>
              {/* Main Content */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground text-sm">
                    {balance} créditos restantes
                  </span>
                </div>
                <Button
                  onClick={() => setIsPostDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Novo Post
                </Button>

                {campaigns.length > 0 && (
                  <Button
                    onClick={handleNewIdeaClick}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Campanha (Legacy)
                  </Button>
                )}
              </div>
            </div>
            <PostList />
          </div>

          {/* Legacy Campaign System (if campaigns exist) */}
          {campaigns.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plus className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-muted-foreground">
                  Campanhas (Legacy)
                </h2>
              </div>
              <CampaignIdeaList
                campaigns={campaigns}
                isLoading={isLoading}
                onEditIdea={handleEditIdea}
                onDeleteIdea={handleDeleteIdea}
                onEditCampaign={handleEditCampaign}
                onDeleteCampaign={handleDeleteCampaign}
                handleNewIdeaClick={handleNewIdeaClick}
              />
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <PostCreationDialog
        isOpen={isPostDialogOpen}
        onClose={() => setIsPostDialogOpen(false)}
        onSuccess={handlePostCreated}
      />

      <PostViewDialog
        isOpen={isPostViewDialogOpen}
        onClose={() => {
          setIsPostViewDialogOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
      />

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
              Tem certeza que deseja excluir a ideia "
              {(deletingIdea &&
                "title" in deletingIdea &&
                deletingIdea.title) ||
                (deletingIdea &&
                  "post_name" in deletingIdea &&
                  deletingIdea.post_name) ||
                "esta ideia"}
              "? Esta ação não pode ser desfeita.
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

      {/* Delete Post Confirmation */}
      <AlertDialog
        open={!!deletingPost}
        onOpenChange={() => setDeletingPost(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o post "{deletingPost?.name}"? Esta
              ação não pode ser desfeita e excluirá todas as ideias associadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeletePost}
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
            <DialogTitle>
              {(viewingIdea && "title" in viewingIdea && viewingIdea.title) ||
                (viewingIdea &&
                  "post_name" in viewingIdea &&
                  viewingIdea.post_name) ||
                "Ideia"}
            </DialogTitle>
            <DialogDescription>
              {(viewingIdea &&
                "description" in viewingIdea &&
                viewingIdea.description) ||
                (viewingIdea &&
                  "post_type" in viewingIdea &&
                  `Post do tipo: ${viewingIdea.post_type}`) ||
                "Detalhes da ideia"}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Ideia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Platform - only for CampaignIdea */}
                  {viewingIdea && "platform" in viewingIdea && (
                    <div>
                      <strong>Plataforma:</strong>{" "}
                      {viewingIdea.platform_display || viewingIdea.platform}
                    </div>
                  )}
                  {/* Content Type - only for CampaignIdea */}
                  {viewingIdea && "content_type" in viewingIdea && (
                    <div>
                      <strong>Tipo de Conteúdo:</strong>{" "}
                      {viewingIdea.content_type_display ||
                        viewingIdea.content_type}
                    </div>
                  )}
                  {/* Post info - only for PostIdea */}
                  {viewingIdea && "post_name" in viewingIdea && (
                    <>
                      <div>
                        <strong>Post:</strong> {viewingIdea.post_name}
                      </div>
                      <div>
                        <strong>Tipo:</strong> {viewingIdea.post_type}
                      </div>
                      <div>
                        <strong>Provedor IA:</strong> {viewingIdea.ai_provider}
                      </div>
                      <div>
                        <strong>Modelo IA:</strong> {viewingIdea.ai_model}
                      </div>
                    </>
                  )}
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
