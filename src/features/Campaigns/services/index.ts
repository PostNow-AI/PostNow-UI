/**
 * Campaign Service - API calls para campanhas.
 * Seguindo padrão de IdeaBank/services/index.ts
 */

import { api } from "@/lib/api";
import type {
  Campaign,
  CampaignWithPosts,
  CampaignCreationData,
  CampaignGenerationRequest,
  CampaignGenerationResponse,
  CampaignDraft,
  VisualStyle,
  CampaignTemplate,
  CampaignStructureConfig,
  PostRegenerationRequest,
} from "../types";

export const campaignService = {
  // ============================================================================
  // CAMPAIGNS CRUD
  // ============================================================================

  /**
   * Listar todas as campanhas do usuário
   */
  async getCampaigns(): Promise<Campaign[]> {
    const response = await api.get("/api/v1/campaigns/");
    return response.data;
  },

  /**
   * Obter detalhes de uma campanha com posts
   */
  async getCampaign(id: number): Promise<CampaignWithPosts> {
    const response = await api.get(`/api/v1/campaigns/${id}/`);
    return response.data;
  },

  /**
   * Criar nova campanha
   */
  async createCampaign(data: CampaignCreationData): Promise<Campaign> {
    const response = await api.post("/api/v1/campaigns/", data);
    return response.data;
  },

  /**
   * Atualizar campanha
   */
  async updateCampaign(
    id: number,
    data: Partial<CampaignCreationData>
  ): Promise<Campaign> {
    const response = await api.patch(`/api/v1/campaigns/${id}/`, data);
    return response.data;
  },

  /**
   * Deletar campanha
   */
  async deleteCampaign(id: number): Promise<void> {
    await api.delete(`/api/v1/campaigns/${id}/`);
  },

  // ============================================================================
  // GENERATION
  // ============================================================================

  /**
   * Gerar conteúdo completo da campanha
   */
  async generateContent(
    campaignId: number,
    params: CampaignGenerationRequest
  ): Promise<CampaignGenerationResponse> {
    const response = await api.post(
      `/api/v1/campaigns/${campaignId}/generate/`,
      params
    );
    return response.data;
  },

  // ============================================================================
  // APPROVAL
  // ============================================================================

  /**
   * Aprovar campanha completa (todos os posts)
   */
  async approveCampaign(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/api/v1/campaigns/${id}/approve/`);
    return response.data;
  },

  /**
   * Aprovar post individual
   */
  async approvePost(
    campaignId: number,
    postId: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(
      `/api/v1/campaigns/${campaignId}/posts/${postId}/approve/`
    );
    return response.data;
  },

  /**
   * Regenerar post com feedback
   */
  async regeneratePost(
    campaignId: number,
    postId: number,
    feedback: PostRegenerationRequest
  ): Promise<any> {
    const response = await api.post(
      `/api/v1/campaigns/${campaignId}/posts/${postId}/regenerate/`,
      feedback
    );
    return response.data;
  },

  // ============================================================================
  // REORGANIZATION
  // ============================================================================

  /**
   * Reorganizar ordem dos posts
   */
  async reorganizePosts(
    campaignId: number,
    newOrder: number[]
  ): Promise<{ success: boolean }> {
    const response = await api.post(
      `/api/v1/campaigns/${campaignId}/reorganize/`,
      { post_order: newOrder }
    );
    return response.data;
  },

  /**
   * Calcular harmonia visual
   */
  async calculateHarmony(campaignId: number): Promise<{
    overall: number;
    breakdown: Record<string, number>;
    suggestions: any[];
  }> {
    const response = await api.get(`/api/v1/campaigns/${campaignId}/harmony/`);
    return response.data;
  },

  // ============================================================================
  // DRAFTS (AUTO-SAVE)
  // ============================================================================

  /**
   * Listar drafts do usuário
   */
  async getDrafts(): Promise<CampaignDraft[]> {
    const response = await api.get("/api/v1/campaigns/drafts/");
    return response.data;
  },

  /**
   * Salvar draft (auto-save)
   */
  async saveDraft(draft: Partial<CampaignDraft>): Promise<{ draft_id: number }> {
    const response = await api.post("/api/v1/campaigns/drafts/save/", draft);
    return response.data;
  },

  /**
   * Obter draft específico
   */
  async getDraft(id: number): Promise<CampaignDraft> {
    const response = await api.get(`/api/v1/campaigns/drafts/${id}/`);
    return response.data;
  },

  // ============================================================================
  // TEMPLATES
  // ============================================================================

  /**
   * Listar templates do usuário
   */
  async getTemplates(): Promise<CampaignTemplate[]> {
    const response = await api.get("/api/v1/campaigns/templates/");
    return response.data;
  },

  /**
   * Criar template a partir de campanha
   */
  async createTemplate(data: Partial<CampaignTemplate>): Promise<CampaignTemplate> {
    const response = await api.post("/api/v1/campaigns/templates/", data);
    return response.data;
  },

  // ============================================================================
  // HELPERS
  // ============================================================================

  /**
   * Obter estruturas narrativas disponíveis
   */
  async getAvailableStructures(): Promise<Record<string, CampaignStructureConfig>> {
    const response = await api.get("/api/v1/campaigns/structures/");
    return response.data.data;
  },

  /**
   * Obter estilos visuais disponíveis
   */
  async getVisualStyles(category?: string): Promise<VisualStyle[]> {
    const params = category ? { category } : {};
    const response = await api.get("/api/v1/campaigns/visual-styles/", { params });
    return response.data.data;
  },

  /**
   * Obter estilos RANQUEADOS por Thompson Sampling (IA!)
   */
  async getRankedVisualStyles(): Promise<VisualStyle[]> {
    const response = await api.get("/api/v1/campaigns/visual-styles/ranked/");
    return response.data.data;
  },

  /**
   * Obter sugestão de objetivo (Contextual Bandits)
   */
  async getBriefingSuggestion(): Promise<{ suggestion: string; decision_id: string }> {
    const response = await api.post("/api/v1/campaigns/suggest-briefing/");
    return response.data.data;
  },

  // ============================================================================
  // WEEKLY CONTEXT INTEGRATION
  // ============================================================================

  /**
   * Buscar oportunidades do Weekly Context para campanha
   */
  async getOpportunities(campaignId: number): Promise<any[]> {
    const response = await api.get(`/api/v1/campaigns/${campaignId}/opportunities/`);
    return response.data.data || [];
  },

  /**
   * Adicionar oportunidade à campanha
   */
  async addOpportunity(
    campaignId: number,
    opportunityId: number
  ): Promise<{ success: boolean }> {
    const response = await api.post(
      `/api/v1/campaigns/${campaignId}/opportunities/${opportunityId}/add/`
    );
    return response.data;
  },
};

