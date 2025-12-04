import { api } from "@/lib/api";

export interface DailyPost {
  id: number;
  name: string;
  objective: string;
  objective_display: string;
  type: string;
  type_display: string;
  ideas: {
    id: number;
    content: string;
    content_preview: string;
    image_url: string;
    post_name: string;
    post_type: string;
    created_at: string;
    updated_at: string;
  }[];
  further_details: string;
  include_image: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DailyPostsResponse {
  date: string;
  posts: DailyPost[];
}

export const fetchDailyPosts = async (): Promise<DailyPostsResponse> => {
  const response = await api.get("/api/v1/ideabank/admin/fetch-all-daily/");
  return response.data;
};
