/**
 * Tests for Instagram Scheduling hooks
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

// Mock the service module
const mockGetScheduledPosts = vi.fn();
const mockGetStats = vi.fn();
const mockGetAccounts = vi.fn();

vi.mock("../services", () => ({
  instagramSchedulingService: {
    getScheduledPosts: (...args: unknown[]) => mockGetScheduledPosts(...args),
    getScheduledPost: vi.fn(),
    createScheduledPost: vi.fn(),
    updateScheduledPost: vi.fn(),
    deleteScheduledPost: vi.fn(),
    cancelScheduledPost: vi.fn(),
    publishScheduledPostNow: vi.fn(),
    retryScheduledPost: vi.fn(),
    getStats: () => mockGetStats(),
    getAccounts: () => mockGetAccounts(),
    getCalendarEvents: vi.fn(),
    disconnectAccount: vi.fn(),
  },
}));

// Helper to create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
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

    mockGetScheduledPosts.mockResolvedValue(mockPosts);

    // Import after mocks are set up
    const { useScheduledPosts } = await import("../hooks/useScheduledPosts");

    const { result } = renderHook(() => useScheduledPosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockPosts);
    expect(mockGetScheduledPosts).toHaveBeenCalled();
  });

  it("should filter posts by status", async () => {
    mockGetScheduledPosts.mockResolvedValue([]);

    const { useScheduledPosts } = await import("../hooks/useScheduledPosts");

    const { result } = renderHook(
      () => useScheduledPosts({ status: "scheduled" }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetScheduledPosts).toHaveBeenCalledWith({
      status: "scheduled",
      start_date: undefined,
      end_date: undefined,
    });
  });

  it("should handle error state", async () => {
    mockGetScheduledPosts.mockRejectedValue(new Error("API Error"));

    const { useScheduledPosts } = await import("../hooks/useScheduledPosts");

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

    mockGetStats.mockResolvedValue(mockStats);

    const { useScheduledPostStats } = await import(
      "../hooks/useScheduledPostStats"
    );

    const { result } = renderHook(() => useScheduledPostStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockStats);
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

    mockGetAccounts.mockResolvedValue(mockAccounts);

    const { useInstagramAccounts } = await import(
      "../hooks/useInstagramAccounts"
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

    mockGetAccounts.mockResolvedValue(mockAccounts);

    const { useInstagramAccounts } = await import(
      "../hooks/useInstagramAccounts"
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
