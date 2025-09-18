import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { CampaignIdea } from "@/lib/services/ideaBankService";
import { Calendar, Edit, Eye, Trash2 } from "lucide-react";

interface IdeaListProps {
  ideas: CampaignIdea[];
  isLoading: boolean;
  onEdit?: (idea: CampaignIdea) => void;
  onDelete?: (idea: CampaignIdea) => void;
}

export const IdeaList = ({
  ideas,
  isLoading,
  onEdit,
  onDelete,
}: IdeaListProps) => {
  // Aviso sobre geração de imagens
  const imageWarning = (
    <div
      className="mb-4 p-3 rounded bg-yellow-100 border border-yellow-300 text-yellow-900 text-sm"
      role="alert"
      aria-label="Aviso sobre geração de imagens"
    >
      <strong>Aviso:</strong> A geração de imagens está sendo testada com o{" "}
      <span className="font-semibold">Google Gemini</span>. Esta funcionalidade
      está em modo experimental e pode ter resultados variados.
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          {imageWarning}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ideias...</p>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-8">
        {imageWarning}
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
      {imageWarning}
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
            {idea.image_url && (
              <img
                src={idea.image_url}
                alt="Imagem gerada pela IA"
                className="mt-4 rounded shadow max-w-xs w-full"
                style={{ maxHeight: 300, objectFit: "cover" }}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
