import z from "zod";

export const onboardingSchema = z.object({
  // Personal Info (Step 1)
  professional_name: z
    .string()
    .min(2, "Nome profissional deve ter pelo menos 2 caracteres"),
  profession: z.string().min(1, "Por favor, insira uma profissão"),
  instagram_username: z.string().optional(),
  whatsapp_number: z
    .string()
    .min(1, "Número de WhatsApp é obrigatório")
    .refine(
      (value) => {
        // Remove all non-digit characters for validation
        const cleanNumber = value.replace(/\D/g, "");

        // Must have 10 or 11 digits (Brazilian format)
        if (cleanNumber.length !== 11) {
          return false;
        }

        // Must start with valid area code (11-99)
        const areaCode = parseInt(cleanNumber.substring(0, 2));
        if (areaCode < 11 || areaCode > 99) {
          return false;
        }

        // For 11-digit numbers (mobile), the 3rd digit must be 9
        if (cleanNumber.length === 11) {
          return cleanNumber[2] === "9";
        }

        return true;
      },
      {
        message:
          "Número de WhatsApp deve ser um número de celular brasileiro válido. Ex: (11) 99999-9999",
      }
    ),
  // Business Info (Step 2)
  business_name: z
    .string()
    .min(2, "Nome do negócio deve ter pelo menos 2 caracteres"),
  specialization: z.string().optional(),
  business_description: z
    .string()
    .min(10, "Descrição do negócio deve ter pelo menos 10 caracteres"),
  target_gender: z.string().min(1, "Por favor, selecione um gênero"),
  target_age_range: z.string().min(1, "Por favor, selecione uma faixa etária"),
  target_interests: z.string().optional(),
  target_location: z.string().min(2, "Por favor, insira uma localização"),

  // Branding (Step 3)
  voice_tone: z
    .string()
    .min(1, "Por favor, defina o tom de voz e personalidade"),
  logo: z.string().optional().or(z.literal("")),
  color_1: z.string().optional(),
  color_2: z.string().optional(),
  color_3: z.string().optional(),
  color_4: z.string().optional(),
  color_5: z.string().optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const genderOptions = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
  { value: "all", label: "Todos" },
  { value: "non_binary", label: "Não Binário" },
] as const;

export const ageRangeOptions = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55-64", label: "55-64" },
  { value: "65+", label: "65+" },
] as const;
