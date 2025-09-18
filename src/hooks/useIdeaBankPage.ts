import {
  ideaBankService,
  type Campaign,
  type CampaignIdea,
} from "@/lib/services/ideaBankService";
import {
  postService,
  type Post,
  type PostIdea,
} from "@/lib/services/postService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useIdeaBank } from "./useIdeaBank";

export const useIdeaBankPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingIdea, setViewingIdea] = useState<
    CampaignIdea | PostIdea | null
  >(null);
  const [deletingIdea, setDeletingIdea] = useState<
    CampaignIdea | PostIdea | null
  >(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
    null
  );
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorIdeas, setEditorIdeas] = useState<(CampaignIdea | PostIdea)[]>(
    []
  );

  const {
    campaigns,
    posts,
    isLoading,
    refetchCampaigns,
    // refetchPosts, // Temporarily commented - unused
    userCredits,
    estimateCost,
  } = useIdeaBank();

  // Helper to refetch all data
  // const refetchAllData = () => {
  //   refetch();
  //   refetchPosts();
  // };

  const queryClient = useQueryClient();

  // Delete campaign idea mutation
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

  // Delete post idea mutation
  const deletePostIdeaMutation = useMutation({
    mutationFn: postService.deletePostIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
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

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      toast.success("Post excluído com sucesso!");
      setDeletingPost(null);
    },
    onError: (error) => {
      toast.error("Erro ao excluir post");
      console.error("Error deleting post:", error);
    },
  });

  // Add campaign idea mutation
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

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Post> }) => {
      const response = await postService.updatePost(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      toast.success("Post atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar post");
    },
  });

  // Handlers
  const handleNewIdeaClick = () => {
    setIsDialogOpen(true);
  };

  const handleEditIdea = (idea: CampaignIdea | PostIdea) => {
    setEditorIdeas([idea]);
    setShowEditor(true);
  };

  const handleDeleteIdea = (idea: CampaignIdea | PostIdea) => {
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

  const handleEditPost = (post: Post, updatedData: Partial<Post>) => {
    updatePostMutation.mutate({ id: post.id, data: updatedData });
  };

  const handleDeletePost = (post: Post) => {
    setDeletingPost(post);
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
      // Check if it's a campaign idea or post idea
      if ("campaign_id" in deletingIdea) {
        // It's a campaign idea
        deleteIdeaMutation.mutate(deletingIdea.id);
      } else {
        // It's a post idea
        deletePostIdeaMutation.mutate(deletingIdea.id);
      }
    }
  };

  const handleConfirmDeleteCampaign = () => {
    if (deletingCampaign) {
      deleteCampaignMutation.mutate(deletingCampaign.id);
    }
  };

  const handleConfirmDeletePost = () => {
    if (deletingPost) {
      deletePostMutation.mutate(deletingPost.id);
    }
  };

  return {
    // State
    isDialogOpen,
    viewingIdea,
    deletingIdea,
    deletingCampaign,
    deletingPost,
    showEditor,
    editorIdeas,

    // Data
    campaigns,
    posts,
    isLoading,

    // Mutations
    deleteIdeaMutation,
    deletePostIdeaMutation,
    deleteCampaignMutation,
    deletePostMutation,
    addIdeaMutation,
    updateCampaignMutation,
    updatePostMutation,

    // Handlers
    handleNewIdeaClick,
    handleEditIdea,
    handleDeleteIdea,
    handleEditCampaign,
    handleDeleteCampaign,
    handleEditPost,
    handleDeletePost,
    handleAddIdea,
    handleConfirmDeleteIdea,
    handleConfirmDeleteCampaign,
    handleConfirmDeletePost,

    // Setters
    setIsDialogOpen,
    setViewingIdea,
    setShowEditor,
    setEditorIdeas,
    setDeletingIdea,
    setDeletingCampaign,
    setDeletingPost,
  };
};
