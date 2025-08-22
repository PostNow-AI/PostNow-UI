import { api } from "@/lib/api";

export interface Campaign {
  id: number;
  title: string;
  description: string;
  objectives: string[];
  persona_age: string;
  persona_location: string;
  persona_income: string;
  persona_interests: string;
  persona_behavior: string;
  persona_pain_points: string;
  platforms: string[];
  content_types: Record<string, string[]>;
  voice_tone: string;
  voice_tone_display: string;
  product_description: string;
  value_proposition: string;
  campaign_urgency: string;
  status: string;
  status_display: string;
  created_at: string;
  updated_at: string;
  ideas_count: number;
  approved_ideas_count: number;
  ideas?: CampaignIdea[];
}

export interface CampaignIdea {
  id: number;
  title: string;
  description: string;
  content: string;
  platform: string;
  platform_display: string;
  content_type: string;
  content_type_display: string;
  variation_type: string;
  variation_type_display: string;
  headline: string;
  copy: string;
  cta: string;
  hashtags: string[];
  visual_description: string;
  color_composition: string;
  status: "draft" | "approved" | "archived";
  status_display: string;
  generated_at: string;
  created_at: string;
  updated_at: string;
  campaign_id: number;
  user_id: number;
}

export interface CampaignStats {
  campaigns: {
    total: number;
    active: number;
    draft: number;
    completed: number;
  };
  ideas: {
    total: number;
    approved: number;
    draft: number;
  };
}

export interface IdeaGenerationFormData {
  title?: string;
  description?: string;
  objectives: string[];
  persona_age?: string;
  persona_location?: string;
  persona_income?: string;
  persona_interests?: string;
  persona_behavior?: string;
  persona_pain_points?: string;
  platforms: string[];
  content_types?: Record<string, string[]>;
  voice_tone: string;
  product_description?: string;
  value_proposition?: string;
  campaign_urgency?: string;
  preferred_provider?: string;
  preferred_model?: string;
}

export interface IdeaOptions {
  objectives: { value: string; label: string }[];
  content_types: Record<string, string[]>;
  platforms: { value: string; label: string }[];
  voice_tones: { value: string; label: string }[];
}

export interface GeneratedIdeasResponse {
  ideas: CampaignIdea[];
  campaign: Campaign;
}

export interface ImprovementProgress {
  percentage: number;
  current_step: number;
  total_steps: number;
  current_step_name: string;
}

export interface ImprovementResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  improved_idea(arg0: string, improved_idea: any): unknown;
  idea: CampaignIdea;
  message: string;
  progress: ImprovementProgress;
}

export const ideaBankService = {
  // Get campaigns with ideas
  getCampaignsWithIdeas: async (): Promise<Campaign[]> => {
    const response = await api.get("/api/v1/ideabank/campaigns-with-ideas/");
    return response.data.campaigns;
  },

  // Get campaign statistics
  getCampaignStats: async (): Promise<CampaignStats> => {
    const response = await api.get("/api/v1/ideabank/stats/");
    return response.data;
  },

  // Get idea generation options
  getIdeaOptions: async (): Promise<IdeaOptions> => {
    const response = await api.get("/api/v1/ideabank/options/");
    return response.data;
  },

  // Generate ideas
  generateIdeas: async (
    data: IdeaGenerationFormData
  ): Promise<GeneratedIdeasResponse> => {
    const response = await api.post("/api/v1/ideabank/generate-ideas/", data);
    return response.data;
  },

  // Generate public ideas
  generatePublicIdeas: async (
    data: IdeaGenerationFormData
  ): Promise<GeneratedIdeasResponse> => {
    const response = await api.post("/api/v1/ideabank/generate-ideas/", data);
    return response.data;
  },

  // Update idea
  updateIdea: async (
    id: number,
    data: Partial<CampaignIdea>
  ): Promise<CampaignIdea> => {
    const response = await api.patch(`/api/v1/ideabank/ideas/${id}/`, data);
    return response.data;
  },

  // Delete idea
  deleteIdea: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/ideabank/ideas/${id}/`);
  },

  // Delete campaign
  deleteCampaign: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/ideabank/campaigns/${id}/`);
  },

  // Improve idea
  improveIdea: async (
    id: number,
    prompt: string
  ): Promise<ImprovementResponse> => {
    const response = await api.post(`/api/v1/ideabank/ideas/${id}/improve/`, {
      improvement_prompt: prompt,
    });
    return response.data;
  },

  // Generate single idea
  generateSingleIdea: async (
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
    const response = await api.post(`/api/v1/ideabank/generate-single-idea/`, {
      ...ideaData,
      campaign_id: campaignId,
    });
    return response.data.idea;
  },

  // Update campaign
  updateCampaign: async (
    id: number,
    data: Partial<Campaign>
  ): Promise<Campaign> => {
    const response = await api.patch(`/api/v1/ideabank/campaigns/${id}/`, data);
    return response.data;
  },
};
