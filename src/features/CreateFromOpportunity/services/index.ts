import { api } from "@/lib/api";
import type { CreatePostData, GeneratedPost, Opportunity, VisualStyle } from "../types";

interface GeneratePostResponse {
  message: string;
  post: GeneratedPost;
}

interface OpportunitiesResponse {
  opportunities: Opportunity[];
  total: number;
}

export const createFromOpportunityService = {
  // Fetch all visual styles
  async getVisualStyles(): Promise<VisualStyle[]> {
    const response = await api.get<VisualStyle[]>(
      "api/v1/creator-profile/visual-style-preferences/"
    );
    return response.data;
  },

  // Fetch user opportunities
  async getOpportunities(): Promise<Opportunity[]> {
    const response = await api.get<OpportunitiesResponse>(
      "api/v1/client-context/opportunities/"
    );
    return response.data.opportunities;
  },

  // Generate post with specific style
  async generatePost(data: CreatePostData): Promise<GeneratePostResponse> {
    const response = await api.post<GeneratePostResponse>(
      "api/v1/ideabank/generate/post-idea/",
      data
    );
    return response.data;
  },
};
