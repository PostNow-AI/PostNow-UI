import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

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
  ideas?: CampaignIdea[]; // Add ideas as children
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
  updated_at: string;
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

export const useIdeaBank = () => {
  const {
    data: campaignsWithIdeas = [],
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useQuery({
    queryKey: ["campaigns-with-ideas"],
    queryFn: async (): Promise<Campaign[]> => {
      const response = await api.get("/api/v1/ideabank/campaigns-with-ideas/");
      return response.data.campaigns;
    },
  });

  // Extract all ideas from campaigns for backward compatibility
  const allIdeas = campaignsWithIdeas.flatMap(
    (campaign) => campaign.ideas || []
  );

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["campaign-stats"],
    queryFn: async (): Promise<CampaignStats> => {
      const response = await api.get("/api/v1/ideabank/campaigns/stats/");
      return response.data;
    },
  });

  return {
    campaigns: campaignsWithIdeas,
    ideas: allIdeas, // For backward compatibility
    stats,
    isLoading: campaignsLoading || statsLoading,
    error: campaignsError || statsError,
    refetchCampaigns,
  };
};
