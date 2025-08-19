export const GENERATION_STEPS = [
  "Iniciando geração...",
  "Analisando parâmetros da campanha...",
  "Criando estrutura da campanha...",
  "Gerando primeira ideia (A)...",
  "Gerando segunda ideia (B)...",
  "Gerando terceira ideia (C)...",
  "Finalizando e salvando...",
  "Concluído!",
];

export const IMPROVEMENT_STEPS = [
  "Analisando ideia original...",
  "Processando prompt de melhoria...",
  "Gerando versão melhorada...",
  "Validando resultado...",
  "Concluído!",
];

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  post: "Post",
  story: "Story",
  reel: "Reel",
  video: "Vídeo",
  carousel: "Carrossel",
  live: "Live",
  custom: "Custom",
};

export const CAMPAIGN_URGENCY_OPTIONS = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
];

export const DEFAULT_VOICE_TONE = "professional";
