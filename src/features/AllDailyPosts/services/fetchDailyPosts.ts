import { api } from "@/lib/api";

export interface DailyPost {
  id: number;
  name: string;
  objective: string;
  type: string;
  ideas: {
    content: string;
    image_url: string;
  }[];
  further_details: string;
  is_automatically_generated: boolean;
  include_image: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  posts: DailyPost[];
}

export interface DailyPostsResponse {
  date: string;
  users_with_posts: DailyUser[];
  user_amount: number;
  automatic_expected_posts_amount: number;
  actual_automatic_posts_amount: number;
}

export const fetchDailyPosts = async (): Promise<DailyPostsResponse> => {
  const response = await api.get("/api/v1/ideabank/admin/fetch-all-daily/");
  return response.data;
};
