// @ts-nocheck
import { useState } from "react";
import { toast } from "sonner";
import { carouselService } from "../services";

interface CarouselSlide {
  id: number;
  sequence_order: number;
  title: string;
  content: string;
  image_url: string;
  image_description: string;
  has_arrow: boolean;
  has_numbering: boolean;
}

/**
 * Hook para gerenciar o dialog de visualização e edição de slide do carrossel
 */
export const useCarouselSlideDialog = (slide: CarouselSlide | null, isOpen: boolean) => {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [downloadingImage, setDownloadingImage] = useState(false);

  /**
   * Baixar imagem do slide
   */
  const handleDownloadImage = async () => {
    if (!slide?.image_url) {
      toast.error("Nenhuma imagem para baixar");
      return;
    }

    setDownloadingImage(true);
    try {
      const response = await fetch(slide.image_url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `slide-${slide.sequence_order}-${slide.title || "carrossel"}.png`;
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
      window.open(slide.image_url, "_blank");
    } finally {
      setDownloadingImage(false);
    }
  };

  /**
   * Editar imagem do slide com prompt customizado
   */
  const handleImageGeneration = async () => {
    if (!slide?.id) {
      toast.error("Nenhum slide selecionado");
      return;
    }

    if (!imagePrompt.trim()) {
      toast.error("Digite o que deseja mudar na imagem");
      return;
    }

    setGeneratingImage(true);
    try {
      toast.loading("Editando imagem...", { id: "edit-carousel-image" });

      await carouselService.regenerateSlideImage(slide.id, imagePrompt);

      toast.success("Imagem editada!", { id: "edit-carousel-image" });
      setImagePrompt(""); // Limpar prompt após sucesso
      
      // Recarregar página para mostrar imagem atualizada
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to edit image:", error);
      toast.error("Erro ao editar imagem", { 
        id: "edit-carousel-image",
        description: error?.response?.data?.message || "Tente novamente",
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  return {
    generatingImage,
    downloadingImage,
    imagePrompt,
    setImagePrompt,
    handleDownloadImage,
    handleImageGeneration,
  };
};

