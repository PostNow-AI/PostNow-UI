import { api } from "@/lib/api";
import type { CreatePostData, VisualStyle } from "../types";

export const createFromOpportunityService = {
  // Fetch all visual styles
  async getVisualStyles(): Promise<VisualStyle[]> {
    const response = await api.get<VisualStyle[]>(
      "api/v1/creator-profile/visual-style-preferences/"
    );
    return response.data;
  },

  // Generate post with specific style
  async generatePost(data: CreatePostData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "api/v1/ideabank/generate/post-idea/",
      data
    );
    return response.data;
  },
};
