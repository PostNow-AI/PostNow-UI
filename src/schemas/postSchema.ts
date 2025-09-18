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
  name: z
    .string()
    .min(1, "Nome do post é obrigatório")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  objective: PostObjectiveEnum,
  type: PostTypeEnum,

  // Optional target audience fields
  target_gender: GenderEnum.optional(),
  target_age: z
    .string()
    .max(50, "Idade deve ter no máximo 50 caracteres")
    .optional(),
  target_location: z
    .string()
    .max(100, "Localização deve ter no máximo 100 caracteres")
    .optional(),
  target_salary: z
    .string()
    .max(100, "Salário deve ter no máximo 100 caracteres")
    .optional(),
  target_interests: z.string().optional(),

  // AI preferences (required)
  preferred_provider: AIProviderEnum,
  preferred_model: z.string().min(1, "Modelo é obrigatório"),

  // Image generation flag (required)
  include_image: z.boolean(),
});

export type PostCreationFormData = z.infer<typeof postCreationSchema>;

// Options for form dropdowns
export const postObjectiveOptions = [
  { value: "sales", label: "Vendas" },
  { value: "branding", label: "Branding" },
  { value: "engagement", label: "Engajamento" },
  { value: "awareness", label: "Conscientização" },
  { value: "lead_generation", label: "Geração de Leads" },
  { value: "education", label: "Educação" },
] as const;

export const postTypeOptions = [
  { value: "live", label: "Live" },
  { value: "reel", label: "Reel" },
  { value: "post", label: "Post" },
  { value: "carousel", label: "Carousel" },
  { value: "story", label: "Story" },
] as const;

export const genderOptions = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
  { value: "all", label: "Todos" },
  { value: "non_binary", label: "Não Binário" },
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
