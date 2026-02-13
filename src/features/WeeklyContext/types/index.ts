export interface OpportunityItem {
  titulo_ideia: string;
  score: number;
  explicacao_score: string;
  gatilho_criativo: string;
  url_fonte: string;
  texto_base_analisado: string;
}

export interface OpportunitySection {
  titulo: string;
  count: number;
  items: OpportunityItem[];
}

export interface RankedOpportunities {
  polemica?: OpportunitySection;
  educativo?: OpportunitySection;
  newsjacking?: OpportunitySection;
  futuro?: OpportunitySection;
  estudo_caso?: OpportunitySection;
  entretenimento?: OpportunitySection;
  outros?: OpportunitySection;
}

export interface WeeklyContextData {
  week_number: number;
  week_range: string;
  created_at: string;
  business_name: string;
  has_previous: boolean;
  has_next: boolean;
  ranked_opportunities: RankedOpportunities;
}

export interface WeeklyContextResponse {
  success: boolean;
  data: WeeklyContextData;
}

export type SectionKey = keyof RankedOpportunities;

export const SECTION_CONFIG: Record<
  SectionKey,
  {
    emoji: string;
    borderColor: string;
    bgColor: string;
  }
> = {
  polemica: {
    emoji: "🔥",
    borderColor: "#ef4444",
    bgColor: "#fef2f2",
  },
  educativo: {
    emoji: "📚",
    borderColor: "#10b981",
    bgColor: "#ecfdf5",
  },
  newsjacking: {
    emoji: "📰",
    borderColor: "#f59e0b",
    bgColor: "#fffbeb",
  },
  futuro: {
    emoji: "🔮",
    borderColor: "#8b5cf6",
    bgColor: "#f5f3ff",
  },
  estudo_caso: {
    emoji: "📊",
    borderColor: "#06b6d4",
    bgColor: "#ecfeff",
  },
  entretenimento: {
    emoji: "🎭",
    borderColor: "#ec4899",
    bgColor: "#fdf2f8",
  },
  outros: {
    emoji: "💡",
    borderColor: "#3b82f6",
    bgColor: "#eff6ff",
  },
};

