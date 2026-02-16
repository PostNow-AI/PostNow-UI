import { z } from "zod";

export const postCreationSchema = z.object({
  name: z.string().min(1, "Nome do post é obrigatório"),
  objective: z.enum([
    "sales",
    "branding",
    "engagement",
    "awareness",
    "lead_generation",
    "education",
  ]),
  type: z.enum(["feed", "story", "reels", "carousel"]),
  further_details: z.string().optional(),
  include_image: z.boolean(),
});

export type PostCreationFormData = z.infer<typeof postCreationSchema>;

export const postTabs = [
  {
    id: "feed",
    label: "Feed",
  },
  {
    id: "story",
    label: "Stories",
  },
  {
    id: "reels",
    label: "Reels",
  },
];
