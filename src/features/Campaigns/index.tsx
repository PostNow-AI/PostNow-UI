/**
 * Página principal de Campanhas - Dashboard.
 * Seguindo padrão de IdeaBank/index.tsx
 */

import { useNavigate } from "react-router-dom";
import { Plus, Zap } from "lucide-react";
import { Container, Button, Skeleton, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useCampaigns } from "./hooks";
import { CampaignList } from "./components/CampaignList";

export const Campaigns = () => {
  const navigate = useNavigate();
  const { campaigns, isLoading, isError, error } = useCampaigns();

  if (isLoading) {
    return (
      <Container
        headerTitle="Campanhas"
        headerDescription="Carregando suas campanhas..."
      >
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container
        headerTitle="Campanhas"
        headerDescription="Erro ao carregar"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "Ocorreu um erro ao buscar campanhas."}
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const hasCampaigns = campaigns && campaigns.length > 0;

  return (
    <Container
      headerTitle="Campanhas"
      headerDescription="Gerencie campanhas de marketing completas"
      containerActions={
        <Button onClick={() => navigate("/campaigns/new")}>
          <Plus className="h-4 w-4" />
          Nova Campanha
        </Button>
      }
    >
      {!hasCampaigns ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Nenhuma campanha criada ainda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Campanhas são sequências organizadas de posts para atingir objetivos específicos.
            </p>
            <p className="text-muted-foreground">
              Crie sua primeira campanha e deixe a IA fazer o trabalho pesado!
            </p>
            <Button onClick={() => navigate("/campaigns/new")}>
              <Zap className="h-4 w-4" />
              Criar Primeira Campanha
            </Button>
          </CardContent>
        </Card>
      ) : (
        <CampaignList campaigns={campaigns} />
      )}
    </Container>
  );
};

export default Campaigns;

