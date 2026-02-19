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
  async getPostsWithIdeas(postType: string): Promise<PostsWithIdeasResponse> {
    const response = await api.get("api/v1/ideabank/posts/all-with-ideas/", {
      params: { post_type: postType },
    });
    return response.data;
  },

  // Get post statistics
  async getPostStats(): Promise<PostStats> {
    const response = await api.get<PostStats>("api/v1/ideabank/stats/");
    return response.data;
  },

  // Create a new post with AI-generated idea
  async createPostWithIdea(
    data: PostCreationData
  ): Promise<PostCreationResponse> {
    const response = await api.post<PostCreationResponse>(
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
    const response = await api.patch<Post>(`api/v1/ideabank/posts/${postId}/`, data);
    return response.data;
  },

  // Get ideas for a specific post
  async getPostIdeas(postId: number): Promise<PostIdea[]> {
    const response = await api.get<PostIdea[]>(`api/v1/ideabank/posts/${postId}/ideas/`);
    return response.data;
  },

  // Edit a post idea
  async editPostIdea(
    ideaId: number,
    data: { content: string; improvement_prompt?: string }
  ): Promise<PostIdea> {
    const response = await api.post<PostIdea>(
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
    const response = await api.post<{ image_url: string; message: string }>(
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
    const response = await api.post<{ image_url: string; message: string }>(
      `api/v1/ideabank/ideas/${ideaId}/regenerate-image/`,
      data || {}
    );
    return response.data;
  },
};
