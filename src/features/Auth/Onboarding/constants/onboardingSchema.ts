import z from "zod";

export const onboardingSchema = z.object({
  // Personal Info (Step 1)
  professional_name: z
    .string()
    .min(2, "Nome profissional deve ter pelo menos 2 caracteres"),
  profession: z.string().min(1, "Por favor, selecione uma profissão"),
  custom_profession: z.string().optional(),
  instagram_username: z.string().optional(),
  whatsapp_number: z
    .string()
    .min(10, "Número de WhatsApp deve ter pelo menos 10 dígitos"),
  // Business Info (Step 2)
  business_name: z
    .string()
    .min(2, "Nome do negócio deve ter pelo menos 2 caracteres"),
  specialization: z.string().min(1, "Por favor, selecione um setor/nicho"),
  custom_specialization: z.string().optional(),
  business_instagram: z.string().optional(),
  business_website: z
    .string()
    .refine((val) => {
      if (!val || val === "") return true; // Allow empty
      // Check if it's a valid URL with or without protocol
      try {
        // If no protocol, add https:// for validation
        const urlToTest =
          val.startsWith("http://") || val.startsWith("https://")
            ? val
            : `https://${val}`;
        new URL(urlToTest);
        return true;
      } catch {
        return false;
      }
    }, "URL do website deve ser válida (ex: exemplo.com ou https://exemplo.com)")
    .optional()
    .or(z.literal("")),
  business_location: z
    .string()
    .min(2, "Localização do negócio deve ter pelo menos 2 caracteres"),
  business_description: z
    .string()
    .min(10, "Descrição do negócio deve ter pelo menos 10 caracteres"),

  // Branding (Step 3)
  voice_tone_personality: z
    .string()
    .min(1, "Por favor, defina o tom de voz e personalidade"),
  logo_image_url: z.string().optional().or(z.literal("")),
  color_1: z.string().optional(),
  color_2: z.string().optional(),
  color_3: z.string().optional(),
  color_4: z.string().optional(),
  color_5: z.string().optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
