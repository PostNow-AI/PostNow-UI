// @ts-nocheck
import { api } from "@/lib/api";

interface RegenerateSlideImagePayload {
  editing_instructions: string;
}

/**
 * Service para comunicação com API de Carrosséis
 */
export const carouselService = {
  /**
   * Regenerar imagem de um slide específico com instruções de edição
   */
  async regenerateSlideImage(slideId: number, editingInstructions: string): Promise<any> {
    const payload: RegenerateSlideImagePayload = {
      editing_instructions: editingInstructions,
    };
    
    const response = await api.post(
      `/api/v1/carousel/slides/${slideId}/regenerate-image/`,
      payload
    );
    
    return response.data;
  },
};

