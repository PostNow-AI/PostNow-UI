import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ideaBankService } from "@/features/IdeaBank/services";
import type { OpportunityItem } from "../types";
import type { PostCreationData, PostCreationResponse } from "@/features/IdeaBank/types";

interface GenerateFromOpportunityParams {
  opportunity: OpportunityItem;
  customInstructions?: string;
  objective?: PostCreationData["objective"];
  type?: PostCreationData["type"];
  includeImage?: boolean;
}

export const useGenerateFromOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation<PostCreationResponse, Error, GenerateFromOpportunityParams>({
    mutationFn: async ({
      opportunity,
      customInstructions,
      objective = "branding",
      type = "post",
      includeImage = false,
    }) => {
      const contextText = [
        opportunity.gatilho_criativo,
        customInstructions,
        `\n\nFonte de referência: ${opportunity.url_fonte}`,
        `\nContexto original: ${opportunity.texto_base_analisado}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const data: PostCreationData = {
        name: opportunity.titulo_ideia,
        objective,
        type,
        further_details: contextText,
        include_image: includeImage,
      };

      return await ideaBankService.createPostWithIdea(data);
    },
    onSuccess: (data) => {
      // Invalidate IdeaBank queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      
      toast.success("Post gerado com sucesso!", {
        description: "Sua ideia foi criada e está disponível no IdeaBank",
      });
      
      return data;
    },
    onError: (error) => {
      toast.error("Erro ao gerar post", {
        description: error.message || "Tente novamente em alguns instantes",
      });
      console.error("Error generating post from opportunity:", error);
    },
  });
};

