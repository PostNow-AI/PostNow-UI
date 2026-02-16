// @ts-nocheck
/**
 * Lista de campanhas em grid.
 */

import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Calendar, FileText, CheckCircle2, Clock } from "lucide-react";
import type { Campaign } from "../types";

interface CampaignListProps {
  campaigns: Campaign[];
}

export const CampaignList = ({ campaigns }: CampaignListProps) => {
  const navigate = useNavigate();
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Rascunho" },
      pending_approval: { variant: "default" as const, label: "Em Revisão" },
      approved: { variant: "default" as const, label: "Aprovada" },
      active: { variant: "default" as const, label: "Ativa" },
      completed: { variant: "outline" as const, label: "Concluída" },
      paused: { variant: "secondary" as const, label: "Pausada" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <Card 
          key={campaign.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/campaigns/${campaign.id}`)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2">{campaign.name}</CardTitle>
              {getStatusBadge(campaign.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{campaign.type_display}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{campaign.duration_days} dias • {campaign.post_count} posts</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>
                {campaign.posts_approved_count}/{campaign.posts_count} aprovados
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Criada em {new Date(campaign.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

