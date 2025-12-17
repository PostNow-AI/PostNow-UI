import { useMutation } from "@tanstack/react-query";

import { getClientSessionId, postAnalyticsEvent } from "@/lib/analytics";
import type { AnalyticsEventPayload } from "@/lib/analytics";

export const useAnalytics = () => {
  const mutation = useMutation({
    mutationFn: async (payload: AnalyticsEventPayload) => {
      return await postAnalyticsEvent(payload);
    },
  });

  const trackEvent = (payload: Omit<AnalyticsEventPayload, "client_session_id">) => {
    // Analytics nunca deve bloquear UX
    mutation.mutate({
      ...payload,
      client_session_id: getClientSessionId(),
    });
  };

  return {
    trackEvent,
    isSending: mutation.isPending,
  };
};

