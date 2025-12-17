import { z } from "zod";

import { api } from "@/lib/api";

export const AnalyticsEventNameEnum = z.enum([
  "idea_view_opened",
  "idea_copy_clicked",
  "idea_regenerate_clicked",
  "image_generate_clicked",
  "image_regenerate_clicked",
  "image_download_clicked",
  "image_download_succeeded",
  "image_download_failed",
  "post_save_clicked",
  "decision_made",
]);

export const AnalyticsResourceTypeEnum = z.enum(["Post", "PostIdea", "User"]);

export const analyticsEventSchema = z.object({
  event_name: AnalyticsEventNameEnum,
  occurred_at: z.string().datetime().optional(),
  client_session_id: z.string().uuid(),
  request_id: z.string().uuid().optional().nullable(),
  resource_type: AnalyticsResourceTypeEnum.optional(),
  resource_id: z.string().optional(),
  decision_id: z.string().uuid().optional().nullable(),
  policy_id: z.string().max(120).optional(),
  // Zod nesta base exige keySchema + valueSchema
  context: z.record(z.string(), z.unknown()).optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type AnalyticsEventPayload = z.infer<typeof analyticsEventSchema>;

const CLIENT_SESSION_STORAGE_KEY = "postnow_client_session_id";

const generateUUID = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // Fallback simples (não cripto forte, mas suficiente p/ session id)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getClientSessionId = () => {
  if (typeof window === "undefined") return generateUUID();

  const existing = window.localStorage.getItem(CLIENT_SESSION_STORAGE_KEY);
  if (existing) return existing;

  const created = generateUUID();
  window.localStorage.setItem(CLIENT_SESSION_STORAGE_KEY, created);
  return created;
};

export const postAnalyticsEvent = async (payload: AnalyticsEventPayload) => {
  const enriched: AnalyticsEventPayload = {
    ...payload,
    occurred_at: payload.occurred_at ?? new Date().toISOString(),
    client_session_id: payload.client_session_id || getClientSessionId(),
    context: payload.context ?? {},
    properties: payload.properties ?? {},
  };

  // Validação local para evitar mandar payload inválido em prod.
  const parsed = analyticsEventSchema.safeParse(enriched);
  if (!parsed.success) {
    return { status: "skipped_invalid_payload" as const };
  }

  const response = await api.post("/api/v1/analytics/events/", parsed.data);
  return response.data;
};

