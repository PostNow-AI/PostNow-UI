/**
 * Tests for Instagram Scheduling hooks
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

// Mock the service
vi.mock("../services", () => ({
  instagramSchedulingService: {
    getScheduledPosts: vi.fn(),
    getScheduledPost: vi.fn(),
    createScheduledPost: vi.fn(),
    updateScheduledPost: vi.fn(),
    deleteScheduledPost: vi.fn(),
    cancelScheduledPost: vi.fn(),
    publishScheduledPostNow: vi.fn(),
    retryScheduledPost: vi.fn(),
    getScheduledPostStats: vi.fn(),
    getInstagramAccounts: vi.fn(),
  },
}));

import { instagramSchedulingService } from "../services";
import {
  useScheduledPosts,
  useScheduledPostStats,
} from "../hooks/useScheduledPosts";
import { useInstagramAccounts } from "../hooks/useInstagramAccounts";

// Helper to create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useScheduledPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch scheduled posts", async () => {
    const mockPosts = [
      {
        id: 1,
        caption: "Test post",
        status: "scheduled",
        scheduled_for: "2026-03-01T10:00:00Z",
      },
    ];

    vi.mocked(instagramSchedulingService.getScheduledPosts).mockResolvedValue(
      mockPosts
    );

    const { result } = renderHook(() => useScheduledPosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.posts).toEqual(mockPosts);
    expect(instagramSchedulingService.getScheduledPosts).toHaveBeenCalled();
  });

  it("should filter posts by status", async () => {
    const mockPosts = [
      {
        id: 1,
        caption: "Scheduled post",
        status: "scheduled",
      },
    ];

    vi.mocked(instagramSchedulingService.getScheduledPosts).mockResolvedValue(
      mockPosts
    );

    const { result } = renderHook(
      () => useScheduledPosts({ status: "scheduled" }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(instagramSchedulingService.getScheduledPosts).toHaveBeenCalledWith({
      status: "scheduled",
    });
  });

  it("should handle error state", async () => {
    vi.mocked(instagramSchedulingService.getScheduledPosts).mockRejectedValue(
      new Error("API Error")
    );

    const { result } = renderHook(() => useScheduledPosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useScheduledPostStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch stats", async () => {
    const mockStats = {
      pending: 2,
      scheduled_future: 5,
      published_today: 1,
      failed: 0,
      total_published: 10,
    };

    vi.mocked(instagramSchedulingService.getScheduledPostStats).mockResolvedValue(
      mockStats
    );

    const { result } = renderHook(() => useScheduledPostStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
  });
});

describe("useInstagramAccounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch Instagram accounts", async () => {
    const mockAccounts = [
      {
        id: 1,
        instagram_username: "testaccount",
        status: "connected",
        is_token_valid: true,
      },
    ];

    vi.mocked(instagramSchedulingService.getInstagramAccounts).mockResolvedValue(
      mockAccounts
    );

    const { result } = renderHook(() => useInstagramAccounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.accounts).toEqual(mockAccounts);
  });

  it("should filter connected accounts", async () => {
    const mockAccounts = [
      {
        id: 1,
        instagram_username: "connected",
        status: "connected",
        is_token_valid: true,
      },
      {
        id: 2,
        instagram_username: "disconnected",
        status: "disconnected",
        is_token_valid: false,
      },
    ];

    vi.mocked(instagramSchedulingService.getInstagramAccounts).mockResolvedValue(
      mockAccounts
    );

    const { result } = renderHook(() => useInstagramAccounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.connectedAccounts).toHaveLength(1);
    expect(result.current.connectedAccounts[0].instagram_username).toBe(
      "connected"
    );
  });
});
