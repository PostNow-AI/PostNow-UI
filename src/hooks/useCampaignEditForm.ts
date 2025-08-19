import type { Campaign } from "@/lib/services/ideaBankService";
import { useState } from "react";

export interface CampaignFormData {
  title: string;
  description: string;
  objectives: string[];
  platforms: string[];
  content_types: Record<string, string[]>;
  voice_tone: string;
  product_description: string;
  value_proposition: string;
  campaign_urgency: string;
  persona_age: string;
  persona_location: string;
  persona_income: string;
  persona_interests: string;
  persona_behavior: string;
  persona_pain_points: string;
}

export const useCampaignEditForm = (campaign: Campaign) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    title: campaign.title || "",
    description: campaign.description || "",
    objectives: Array.isArray(campaign.objectives) ? campaign.objectives : [],
    platforms: Array.isArray(campaign.platforms) ? campaign.platforms : [],
    content_types: campaign.content_types || {},
    voice_tone: campaign.voice_tone || "professional",
    product_description: campaign.product_description || "",
    value_proposition: campaign.value_proposition || "",
    campaign_urgency: campaign.campaign_urgency || "",
    persona_age: campaign.persona_age || "",
    persona_location: campaign.persona_location || "",
    persona_income: campaign.persona_income || "",
    persona_interests: campaign.persona_interests || "",
    persona_behavior: campaign.persona_behavior || "",
    persona_pain_points: campaign.persona_pain_points || "",
  });

  const [newObjective, setNewObjective] = useState("");
  const [newPlatform, setNewPlatform] = useState("");

  // Constants
  const voiceToneOptions = [
    { value: "professional", label: "Profissional" },
    { value: "casual", label: "Casual" },
    { value: "inspirational", label: "Inspirador" },
    { value: "urgent", label: "Urgente" },
    { value: "educational", label: "Educativo" },
  ];

  const objectiveOptions = [
    "sales", // Vendas
    "branding", // Branding
    "engagement", // Engajamento
  ];

  const platformOptions = [
    "instagram",
    "facebook",
    "tiktok",
    "youtube",
    "linkedin",
    "twitter",
  ];

  const urgencyOptions = [
    { value: "high", label: "Alta" },
    { value: "medium", label: "Média" },
    { value: "low", label: "Baixa" },
  ];

  // Handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addObjective = (objective: string) => {
    if (objective && !formData.objectives.includes(objective)) {
      handleArrayChange("objectives", [...formData.objectives, objective]);
    }
  };

  const removeObjective = (index: number) => {
    const updated = formData.objectives.filter((_, i) => i !== index);
    handleArrayChange("objectives", updated);
  };

  const addPlatform = (platform: string) => {
    if (platform && !formData.platforms.includes(platform)) {
      handleArrayChange("platforms", [...formData.platforms, platform]);
    }
  };

  const removePlatform = (index: number) => {
    const updated = formData.platforms.filter((_, i) => i !== index);
    handleArrayChange("platforms", updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be handled by the parent component
  };

  const resetForm = () => {
    setFormData({
      title: campaign.title || "",
      description: campaign.description || "",
      objectives: Array.isArray(campaign.objectives) ? campaign.objectives : [],
      platforms: Array.isArray(campaign.platforms) ? campaign.platforms : [],
      content_types: campaign.content_types || {},
      voice_tone: campaign.voice_tone || "professional",
      product_description: campaign.product_description || "",
      value_proposition: campaign.value_proposition || "",
      campaign_urgency: campaign.campaign_urgency || "",
      persona_age: campaign.persona_age || "",
      persona_location: campaign.persona_location || "",
      persona_income: campaign.persona_income || "",
      persona_interests: campaign.persona_interests || "",
      persona_behavior: campaign.persona_behavior || "",
      persona_pain_points: campaign.persona_pain_points || "",
    });
    setNewObjective("");
    setNewPlatform("");
  };

  return {
    // State
    formData,
    newObjective,
    newPlatform,

    // Constants
    voiceToneOptions,
    objectiveOptions,
    platformOptions,
    urgencyOptions,

    // Handlers
    handleInputChange,
    handleArrayChange,
    addObjective,
    removeObjective,
    addPlatform,
    removePlatform,
    handleSubmit,
    resetForm,

    // Setters
    setNewObjective,
    setNewPlatform,
  };
};
