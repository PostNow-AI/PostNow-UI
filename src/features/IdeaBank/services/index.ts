import { api } from "@/lib/api";
import type {
  Post,
  PostCreationData,
  PostCreationResponse,
  PostIdea,
  PostStats,
  PostsWithIdeasResponse,
} from "../types";

export const ideaBankService = {
  // Get all posts with their ideas
  async getPostsWithIdeas(): Promise<PostsWithIdeasResponse> {
    const response = await api.get("api/v1/ideabank/posts/all-with-ideas/");
    return response.data;
  },

  // Get post statistics
  async getPostStats(): Promise<PostStats> {
    const response = await api.get("api/v1/ideabank/stats/");
    return response.data;
  },

  // Create a new post with AI-generated idea
  async createPostWithIdea(
    data: PostCreationData
  ): Promise<PostCreationResponse> {
    const response = await api.post(
      "api/v1/ideabank/generate/post-idea/",
      data
    );
    return response.data;
  },

  // Delete a post idea
  async deletePostIdea(ideaId: number): Promise<void> {
    await api.delete(`api/v1/ideabank/post-ideas/${ideaId}/`);
  },

  // Delete a post
  async deletePost(postId: number): Promise<void> {
    await api.delete(`api/v1/ideabank/posts/${postId}/`);
  },

  // Update a post
  async updatePost(postId: number, data: Partial<Post>): Promise<Post> {
    const response = await api.patch(`api/v1/ideabank/posts/${postId}/`, data);
    return response.data;
  },

  // Get ideas for a specific post
  async getPostIdeas(postId: number): Promise<PostIdea[]> {
    const response = await api.get(`api/v1/ideabank/posts/${postId}/ideas/`);
    return response.data;
  },

  // Edit a post idea
  async editPostIdea(
    ideaId: number,
    data: { content: string; improvement_prompt?: string }
  ): Promise<PostIdea> {
    const response = await api.post(
      `api/v1/ideabank/ideas/${ideaId}/edit/`,
      data
    );
    return response.data;
  },

  // Generate image for a post idea
  async generateImageForIdea(
    ideaId: number,
    data?: { prompt?: string }
  ): Promise<{ image_url: string; message: string }> {
    const response = await api.post(
      `api/v1/ideabank/ideas/${ideaId}/generate-image/`,
      data || {}
    );
    return response.data;
  },

  // Regenerate image for a post idea
  async regenerateImageForIdea(
    ideaId: number,
    data?: { prompt?: string }
  ): Promise<{ image_url: string; message: string }> {
    const response = await api.post(
      `api/v1/ideabank/ideas/${ideaId}/regenerate-image/`,
      data || {}
    );
    return response.data;
  },
};
