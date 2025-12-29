/**
 * Página de detalhes da campanha (por enquanto, placeholder).
 * TODO próxima sessão: Implementar tabs [Posts][Calendário][Preview].
 */

import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Container
      headerTitle={`Campanha #${id}`}
      headerDescription="Detalhes da campanha"
      containerActions={
        <Button variant="outline" onClick={() => navigate("/campaigns")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Campanha Criada!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página mostrará os posts gerados, calendário e preview do feed.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            💡 Implementação completa na próxima sessão (Tarefa 9/16).
          </p>
        </CardContent>
      </Card>
    </Container>
  );
};

