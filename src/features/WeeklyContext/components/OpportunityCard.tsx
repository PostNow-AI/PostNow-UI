import { ExternalLink, Plus } from "lucide-react";
import type { OpportunityItem } from "../types";
import { Badge, Button } from "@/components/ui";

interface OpportunityCardProps {
  item: OpportunityItem;
  borderColor: string;
  bgColor: string;
  onCreatePost: (item: OpportunityItem) => void;
}

export const OpportunityCard = ({
  item,
  borderColor,
  bgColor,
  onCreatePost,
}: OpportunityCardProps) => {
  const handleOpenSource = () => {
    window.open(item.url_fonte, "_blank", "noopener,noreferrer");
  };

  const handleCreatePost = () => {
    onCreatePost(item);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm border-l-4 transition-all hover:shadow-md"
      style={{ borderLeftColor: borderColor }}
    >
      <div className="flex justify-between items-start gap-3 mb-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex-1">
          {item.titulo_ideia}
        </h3>
        <Badge
          className="text-white font-bold shrink-0"
          style={{ backgroundColor: borderColor }}
        >
          {item.score}
        </Badge>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        <strong>Por que viraliza:</strong> {item.explicacao_score}
      </p>

      <div
        className="rounded-md p-3 mb-3"
        style={{ backgroundColor: bgColor }}
      >
        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
          💡 <strong>Sugestão:</strong> {item.gatilho_criativo}
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenSource}
          className="flex items-center gap-1"
          aria-label="Ver fonte da oportunidade"
        >
          <ExternalLink className="h-4 w-4" />
          Ver Fonte
        </Button>
        <Button
          size="sm"
          onClick={handleCreatePost}
          className="flex items-center gap-1"
          aria-label="Criar post a partir desta oportunidade"
        >
          <Plus className="h-4 w-4" />
          Criar Post
        </Button>
      </div>
    </div>
  );
};

