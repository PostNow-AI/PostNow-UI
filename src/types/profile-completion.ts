import { z } from "zod";

// Validation schema for profile completion
export const profileCompletionSchema = z.object({
  // Important fields (Level 2)
  specific_profession: z.string().optional(),
  target_audience: z.string().optional(),
  communication_tone: z.string().optional(),
  expertise_areas: z.array(z.string()).optional(),
  preferred_duration: z.string().optional(),
  complexity_level: z.string().optional(),
  theme_diversity: z.number().min(0).max(10).optional(),
  publication_frequency: z.string().optional(),

  // Optional fields (Level 3)
  instagram_username: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  twitter_username: z.string().optional(),
  tiktok_username: z.string().optional(),
  revenue_stage: z.string().optional(),
  team_size: z.string().optional(),
  revenue_goal: z.string().optional(),
  authority_goal: z.string().optional(),
  leads_goal: z.string().optional(),
  has_designer: z.boolean().optional(),
  current_tools: z.array(z.string()).optional(),
  tools_budget: z.string().optional(),
  preferred_hours: z.array(z.string()).optional(),
});

export type ProfileCompletionData = z.infer<typeof profileCompletionSchema>;

export interface Section {
  id: string;
  title: string;
  description: string;
  completeness: number;
}
