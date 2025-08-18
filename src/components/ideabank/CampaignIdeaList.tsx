import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import type { Campaign, CampaignIdea } from "@/hooks/useIdeaBank";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { AddIdeaDialog } from "./AddIdeaDialog";
import { CampaignEditDialog } from "./CampaignEditDialog";

interface CampaignIdeaListProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onEditIdea?: (idea: CampaignIdea) => void;
  onDeleteIdea?: (idea: CampaignIdea) => void;
  onEditCampaign?: (campaign: Campaign, updatedData: Partial<Campaign>) => void;
  onDeleteCampaign?: (campaign: Campaign) => void;
  onAddIdea?: (
    campaignId: number,
    ideaData: {
      title: string;
      description: string;
      content: string;
      platform: string;
      content_type: string;
      variation_type: string;
    }
  ) => Promise<CampaignIdea>;
}

export const CampaignIdeaList = ({
  campaigns,
  isLoading,
  onEditIdea,
  onDeleteIdea,
  onEditCampaign,
  onDeleteCampaign,
  onAddIdea,
}: CampaignIdeaListProps) => {
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<number>>(
    new Set()
  );
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [addingIdea, setAddingIdea] = useState<Campaign | null>(null);

  const toggleCampaign = (campaignId: number) => {
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleSaveCampaign = (updatedData: Partial<Campaign>) => {
    if (onEditCampaign && editingCampaign) {
      onEditCampaign(editingCampaign, updatedData);
    }
  };

  const handleCloseEditDialog = () => {
    setEditingCampaign(null);
  };

  const handleAddIdea = async (ideaData: {
    title: string;
    description: string;
    content: string;
    platform: string;
    content_type: string;
    variation_type: string;
  }): Promise<CampaignIdea> => {
    if (onAddIdea && addingIdea) {
      try {
        const createdIdea = await onAddIdea(addingIdea.id, ideaData);
        // Only close dialog after successful save
        setAddingIdea(null);
        return createdIdea;
      } catch (error) {
        console.error("Error adding idea:", error);
        // Don't close dialog on error
        throw error;
      }
    }
    throw new Error("No campaign selected or onAddIdea not provided");
  };

  const handleCloseAddIdeaDialog = () => {
    setAddingIdea(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando campanhas...</p>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma campanha encontrada
          </h3>
          <p>Comece gerando sua primeira campanha com ideias!</p>
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

  const getCampaignStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      active: "default",
      paused: "destructive",
      completed: "default",
      archived: "destructive",
    } as const;

    const labels = {
      draft: "Rascunho",
      active: "Ativa",
      paused: "Pausada",
      completed: "Concluída",
      archived: "Arquivada",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
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
    <div className="space-y-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-md transition-shadow">
          <Collapsible open={expandedCampaigns.has(campaign.id)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CollapsibleTrigger
                      onClick={() => toggleCampaign(campaign.id)}
                      className="p-1 hover:bg-muted rounded-sm transition-colors"
                    >
                      {expandedCampaigns.has(campaign.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CardTitle className="flex items-center gap-2">
                      {campaign.title}
                      {getCampaignStatusBadge(campaign.status)}
                    </CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(campaign.created_at)}
                    </span>
                    <span>{campaign.platforms.join(", ")}</span>
                    <span>{campaign.ideas_count || 0} ideias</span>
                  </CardDescription>
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {campaign.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {onEditCampaign && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCampaign(campaign)}
                      title="Editar Campanha"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteCampaign && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteCampaign(campaign)}
                      title="Excluir Campanha"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {onAddIdea && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingIdea(campaign)}
                      title="Adicionar Ideia"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CollapsibleContent>
              <CardContent className="pt-0">
                {campaign.ideas && campaign.ideas.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Ideias da Campanha:
                    </h4>
                    {campaign.ideas.map((idea) => (
                      <Card
                        key={idea.id}
                        className="bg-muted/30 border-l-4 border-l-primary"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium">{idea.title}</h5>
                                {getStatusBadge(idea.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{idea.platform_display}</span>
                                <span>{idea.content_type_display}</span>
                                <span>{formatDate(idea.generated_at)}</span>
                              </div>
                              {idea.description && (
                                <p className="text-sm">{idea.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {onEditIdea && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onEditIdea(idea)}
                                  title="Editar Ideia"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {onDeleteIdea && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onDeleteIdea(idea)}
                                  title="Excluir Ideia"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Nenhuma ideia gerada para esta campanha ainda.</p>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
      <CampaignEditDialog
        campaign={editingCampaign}
        isOpen={editingCampaign !== null}
        onSave={handleSaveCampaign}
        onClose={handleCloseEditDialog}
      />
      <AddIdeaDialog
        isOpen={addingIdea !== null}
        onSave={handleAddIdea}
        onClose={handleCloseAddIdeaDialog}
        onEditIdea={onEditIdea || (() => {})}
        campaignId={addingIdea?.id || 0}
      />
    </div>
  );
};
