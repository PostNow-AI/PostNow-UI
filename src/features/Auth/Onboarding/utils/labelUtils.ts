/**
 * Utility functions for label mapping and display formatting.
 * Centralizes label lookups used across onboarding components.
 */

// Niche ID to label mapping
export const NICHE_LABELS: Record<string, string> = {
  saude: "Saúde & Bem-estar",
  beleza: "Beleza & Estética",
  educacao: "Educação",
  moda: "Moda & Lifestyle",
  alimentacao: "Alimentação",
  servicos: "Serviços",
  pet: "Pet",
  outro: "Outro",
};

// Voice tone ID to label mapping
export const VOICE_TONE_LABELS: Record<string, string> = {
  formal: "Formal e Profissional",
  casual: "Casual e Amigável",
  inspirador: "Inspirador e Motivacional",
  educativo: "Educativo e Didático",
  divertido: "Descontraído e Engraçado",
  autoridade: "Autoridade no Assunto",
};

/**
 * Gets the display label for a niche ID.
 * Returns the ID itself if no mapping is found (for custom niches).
 */
export const getNicheLabel = (id: string): string => {
  if (!id) return id;
  return NICHE_LABELS[id.toLowerCase()] || id;
};

/**
 * Gets the display label for a voice tone ID.
 * Returns the ID itself if no mapping is found.
 */
export const getVoiceToneLabel = (id: string): string => {
  if (!id) return id;
  return VOICE_TONE_LABELS[id.toLowerCase()] || id;
};
