import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ideaGenerationSchema = z.object({
  // Campaign info
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),

  // Campaign objective
  objectives: z.array(z.string()).min(1, "Selecione pelo menos um objetivo"),

  // Target persona
  persona_age: z.string().optional(),
  persona_location: z.string().optional(),
  persona_income: z.string().optional(),
  persona_interests: z.string().optional(),
  persona_behavior: z.string().optional(),
  persona_pain_points: z.string().optional(),

  // Social platforms and content types
  platforms: z.array(z.string()).min(1, "Selecione pelo menos uma plataforma"),
  content_types: z.record(z.string(), z.array(z.string())).optional(),

  // Voice tone
  voice_tone: z.string(),

  // Campaign details for AI generation
  product_description: z.string().optional(),
  value_proposition: z.string().optional(),
  campaign_urgency: z.string().optional(),
});

export type PublicIdeaGenerationFormData = z.infer<typeof ideaGenerationSchema>;

interface OptionItem {
  value: string;
  label: string;
}

interface PublicIdeaGenerationOptions {
  objectives: OptionItem[];
  content_types: Record<string, string[]>; // {platform: [content_types]}
  platforms: OptionItem[];
  voice_tones: OptionItem[];
}

export const usePublicIdeaGeneration = (
  _options?: PublicIdeaGenerationOptions,
  onSubmit?: (data: PublicIdeaGenerationFormData) => void
) => {
  const form = useForm<PublicIdeaGenerationFormData>({
    resolver: zodResolver(ideaGenerationSchema),
    defaultValues: {
      title: "",
      description: "",
      objectives: [],
      platforms: [],
      content_types: {},
      voice_tone: "professional",
      product_description: "",
      value_proposition: "",
      campaign_urgency: "",
    },
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<Record<string, string[]>>(
    {}
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper function to get content type labels
  const getContentTypeLabel = (contentType: string): string => {
    const contentTypeLabels: Record<string, string> = {
      post: "Post",
      story: "Story",
      reel: "Reel",
      video: "Vídeo",
      carousel: "Carrossel",
      live: "Live",
      custom: "Custom",
    };
    return contentTypeLabels[contentType] || contentType;
  };

  const handleSubmit = (data: PublicIdeaGenerationFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    let newPlatforms: string[];

    if (checked) {
      newPlatforms = [...selectedPlatforms, platform];
      setSelectedPlatforms(newPlatforms);
    } else {
      newPlatforms = selectedPlatforms.filter((p) => p !== platform);
      setSelectedPlatforms(newPlatforms);
      setContentTypes((prev) => {
        const newTypes = { ...prev };
        delete newTypes[platform];
        return newTypes;
      });
    }

    // Update form value
    form.setValue("platforms", newPlatforms);
  };

  const handleContentTypeChange = (
    platform: string,
    contentType: string,
    checked: boolean
  ) => {
    setContentTypes((prev) => {
      const currentTypes = prev[platform] || [];
      let newContentTypes: Record<string, string[]>;

      if (checked) {
        newContentTypes = {
          ...prev,
          [platform]: [...currentTypes, contentType],
        };
      } else {
        newContentTypes = {
          ...prev,
          [platform]: currentTypes.filter((t) => t !== contentType),
        };
      }

      // Update form value
      form.setValue("content_types", newContentTypes);
      return newContentTypes;
    });
  };

  const handleObjectiveChange = (objectiveValue: string, checked: boolean) => {
    const current = form.watch("objectives");
    if (checked) {
      form.setValue("objectives", [...current, objectiveValue]);
    } else {
      form.setValue(
        "objectives",
        current.filter((o) => o !== objectiveValue)
      );
    }
  };

  const handleVoiceToneChange = (value: string) => {
    form.setValue("voice_tone", value);
  };

  const handleCampaignUrgencyChange = (value: string) => {
    form.setValue("campaign_urgency", value);
  };

  return {
    form,
    selectedPlatforms,
    contentTypes,
    isGenerating,
    setIsGenerating,
    getContentTypeLabel,
    handleSubmit,
    handlePlatformChange,
    handleContentTypeChange,
    handleObjectiveChange,
    handleVoiceToneChange,
    handleCampaignUrgencyChange,
  };
};
