import { api } from "@/lib/api";

export interface Post {
  id: number;
  name: string;
  objective: string;
  objective_display: string;
  type: string;
  type_display: string;
  target_gender?: string;
  target_gender_display?: string;
  target_age?: string;
  target_location?: string;
  target_salary?: string;
  target_interests?: string;
  has_target_audience: boolean;
  ideas_count: number;
  created_at: string;
  updated_at: string;
  ideas?: PostIdea[];
}

export interface PostIdea {
  id: number;
  content: string;
  content_preview: string;
  image_url?: string;
  status: "draft" | "approved" | "archived";
  status_display: string;
  ai_provider: string;
  ai_model: string;
  post_name: string;
  post_type: string;
  created_at: string;
  updated_at: string;
  post_id: number;
}

export interface PostStats {
  posts: {
    total: number;
    with_ideas: number;
    without_ideas: number;
  };
  ideas: {
    total: number;
    approved: number;
    draft: number;
    archived: number;
  };
}

export interface PostOptions {
  objectives: { value: string; label: string }[];
  types: { value: string; label: string }[];
  genders: { value: string; label: string }[];
  ai_providers: { value: string; label: string }[];
}

export const postService = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get("/api/v1/ideabank/posts/");
    return response.data.results || response.data;
  },

  // Get posts with their ideas
  getPostsWithIdeas: async (): Promise<Post[]> => {
    const response = await api.get("/api/v1/ideabank/posts/all-with-ideas/");
    return response.data.posts || response.data;
  },

  // Get post statistics
  getPostStats: async (): Promise<PostStats> => {
    const response = await api.get("/api/v1/ideabank/stats/");
    return response.data;
  },

  // Get post options/choices
  getPostOptions: async (): Promise<PostOptions> => {
    const response = await api.get("/api/v1/ideabank/options/");
    return response.data;
  },

  // Get single post by ID
  getPost: async (id: number): Promise<Post> => {
    const response = await api.get(`/api/v1/ideabank/posts/${id}/`);
    return response.data;
  },

  // Get single post with ideas by ID
  getPostWithIdeas: async (id: number): Promise<Post> => {
    const response = await api.get(`/api/v1/ideabank/posts/${id}/with-ideas/`);
    return response.data;
  },

  // Update post
  updatePost: async (id: number, data: Partial<Post>): Promise<Post> => {
    const response = await api.patch(`/api/v1/ideabank/posts/${id}/`, data);
    return response.data;
  },

  // Delete post
  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/ideabank/posts/${id}/`);
  },

  // Update post idea
  updatePostIdea: async (
    id: number,
    data: Partial<PostIdea>
  ): Promise<PostIdea> => {
    const response = await api.patch(`/api/v1/ideabank/ideas/${id}/`, data);
    return response.data;
  },

  // Delete post idea
  deletePostIdea: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/ideabank/ideas/${id}/`);
  },

  // Generate image for post idea
  generateImageForIdea: async (
    ideaId: number,
    data?: { prompt?: string }
  ): Promise<{ image_url: string; message: string }> => {
    const response = await api.post(
      `/api/v1/ideabank/ideas/${ideaId}/generate-image/`,
      data || {}
    );
    return response.data;
  },

  // Edit post idea content
  editPostIdea: async (
    ideaId: number,
    data: { content: string; improvement_prompt?: string }
  ): Promise<PostIdea> => {
    const response = await api.post(
      `/api/v1/ideabank/ideas/${ideaId}/edit/`,
      data
    );
    return response.data;
  },

  // Regenerate image for post idea
  regenerateImageForIdea: async (
    ideaId: number,
    data?: { prompt?: string }
  ): Promise<{ image_url: string; message: string }> => {
    const response = await api.post(
      `/api/v1/ideabank/ideas/${ideaId}/regenerate-image/`,
      data || {}
    );
    return response.data;
  },
};
