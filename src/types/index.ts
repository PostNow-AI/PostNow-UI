export * from "./auth";
export * from "./credits";
export * from "./instagram";

export interface AIModel {
  id: number;
  name: string;
  provider: string;
  cost_per_token: number;
  is_active: boolean;
}

export interface CostEstimate {
  estimated_tokens: number;
  estimated_cost: number;
  recommended_model: AIModel;
  available_models: AIModel[];
}

export interface IdeaGenerationConfig {
  platforms: string[];
  target_audience: string;
  campaign_objective: string;
  brand_voice: string;
  preferred_provider?: string;
  preferred_model?: string;
  max_cost?: number;
}
