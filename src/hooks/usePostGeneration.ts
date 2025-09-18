import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { PostCreationFormData } from "@/schemas/postSchema";

interface PostGenerationResponse {
  message: string;
  post: {
    id: number;
    name: string;
    objective: string;
    objective_display: string;
    type: string;
    type_display: string;
    target_gender?: string;
    target_gender_display?: string;
    target_age?: string;
    target_location?: string;
    target_salary?: string;
    target_interests?: string;
    has_target_audience: boolean;
    ideas_count: number;
    created_at: string;
    updated_at: string;
  };
  idea: {
    id: number;
    content: string;
    content_preview: string;
    image_url?: string;
    status: string;
    status_display: string;
    ai_provider: string;
    ai_model: string;
    post_name: string;
    post_type: string;
    created_at: string;
    updated_at: string;
  };
}

interface PostGenerationError {
  error: string;
  details?: Record<string, string[]>;
}

export const usePostGeneration = () => {
  const queryClient = useQueryClient();

  const generatePostMutation = useMutation<
    PostGenerationResponse,
    PostGenerationError,
    PostCreationFormData
  >({
    mutationFn: async (data: PostCreationFormData) => {
      // Clean up empty optional fields while preserving boolean values
      const cleanData: Record<string, string | boolean> = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          // Keep booleans as they are
          if (typeof value === "boolean") {
            cleanData[key] = value;
          }
          // Keep non-empty strings
          else if (typeof value === "string") {
            cleanData[key] = value;
          }
          // Keep other valid values
          else {
            cleanData[key] = value;
          }
        }
      });

      console.log("Sending data to API:", cleanData);

      const response = await api.post(
        `/api/v1/ideabank/generate/post-idea/`,
        cleanData
      );

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });

      // Show success message
      toast.success(data.message || "Post e ideia gerados com sucesso!", {
        description: `Post "${data.post.name}" criado com conteúdo gerado por IA`,
      });
    },
    onError: (error) => {
      console.error("Erro na geração do post:", error);

      // Extract error message
      let errorMessage = "Erro ao gerar post";

      if (error?.error) {
        errorMessage = error.error;
      } else if (error?.details) {
        // Handle validation errors
        const validationErrors = Object.entries(error.details)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("; ");
        errorMessage = `Erro de validação: ${validationErrors}`;
      }

      toast.error(errorMessage, {
        description: "Verifique os dados inseridos e tente novamente",
      });
    },
  });

  return {
    generatePost: generatePostMutation.mutateAsync,
    isLoading: generatePostMutation.isPending,
    error: generatePostMutation.error,
    reset: generatePostMutation.reset,
  };
};
