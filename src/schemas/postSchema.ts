import { z } from "zod";

// Post model field choices based on Django model
export const PostObjectiveEnum = z.enum([
  "sales",
  "branding",
  "engagement",
  "awareness",
  "lead_generation",
  "education",
]);

export const PostTypeEnum = z.enum([
  "live",
  "reel",
  "post",
  "carousel",
  "story",
]);

export const GenderEnum = z.enum(["male", "female", "all", "non_binary"]);

// AI Provider options
export const AIProviderEnum = z.enum(["google", "openai", "anthropic"]);

// Post creation schema matching Django Post model
export const postCreationSchema = z.object({
  // Required fields
  name: z.string().optional(),
  objective: PostObjectiveEnum,
  type: PostTypeEnum,

  // Optional
  further_details: z.string().optional(),

  // Image generation flag (required)
  include_image: z.boolean(),
});

export type PostCreationFormData = z.infer<typeof postCreationSchema>;

// Options for form dropdowns
export const postObjectiveOptions = [
  { value: "sales", label: "Vendas" },
  { value: "branding", label: "Autoridade de marca" },
  { value: "engagement", label: "Engajamento" },
] as const;

export const postTypeOptions = [
  { value: "reel", label: "Reel" },
  { value: "post", label: "Feed" },
  { value: "story", label: "Story" },
] as const;

export const aiProviderOptions = [
  { value: "google", label: "Google (Gemini)" },
  { value: "openai", label: "OpenAI (GPT)" },
  { value: "anthropic", label: "Anthropic (Claude)" },
] as const;

export const aiModelOptions = {
  google: [
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash (Rápido)" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro (Avançado)" },
  ],
  openai: [
    { value: "gpt-4o-mini", label: "GPT-4O Mini (Rápido)" },
    { value: "gpt-4o", label: "GPT-4O (Avançado)" },
  ],
  anthropic: [
    { value: "claude-3-haiku", label: "Claude 3 Haiku (Rápido)" },
    { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet (Avançado)" },
  ],
} as const;
