import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface CampaignIdea {
  id: number;
  title: string;
  description: string;
  content: string;
  platform: string;
  platform_display: string;
  content_type: string;
  content_type_display: string;
  status: "draft" | "approved" | "archived";
  status_display: string;
  generated_at: string;
  updated_at: string;
}

export interface IdeaStats {
  total_ideas: number;
  draft_ideas: number;
  approved_ideas: number;
  archived_ideas: number;
}

export const useIdeaBank = () => {
  const {
    data: ideas = [],
    isLoading: ideasLoading,
    error: ideasError,
  } = useQuery({
    queryKey: ["campaign-ideas"],
    queryFn: async (): Promise<CampaignIdea[]> => {
      const response = await api.get("/api/v1/ideabank/ideas/");
      return response.data;
    },
  });

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["idea-stats"],
    queryFn: async (): Promise<IdeaStats> => {
      const response = await api.get("/api/v1/ideabank/stats/");
      return response.data;
    },
  });

  return {
    ideas,
    stats,
    isLoading: ideasLoading || statsLoading,
    error: ideasError || statsError,
  };
};
