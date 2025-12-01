import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ideaBankService } from "../services";
import type { Post } from "../types";

// Hook for PostViewDialog
export const usePostViewDialog = (post: Post | null, isOpen: boolean) => {
  const [regeneratingIdea, setRegeneratingIdea] = useState(false);
  const [regeneratePrompt, setRegeneratePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [downloadingImage, setDownloadingImage] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: ideas,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["post-ideas", post?.id],
    queryFn: async () => {
      if (!post?.id) return [];
      const response = await ideaBankService.getPostIdeas(post.id);
      return response;
    },
    enabled: !!post?.id && isOpen,
  });

  const currentIdea = ideas?.[0];

  const handleCopyContent = async () => {
    if (!currentIdea?.content) return;

    try {
      // Strip HTML tags from content before copying
      const strippedContent = currentIdea.content
        .replace(/<[^>]*>/g, "")
        .trim();
      await navigator.clipboard.writeText(strippedContent);
      toast.success("Conteúdo copiado!", {
        description: "O texto do post foi copiado para a área de transferência",
      });
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Erro ao copiar", {
        description: "Não foi possível copiar o conteúdo",
      });
    }
  };

  const handleRegenerateIdea = async () => {
    if (!currentIdea?.id) return;

    setRegeneratingIdea(true);
    try {
      await ideaBankService.editPostIdea(currentIdea.id, {
        content: currentIdea.content,
        improvement_prompt: regeneratePrompt,
      });

      await refetch();
      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      setRegeneratePrompt("");

      toast.success("Ideia regenerada!", {
        description: "O conteúdo do post foi atualizado com sucesso",
      });
    } catch (error) {
      console.error("Failed to regenerate idea:", error);
      toast.error("Erro ao regenerar ideia", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setRegeneratingIdea(false);
    }
  };

  const handleImageGeneration = async () => {
    if (!currentIdea?.id) return;

    setGeneratingImage(true);
    try {
      const hasImage = !!currentIdea.image_url;
      if (hasImage) {
        await ideaBankService.regenerateImageForIdea(currentIdea.id, {
          prompt: imagePrompt,
        });
      } else {
        await ideaBankService.generateImageForIdea(currentIdea.id, {
          prompt: imagePrompt,
        });
      }

      await refetch();
      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      setImagePrompt("");

      const successMessage = hasImage ? "Imagem regenerada!" : "Imagem gerada!";
      toast.success(successMessage, {
        description: hasImage
          ? "A imagem foi regenerada com sucesso"
          : "A imagem foi gerada com sucesso",
      });
    } catch (error) {
      console.error("Failed to generate/regenerate image:", error);
      toast.error("Erro na geração da imagem", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!currentIdea?.image_url) return;

    setDownloadingImage(true);
    try {
      const response = await fetch(currentIdea.image_url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${post?.name || "post"}-image.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Imagem baixada!", {
        description: "A imagem foi salva em seus downloads",
      });
    } catch (error) {
      console.error("Failed to download image:", error);
      toast.error("Download falhou", {
        description: "Abrindo imagem em nova aba para download manual",
      });
      window.open(currentIdea.image_url, "_blank");
    } finally {
      setDownloadingImage(false);
    }
  };

  // Check if CORS is supported for the given URL
  const checkCorsSupport = async (imageUrl: string): Promise<boolean> => {
    try {
      const response = await fetch(imageUrl, {
        method: "HEAD",
        mode: "cors",
      });
      return response.ok;
    } catch {
      // CORS error or network error
      return false;
    }
  };

  return {
    currentIdea,
    isLoading,
    regeneratingIdea,
    generatingImage,
    downloadingImage,
    regeneratePrompt,
    imagePrompt,
    setRegeneratePrompt,
    setImagePrompt,
    handleCopyContent,
    handleRegenerateIdea,
    handleDownloadImage,
    handleImageGeneration,
  };
};
