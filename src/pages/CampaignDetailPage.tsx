import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container, Tabs, TabsContent, TabsList, TabsTrigger, Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@/components/ui";
import { Calendar, FileText, Eye } from "lucide-react";
import { campaignService } from "@/features/Campaigns/services";
import type { CampaignWithPosts } from "@/features/Campaigns/types";

export const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Buscar dados da campanha
  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignService.getCampaign(Number(id)),
    enabled: !!id,
  });

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

  return (
    <Container
      headerTitle={campaign.name}
      headerDescription={`${campaign.post_count} posts • ${campaign.duration_days} dias`}
    >
      <div className="p-6">
        {/* Header com status e ações */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
              {campaign.status}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Criada em {new Date(campaign.created_at).toLocaleDateString("pt-BR")}
            </div>
          </div>
          
          {/* Botões de ação */}
          {campaign.status === "draft" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/campaigns/new?draft=${campaign.id}`)}
              >
                Continuar Editando
              </Button>
              {campaign.campaign_posts?.length === 0 && (
                <Button onClick={() => {
                  // TODO: Chamar API de geração
                  console.log("Gerar posts para campanha", campaign.id);
                }}>
                  Gerar Posts
                </Button>
              )}
            </div>
          )}
        </div>

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

          <TabsContent value="posts" className="mt-6">
            <PostsList posts={campaign.campaign_posts || []} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CalendarView campaign={campaign} />
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <FeedPreview posts={campaign.campaign_posts || []} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function PostsList({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            Nenhum post gerado ainda. Clique em "Gerar Posts" para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {posts.map((campaignPost, index) => (
        <Card key={campaignPost.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">Post #{index + 1}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {campaignPost.post?.text?.slice(0, 100)}...
                </p>
              </div>
              <Badge variant={campaignPost.approved ? "default" : "secondary"}>
                {campaignPost.approved ? "Aprovado" : "Pendente"}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function CalendarView({ campaign }: { campaign: CampaignWithPosts }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          Preview de calendário será implementado aqui.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Mostrará distribuição dos {campaign.post_count} posts ao longo de {campaign.duration_days} dias.
        </p>
      </CardContent>
    </Card>
  );
}

function FeedPreview({ posts }: { posts: any[] }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          Preview do feed Instagram será implementado aqui.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Grid 3x3 mostrando como ficará seu feed com estes posts.
        </p>
      </CardContent>
    </Card>
  );
}
