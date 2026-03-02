/**
 * Instagram Scheduling Service
 *
 * API service for Instagram account management and scheduled posts.
 */

import { api } from "@/lib/api";
import type {
  CalendarEvent,
  InstagramAccount,
  InstagramAccountListItem,
  PublishNowResponse,
  ScheduledPostCreateData,
  ScheduledPostDetail,
  ScheduledPostListItem,
  ScheduledPostStats,
  ScheduledPostUpdateData,
} from "../types";

const BASE_URL = "api/v1/social";

export const instagramSchedulingService = {
  // ============================================================
  // Instagram Accounts
  // ============================================================

  /**
   * List all connected Instagram accounts for current user.
   */
  async getAccounts(): Promise<InstagramAccountListItem[]> {
    const response = await api.get<InstagramAccountListItem[]>(
      `${BASE_URL}/instagram/accounts/`
    );
    return response.data;
  },

  /**
   * Get details of a specific Instagram account.
   */
  async getAccount(accountId: number): Promise<InstagramAccount> {
    const response = await api.get<InstagramAccount>(
      `${BASE_URL}/instagram/accounts/${accountId}/`
    );
    return response.data;
  },

  /**
   * Disconnect an Instagram account.
   */
  async disconnectAccount(
    accountId: number
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `${BASE_URL}/instagram/accounts/${accountId}/disconnect/`
    );
    return response.data;
  },

  // ============================================================
  // Scheduled Posts
  // ============================================================

  /**
   * List scheduled posts with optional filters.
   */
  async getScheduledPosts(params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ScheduledPostListItem[]> {
    const response = await api.get<ScheduledPostListItem[]>(
      `${BASE_URL}/scheduled-posts/`,
      { params }
    );
    return response.data;
  },

  /**
   * Get details of a specific scheduled post.
   */
  async getScheduledPost(postId: number): Promise<ScheduledPostDetail> {
    const response = await api.get<ScheduledPostDetail>(
      `${BASE_URL}/scheduled-posts/${postId}/`
    );
    return response.data;
  },

  /**
   * Create a new scheduled post.
   */
  async createScheduledPost(
    data: ScheduledPostCreateData
  ): Promise<ScheduledPostDetail> {
    const response = await api.post<ScheduledPostDetail>(
      `${BASE_URL}/scheduled-posts/`,
      data
    );
    return response.data;
  },

  /**
   * Update a scheduled post.
   */
  async updateScheduledPost(
    postId: number,
    data: ScheduledPostUpdateData
  ): Promise<ScheduledPostDetail> {
    const response = await api.patch<ScheduledPostDetail>(
      `${BASE_URL}/scheduled-posts/${postId}/`,
      data
    );
    return response.data;
  },

  /**
   * Delete a scheduled post.
   */
  async deleteScheduledPost(postId: number): Promise<void> {
    await api.delete(`${BASE_URL}/scheduled-posts/${postId}/`);
  },

  /**
   * Cancel a scheduled post.
   */
  async cancelScheduledPost(
    postId: number
  ): Promise<{ message: string; status: string }> {
    const response = await api.post<{ message: string; status: string }>(
      `${BASE_URL}/scheduled-posts/${postId}/cancel/`
    );
    return response.data;
  },

  /**
   * Publish a post immediately.
   */
  async publishNow(postId: number): Promise<PublishNowResponse> {
    const response = await api.post<PublishNowResponse>(
      `${BASE_URL}/scheduled-posts/${postId}/publish-now/`
    );
    return response.data;
  },

  /**
   * Retry a failed post.
   */
  async retryPost(
    postId: number
  ): Promise<{ message: string; retry_count: number }> {
    const response = await api.post<{ message: string; retry_count: number }>(
      `${BASE_URL}/scheduled-posts/${postId}/retry/`
    );
    return response.data;
  },

  /**
   * Get calendar events for scheduled posts.
   */
  async getCalendarEvents(params?: {
    start?: string;
    end?: string;
  }): Promise<CalendarEvent[]> {
    const response = await api.get<CalendarEvent[]>(
      `${BASE_URL}/scheduled-posts/calendar/`,
      { params }
    );
    return response.data;
  },

  /**
   * Get scheduling statistics.
   */
  async getStats(): Promise<ScheduledPostStats> {
    const response = await api.get<ScheduledPostStats>(
      `${BASE_URL}/scheduled-posts/stats/`
    );
    return response.data;
  },
};

export default instagramSchedulingService;
