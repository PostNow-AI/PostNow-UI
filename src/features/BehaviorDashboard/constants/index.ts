import type { DateRangeOption } from "../types";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: 1, label: "Últimas 24 horas" },
  { value: 7, label: "Últimos 7 dias" },
  { value: 30, label: "Últimos 30 dias" },
  { value: 90, label: "Últimos 90 dias" },
  { value: 180, label: "Últimos 180 dias" },
];

export const DEFAULT_DAYS = 30;

export const METRIC_LABELS = {
  subscriptions: "Assinaturas",
  onboardings: "Onboardings Concluídos",
  images: "Imagens Criadas",
  emailsSent: "E-mails Gerados",
  emailsOpened: "E-mails Abertos",
  postsTotal: "Posts Totais",
  postsEmail: "Posts enviados por E-mail",
  postsManual: "Posts Manuais",
} as const;

export const METRIC_DESCRIPTIONS = {
  subscriptions: "Novas assinaturas criadas",
  onboardings: "Usuários que concluíram o onboarding",
  images: "Imagens geradas (excluindo imagens de e-mail)",
  emailsSent: "Total de e-mails enviados aos usuários",
  emailsOpened: "E-mails abertos pelos destinatários",
  postsTotal: "Total de posts criados no sistema",
  postsEmail: "Posts enviados automaticamente por e-mail",
  postsManual: "Posts criados manualmente pelos usuários",
} as const;
