/**
 * Instagram Service - API communication layer
 * Handles all Instagram integration API calls
 */

import type {
  InstagramAccount,
  InstagramCallbackRequest,
  InstagramCallbackResponse,
  InstagramConnectResponse,
  InstagramHealthCheckResponse,
  InstagramMetricsResponse,
  InstagramNotificationsResponse,
  InstagramStatusResponse,
  InstagramSyncResponse,
} from "@/types/instagram";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class InstagramService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Initiate Instagram OAuth connection
   * Returns authorization URL to redirect user to Instagram
   */
  async connect(): Promise<InstagramConnectResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/social/instagram/connect/`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  /**
   * Handle OAuth callback after user authorizes
   * @param code - Authorization code from Instagram
   * @param state - State token for CSRF protection
   */
  async callback(
    data: InstagramCallbackRequest,
  ): Promise<InstagramCallbackResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/social/instagram/callback/`,
      data,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  /**
   * Get current Instagram connection status
   */
  async getStatus(): Promise<InstagramStatusResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/social/instagram/status/`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  /**
   * Manually sync Instagram data (15-minute cooldown)
   */
  async sync(): Promise<InstagramSyncResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/social/instagram/sync/`,
      {},
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  /**
   * Get Instagram metrics with optional date filtering
   * @param startDate - Filter metrics from this date (YYYY-MM-DD)
   * @param endDate - Filter metrics until this date (YYYY-MM-DD)
   */
  async getMetrics(
    startDate?: string,
    endDate?: string,
  ): Promise<InstagramMetricsResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/social/instagram/metrics/?${params.toString()}`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  /**
   * Get Instagram notifications
   * @param unreadOnly - Only return unread notifications
   */
  async getNotifications(
    unreadOnly: boolean = false,
  ): Promise<InstagramNotificationsResponse> {
    const params = unreadOnly ? "?unread_only=true" : "";
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/social/instagram/notifications/${params}`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  /**
   * Mark notification as read
   * @param notificationId - ID of the notification to mark as read
   */
  async markNotificationAsRead(notificationId: number): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/api/v1/social/instagram/notifications/${notificationId}/mark-read/`,
      {},
      { headers: this.getAuthHeaders() },
    );
  }

  /**
   * Disconnect Instagram account
   */
  async disconnect(): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/social/instagram/disconnect/`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  /**
   * Check Instagram integration health
   */
  async healthCheck(): Promise<InstagramHealthCheckResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/social/instagram/health/`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  /**
   * Get account details
   */
  async getAccount(): Promise<InstagramAccount> {
    const status = await this.getStatus();
    if (!status.connected || !status.account) {
      throw new Error("Instagram account not connected");
    }
    return status.account;
  }
}

export const instagramService = new InstagramService();
