/**
 * Hook for fetching scheduled posts.
 */

import { useQuery } from "@tanstack/react-query";
import { instagramSchedulingService } from "../services";
import type { ScheduledPostStatus } from "../types";

export const SCHEDULED_POSTS_QUERY_KEY = ["scheduled-posts"];

interface UseScheduledPostsOptions {
  status?: ScheduledPostStatus;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

/**
 * Hook to fetch scheduled posts with optional filters.
 */
export function useScheduledPosts(options: UseScheduledPostsOptions = {}) {
  const { status, startDate, endDate, enabled = true } = options;

  return useQuery({
    queryKey: [...SCHEDULED_POSTS_QUERY_KEY, { status, startDate, endDate }],
    queryFn: () =>
      instagramSchedulingService.getScheduledPosts({
        status,
        start_date: startDate,
        end_date: endDate,
      }),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single scheduled post by ID.
 */
export function useScheduledPost(postId: number | null) {
  return useQuery({
    queryKey: [...SCHEDULED_POSTS_QUERY_KEY, postId],
    queryFn: () => instagramSchedulingService.getScheduledPost(postId!),
    enabled: !!postId,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch calendar events.
 */
export function useScheduledPostsCalendar(start?: string, end?: string) {
  return useQuery({
    queryKey: [...SCHEDULED_POSTS_QUERY_KEY, "calendar", { start, end }],
    queryFn: () =>
      instagramSchedulingService.getCalendarEvents({ start, end }),
    staleTime: 60 * 1000, // 1 minute
  });
}
