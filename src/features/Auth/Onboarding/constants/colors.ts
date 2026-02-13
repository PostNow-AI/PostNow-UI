// Cores predefinidas para seleção rápida no color picker
export const PREDEFINED_COLORS = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
  "#8B5CF6", "#F97316", "#06B6D4", "#EC4899",
  "#84CC16", "#6366F1", "#F43F5E", "#14B8A6",
] as const;

// Tipo para as cores predefinidas
export type PredefinedColor = typeof PREDEFINED_COLORS[number];
