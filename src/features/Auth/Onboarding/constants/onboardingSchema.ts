import z from "zod";

export const onboardingSchema = z.object({
  // Business Info (Step 1)
  business_name: z
    .string()
    .min(1, "Nome do negócio é obrigatório")
    .max(200, "Nome do negócio deve ter no máximo 200 caracteres"),
  business_phone: z
    .string()
    .min(1, "Número do WhatsApp é obrigatório")
    .max(20, "Número do WhatsApp deve ter no máximo 20 caracteres"),
  business_website: z.string().url("URL inválida").optional().or(z.literal("")),
  business_instagram_handle: z
    .string()
    .max(100, "Instagram deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  specialization: z
    .string()
    .min(1, "Nicho de atuação é obrigatório")
    .max(200, "Nicho de atuação deve ter no máximo 200 caracteres"),
  business_description: z.string().min(1, "Descrição do negócio é obrigatória"),
  business_purpose: z.string().min(1, "Propósito do negócio é obrigatório"),
  brand_personality: z.string().min(1, "Personalidade da marca é obrigatória"),
  products_services: z.string().min(1, "Produtos/serviços são obrigatórios"),
  business_location: z
    .string()
    .min(1, "Localização do negócio é obrigatória")
    .max(100, "Localização deve ter no máximo 100 caracteres"),
  target_audience: z.string().min(1, "Público-alvo é obrigatório"),
  target_interests: z.string().optional().or(z.literal("")),
  main_competitors: z.string().optional().or(z.literal("")),
  reference_profiles: z.string().optional().or(z.literal("")),

  // Branding (Step 2)
  voice_tone: z
    .string()
    .min(1, "Tom de voz é obrigatório")
    .max(100, "Tom de voz deve ter no máximo 100 caracteres"),
  logo: z.string().optional().or(z.literal("")),
  color_1: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Cor deve ser um código hex válido (ex: #FFFFFF)"
    )
    .optional()
    .or(z.literal("")),
  color_2: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Cor deve ser um código hex válido (ex: #FFFFFF)"
    )
    .optional()
    .or(z.literal("")),
  color_3: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Cor deve ser um código hex válido (ex: #FFFFFF)"
    )
    .optional()
    .or(z.literal("")),
  color_4: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Cor deve ser um código hex válido (ex: #FFFFFF)"
    )
    .optional()
    .or(z.literal("")),
  color_5: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Cor deve ser um código hex válido (ex: #FFFFFF)"
    )
    .optional()
    .or(z.literal("")),
  visual_style_id: z.string().optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const genderOptions = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
  { value: "all", label: "Todos" },
  { value: "non_binary", label: "Não Binário" },
] as const;

export const ageRangeOptions = [
  { value: "all", label: "Todos" },
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55-64", label: "55-64" },
  { value: "65+", label: "65+" },
] as const;
