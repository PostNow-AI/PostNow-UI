export interface AIModel {
  value: string;
  label: string;
  provider: string;
}

export const AI_MODELS: AIModel[] = [
  // Google (Gemini) Models
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "Google" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "Google" },
  { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro", provider: "Google" },

  // OpenAI Models
  { value: "gpt-4", label: "GPT-4", provider: "OpenAI" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo", provider: "OpenAI" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", provider: "OpenAI" },

  // Anthropic Models
  { value: "claude-3-opus", label: "Claude 3 Opus", provider: "Anthropic" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet", provider: "Anthropic" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku", provider: "Anthropic" },
];

export const getModelsByProvider = (provider: string): AIModel[] => {
  return AI_MODELS.filter((model) => model.provider === provider);
};

export const getDefaultModelForProvider = (provider: string): string => {
  const models = getModelsByProvider(provider);
  if (models.length === 0) return "";

  // Return the first model as default
  return models[0].value;
};

export const getProviderFromModel = (modelValue: string): string => {
  const model = AI_MODELS.find((m) => m.value === modelValue);
  return model?.provider || "";
};
