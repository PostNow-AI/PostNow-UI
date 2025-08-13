import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { CampaignIdea } from "@/hooks/useIdeaBank";
import { Calendar, Edit, Eye, Trash2 } from "lucide-react";

interface IdeaListProps {
  ideas: CampaignIdea[];
  isLoading: boolean;
  onView?: (idea: CampaignIdea) => void;
  onEdit?: (idea: CampaignIdea) => void;
  onDelete?: (idea: CampaignIdea) => void;
}

export const IdeaList = ({
  ideas,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: IdeaListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ideias...</p>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma ideia encontrada
          </h3>
          <p>Comece gerando sua primeira ideia de campanha!</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      approved: "default",
      archived: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status === "draft" && "Rascunho"}
        {status === "approved" && "Aprovado"}
        {status === "archived" && "Arquivado"}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {ideas.map((idea) => (
        <Card key={idea.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  {idea.title}
                  {getStatusBadge(idea.status)}
                </CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(idea.generated_at)}
                  </span>
                  <span>{idea.platform_display}</span>
                  <span>{idea.content_type_display}</span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(idea)}
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(idea)}
                  title="Deletar"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {idea.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
