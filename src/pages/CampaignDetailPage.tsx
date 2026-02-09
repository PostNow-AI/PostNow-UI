// @ts-nocheck
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Container, Tabs, TabsContent, TabsList, TabsTrigger, Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@/components/ui";
import { Calendar, FileText, Eye, ArrowLeft, Edit, Play, Loader2 } from "lucide-react";
import { campaignService } from "@/features/Campaigns/services";
import { useCampaignGeneration } from "@/features/Campaigns/hooks/useCampaignGeneration";
import { useCampaignProgress } from "@/features/Campaigns/hooks/useCampaignProgress";
import { usePostApproval } from "@/features/Campaigns/hooks/usePostApproval";
import { GenerationProgress } from "@/features/Campaigns/components/GenerationProgress";
import { PostGridView } from "@/features/Campaigns/components/PostGridView";
import { BulkActions } from "@/features/Campaigns/components/BulkActions";
import { InstagramFeedPreview } from "@/features/Campaigns/components/InstagramFeedPreview";
import { HarmonyAnalyzer } from "@/features/Campaigns/components/HarmonyAnalyzer";
import { PostViewDialog } from "@/features/IdeaBank/components/PostViewDialog";
import type { CampaignWithPosts, CampaignPost } from "@/features/Campaigns/types";

export const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPostForView, setSelectedPostForView] = useState<CampaignPost | null>(null);
  
  // Buscar dados da campanha
  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignService.getCampaign(Number(id)),
    enabled: !!id,
  });

  // Progress polling (ativo apenas durante geração)
  const { data: progress } = useCampaignProgress(
    Number(id),
    isGenerating
  );

  // Auto-parar polling quando completar
  useEffect(() => {
    if (progress?.status === 'completed') {
      setIsGenerating(false);
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      toast.success("Campanha gerada com sucesso!");
    } else if (progress?.status === 'failed') {
      setIsGenerating(false);
      toast.error(progress.error_message || "Erro ao gerar campanha");
    }
  }, [progress?.status, id, queryClient]);

  // Debug logs (TEMPORÁRIO)
  if (campaign) {
    console.log("🔍 Campaign data:", {
      id: campaign.id,
      posts_count: campaign.campaign_posts?.length,
      first_post: campaign.campaign_posts?.[0],
      has_ideas: campaign.campaign_posts?.[0]?.post?.ideas?.length > 0,
      first_idea: campaign.campaign_posts?.[0]?.post?.ideas?.[0]
    });
  }

  // Hooks de geração e aprovação
  const generateMutation = useCampaignGeneration(Number(id));
  const { bulkApprove, isApproving } = usePostApproval(Number(id));

  if (isLoading) {
    return (
      <Container
        headerTitle="Carregando..."
        headerDescription="Aguarde enquanto carregamos os detalhes da campanha."
      >
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container
        headerTitle="Campanha não encontrada"
        headerDescription="Esta campanha não existe ou você não tem permissão para acessá-la."
      >
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Campanha #{id} não encontrada.</p>
        </div>
      </Container>
    );
  }

  const isDraft = campaign.status === "draft";
  const hasPosts = campaign.campaign_posts && campaign.campaign_posts.length > 0;

  const handleEditCampaign = () => {
    navigate(`/campaigns/new?draftId=${campaign.id}`);
  };

  const handleGeneratePosts = async () => {
    setIsGenerating(true);
    try {
      await generateMutation.mutateAsync({
        objective: campaign.objective,
        main_message: campaign.main_message || "",
        structure: campaign.structure,
        visual_styles: campaign.visual_styles || [],
        duration_days: campaign.duration_days,
        post_count: campaign.post_count,
        briefing_data: campaign.briefing_data || {},
      });
      // Não desliga isGenerating aqui, vai desligar quando o polling detectar completed/failed
    } catch (error) {
      setIsGenerating(false);
    }
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleBulkApprove = () => {
    bulkApprove(selectedPosts);
    setSelectedPosts([]);
  };

  const handleBulkReject = () => {
    // TODO: Implementar reject
    console.log("Reject posts:", selectedPosts);
    setSelectedPosts([]);
  };

  const handleBulkRegenerate = () => {
    // TODO: Implementar regenerate
    console.log("Regenerate posts:", selectedPosts);
    setSelectedPosts([]);
  };

  const handleBulkDelete = () => {
    // TODO: Implementar delete
    console.log("Delete posts:", selectedPosts);
    setSelectedPosts([]);
  };

  const handlePreviewPost = (campaignPost: CampaignPost) => {
    setSelectedPostForView(campaignPost);
    setViewDialogOpen(true);
  };

  const handleEditPost = (campaignPost: CampaignPost) => {
    setSelectedPostForView(campaignPost);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedPostForView(null);
    // Refresh da campanha após fechar (caso tenha havido edições)
    queryClient.invalidateQueries({ queryKey: ["campaign", id] });
  };

  return (
    <Container
      headerTitle={campaign.name}
      headerDescription={`${campaign.post_count} posts • ${campaign.duration_days} dias`}
      containerActions={
        <Button variant="outline" onClick={() => navigate("/campaigns")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Campanhas
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        {/* Header com status e ações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg">{campaign.name}</CardTitle>
              <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                {campaign.status_display}
              </Badge>
            </div>
            
            {/* Botões de ação */}
            {isDraft && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEditCampaign}>
                  <Edit className="h-4 w-4 mr-2" /> Continuar Editando
                </Button>
                {!hasPosts && (
                  <Button onClick={handleGeneratePosts} disabled={isGenerating || generateMutation.isPending}>
                    {isGenerating || generateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                    {isGenerating || generateMutation.isPending ? "Gerando..." : "Gerar Posts"}
                  </Button>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium">{campaign.type_display}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estrutura</p>
                <p className="font-medium">{campaign.structure}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duração</p>
                <p className="font-medium">{campaign.duration_days} dias</p>
              </div>
              <div>
                <p className="text-muted-foreground">Posts</p>
                <p className="font-medium">{campaign.campaign_posts?.length || 0}/{campaign.post_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress da geração */}
        {(isGenerating || generateMutation.isPending) && progress && (
          <GenerationProgress
            progress={progress.current_step}
            total={progress.total_steps}
            percentage={progress.percentage}
            currentAction={progress.current_action}
            status={progress.status}
          />
        )}

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList>
            <TabsTrigger value="posts">
              <FileText className="h-4 w-4 mr-2" />
              Posts ({campaign.campaign_posts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 space-y-4">
            <BulkActions
              selectedCount={selectedPosts.length}
              onApproveAll={handleBulkApprove}
              onRejectAll={handleBulkReject}
              onRegenerateAll={handleBulkRegenerate}
              onDeleteAll={handleBulkDelete}
              isLoading={isApproving}
            />
            
            <PostGridView
              posts={campaign.campaign_posts || []}
              selectedPosts={selectedPosts}
              onSelectPost={handleSelectPost}
              onEditPost={handleEditPost}
              onPreviewPost={handlePreviewPost}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Preview de calendário será implementado aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InstagramFeedPreview
                posts={campaign.campaign_posts || []}
                campaignName={campaign.name}
              />
              
              <HarmonyAnalyzer
                score={75}
                breakdown={{
                  color_distribution: 80,
                  style_balance: 75,
                  pattern_diversity: 70,
                  text_legibility: 75,
                }}
                suggestions={[
                  {
                    type: "color",
                    severity: "low",
                    message: "Considere alternar cores mais vibrantes com tons neutros para criar mais contraste.",
                    action: "Ver sugestões de cores",
                  },
                  {
                    type: "style",
                    severity: "medium",
                    message: "Posts 3 e 5 têm estilos muito similares. Considere trocar a ordem.",
                    action: "Reorganizar posts",
                  },
                ]}
                onApplySuggestion={(suggestion) => console.log("Apply:", suggestion)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Visualização/Edição de Post */}
      <PostViewDialog
        isOpen={viewDialogOpen}
        onClose={handleCloseViewDialog}
        post={selectedPostForView?.post || null}
      />
    </Container>
  );
};
