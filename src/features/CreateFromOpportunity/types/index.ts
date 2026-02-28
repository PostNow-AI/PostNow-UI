export interface VisualStyle {
  id: number;
  name: string;
  description: string;
  preview_image_url?: string;
}

export interface OpportunityParams {
  topic: string;
  category: string;
  score: number;
}

export interface CreatePostData {
  name: string;
  objective: "branding" | "engagement" | "education" | "sales" | "awareness" | "lead_generation";
  type: "feed" | "reels" | "story" | "carousel";
  further_details?: string;
  include_image: boolean;
  style_id?: number;
}

export interface GeneratedPost {
  id: number;
  content: string;
  image_url?: string;
}

export interface CreateFromOpportunityState {
  step: number;
  topic: string;
  category: string;
  score: number;
  furtherDetails: string;
  selectedStyleId: number | null;
  isGenerating: boolean;
  generatedContent: string | null;
  generatedImageUrl: string | null;
  error: string | null;
}

export type CategoryKey =
  | "polemica"
  | "educativo"
  | "newsjacking"
  | "entretenimento"
  | "estudo_caso"
  | "futuro"
  | "outros";

export const CATEGORY_LABELS: Record<CategoryKey, { label: string; emoji: string }> = {
  polemica: { label: "Polêmico", emoji: "🔥" },
  educativo: { label: "Educativo", emoji: "🧠" },
  newsjacking: { label: "Newsjacking", emoji: "📰" },
  entretenimento: { label: "Entretenimento", emoji: "😂" },
  estudo_caso: { label: "Estudo de Caso", emoji: "💼" },
  futuro: { label: "Futuro", emoji: "🔮" },
  outros: { label: "Outros", emoji: "⚡" },
};
