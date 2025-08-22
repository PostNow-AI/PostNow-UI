import { geminiKeyApi } from "@/lib/gemini-key-api";
import {
  ideaBankService,
  type Campaign,
  type CampaignIdea,
} from "@/lib/services/ideaBankService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useIdeaBank } from "./useIdeaBank";
import { useSubscription } from "./useSubscription";

export const useIdeaBankPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingIdea, setViewingIdea] = useState<CampaignIdea | null>(null);
  const [deletingIdea, setDeletingIdea] = useState<CampaignIdea | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
    null
  );
  const [showEditor, setShowEditor] = useState(false);
  const [editorIdeas, setEditorIdeas] = useState<CampaignIdea[]>([]);
  const [showSubscriptionOverlay, setShowSubscriptionOverlay] = useState(false);

  const { campaigns, isLoading, refetchCampaigns, userCredits, estimateCost } =
    useIdeaBank();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const queryClient = useQueryClient();

  // Get API key status
  const { data: keyStatus, isLoading: isLoadingApiKeyStatus } = useQuery({
    queryKey: ["gemini-key-status"],
    queryFn: () => geminiKeyApi.getStatus(),
  });

  // Show subscription overlay if user is not subscribed
  useEffect(() => {
    if (!subscriptionLoading && !isSubscribed) {
      setShowSubscriptionOverlay(true);
    }
  }, [isSubscribed, subscriptionLoading]);

  // Delete idea mutation
  const deleteIdeaMutation = useMutation({
    mutationFn: ideaBankService.deleteIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
      toast.success("Ideia deletada com sucesso!");
      setDeletingIdea(null);
    },
    onError: () => {
      toast.error("Erro ao deletar ideia");
    },
  });

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: ideaBankService.deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns-with-ideas"] });
      toast.success("Campanha excluída com sucesso!");
      setDeletingCampaign(null);
    },
    onError: (error) => {
      toast.error("Erro ao excluir campanha");
      console.error("Error deleting campaign:", error);
    },
  });

  // Add idea mutation
  const addIdeaMutation = useMutation({
    mutationFn: async ({
      campaignId,
      ideaData,
    }: {
      campaignId: number;
      ideaData: {
        title: string;
        description: string;
        content: string;
        platform: string;
        content_type: string;
        variation_type: string;
      };
    }) => {
      // Estimate cost before generating
      try {
        const costEstimate = await estimateCost.mutateAsync({
          platforms: [ideaData.platform],
          target_audience: "",
          campaign_objective: "",
          brand_voice: "",
        });

        // Check if user has enough credits
        if (userCredits && userCredits.balance < costEstimate.estimated_cost) {
          throw new Error(
            `Créditos insuficientes. Necessário: ${costEstimate.estimated_cost.toFixed(
              2
            )}, Disponível: ${userCredits.balance.toFixed(2)}`
          );
        }

        // Use the AI generation endpoint instead of the basic add endpoint
        const response = await ideaBankService.generateSingleIdea(
          campaignId,
          ideaData
        );
        return response;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Créditos insuficientes")
        ) {
          throw error;
        }
        throw new Error("Erro ao estimar custo. Tente novamente.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns-with-ideas"] });
      toast.success("Ideia criada com IA com sucesso!");
      refetchCampaigns();
    },
    onError: (error) => {
      toast.error("Erro ao criar ideia");
      console.error("Error creating idea:", error);
    },
  });

  // Update campaign mutation
  const updateCampaignMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Campaign>;
    }) => {
      const response = await ideaBankService.updateCampaign(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
      toast.success("Campanha atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar campanha");
    },
  });

  // Handlers
  const handleNewIdeaClick = () => {
    if (!isSubscribed) {
      setShowSubscriptionOverlay(true);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleEditIdea = (idea: CampaignIdea) => {
    setEditorIdeas([idea]);
    setShowEditor(true);
  };

  const handleDeleteIdea = (idea: CampaignIdea) => {
    setDeletingIdea(idea);
  };

  const handleEditCampaign = (
    campaign: Campaign,
    updatedData: Partial<Campaign>
  ) => {
    updateCampaignMutation.mutate({ id: campaign.id, data: updatedData });
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
  };

  const handleAddIdea = async (
    campaignId: number,
    ideaData: {
      title: string;
      description: string;
      content: string;
      platform: string;
      content_type: string;
      variation_type: string;
    }
  ): Promise<CampaignIdea> => {
    return new Promise<CampaignIdea>((resolve, reject) => {
      addIdeaMutation.mutate(
        { campaignId, ideaData },
        {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        }
      );
    });
  };

  const handleConfirmDeleteIdea = () => {
    if (deletingIdea) {
      deleteIdeaMutation.mutate(deletingIdea.id);
    }
  };

  const handleConfirmDeleteCampaign = () => {
    if (deletingCampaign) {
      deleteCampaignMutation.mutate(deletingCampaign.id);
    }
  };

  const handleCloseSubscriptionOverlay = () => {
    setShowSubscriptionOverlay(false);
  };

  return {
    // State
    isDialogOpen,
    viewingIdea,
    deletingIdea,
    deletingCampaign,
    showEditor,
    editorIdeas,
    showSubscriptionOverlay,

    // Data
    campaigns,
    isLoading,
    keyStatus,
    isLoadingApiKeyStatus,
    isSubscribed,
    subscriptionLoading,

    // Mutations
    deleteIdeaMutation,
    deleteCampaignMutation,
    addIdeaMutation,
    updateCampaignMutation,

    // Handlers
    handleNewIdeaClick,
    handleEditIdea,
    handleDeleteIdea,
    handleEditCampaign,
    handleDeleteCampaign,
    handleAddIdea,
    handleConfirmDeleteIdea,
    handleConfirmDeleteCampaign,
    handleCloseSubscriptionOverlay,

    // Setters
    setIsDialogOpen,
    setViewingIdea,
    setShowEditor,
    setEditorIdeas,
    setDeletingIdea,
    setDeletingCampaign,
  };
};
