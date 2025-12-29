/**
 * Constants e Zod schemas para Campaigns.
 * Seguindo padrão de IdeaBank/constants/index.ts
 */

import { z } from "zod";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const briefingSchema = z.object({
  objective: z
    .string()
    .min(10, "Descreva o objetivo em pelo menos 10 caracteres")
    .max(1000, "Objetivo muito longo"),
  main_message: z
    .string()
    .min(5, "Mensagem principal é obrigatória")
    .max(500, "Mensagem muito longa")
    .optional()
    .or(z.literal("")),
  has_cases: z.boolean().optional(),
  cases_description: z.string().optional(),
  has_materials: z.boolean().optional(),
  materials_description: z.string().optional(),
  deadline: z.string().optional(),
  additional_info: z.string().optional(),
});

export type BriefingFormData = z.infer<typeof briefingSchema>;

export const campaignCreationSchema = z.object({
  name: z.string().min(1, "Nome da campanha é obrigatório"),
  type: z.enum([
    "branding",
    "sales",
    "launch",
    "education",
    "engagement",
    "lead_generation",
    "portfolio",
  ]),
  objective: z.string().min(10, "Objetivo deve ter pelo menos 10 caracteres"),
  main_message: z.string().optional(),
  structure: z.enum(["aida", "pas", "funil", "bab", "storytelling", "simple"]),
  duration_days: z.number().min(5).max(30),
  post_count: z.number().min(4).max(20),
  post_frequency: z.number().min(2).max(7).optional(),
  visual_styles: z.array(z.string()).min(1).max(3),
  briefing_data: z.record(z.any()).optional(),
});

export type CampaignCreationFormData = z.infer<typeof campaignCreationSchema>;

// ============================================================================
// OPTIONS
// ============================================================================

export const campaignTypeOptions = [
  { value: "branding", label: "Branding e Posicionamento" },
  { value: "sales", label: "Campanha de Vendas" },
  { value: "launch", label: "Lançamento de Produto/Serviço" },
  { value: "education", label: "Educação de Mercado" },
  { value: "engagement", label: "Engajamento" },
  { value: "lead_generation", label: "Geração de Leads" },
  { value: "portfolio", label: "Portfólio/Showcase" },
];

export const structureOptions = [
  { value: "aida", label: "AIDA (Clássico)" },
  { value: "pas", label: "Problem-Agitate-Solve" },
  { value: "funil", label: "Funil de Conteúdo" },
  { value: "bab", label: "Before-After-Bridge" },
  { value: "storytelling", label: "Jornada do Herói" },
  { value: "simple", label: "Sequência Simples" },
];

