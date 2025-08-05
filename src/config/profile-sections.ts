import { type CreatorProfile } from "@/lib/creator-profile-api";
import { type Section } from "@/types/profile-completion";

// Calculate section completeness
const getSectionCompleteness = (profile: CreatorProfile, section: string) => {
  switch (section) {
    case "professional": {
      const profFields = [
        profile.specific_profession,
        profile.target_audience,
        profile.communication_tone,
        profile.expertise_areas?.length,
      ];
      return (profFields.filter(Boolean).length / profFields.length) * 100;
    }
    case "content": {
      const contentFields = [
        profile.preferred_duration,
        profile.complexity_level,
        profile.theme_diversity,
        profile.publication_frequency,
      ];
      return (
        (contentFields.filter(Boolean).length / contentFields.length) * 100
      );
    }
    case "social": {
      const socialFields = [
        profile.instagram_username,
        profile.linkedin_url,
        profile.twitter_username,
        profile.tiktok_username,
      ];
      return (socialFields.filter(Boolean).length / socialFields.length) * 100;
    }
    case "business": {
      const businessFields = [
        profile.revenue_stage,
        profile.team_size,
        profile.revenue_goal,
        profile.authority_goal,
        profile.leads_goal,
      ];
      return (
        (businessFields.filter(Boolean).length / businessFields.length) * 100
      );
    }
    case "resources": {
      const resourceFields = [
        profile.has_designer,
        profile.current_tools?.length,
        profile.tools_budget,
        profile.preferred_hours?.length,
      ];
      return (
        (resourceFields.filter(Boolean).length / resourceFields.length) * 100
      );
    }
    default:
      return 0;
  }
};

export const getSections = (profile: CreatorProfile): Section[] => [
  {
    id: "professional",
    title: "Contexto Profissional",
    description: "Informações sobre sua área de atuação",
    completeness: getSectionCompleteness(profile, "professional"),
  },
  {
    id: "content",
    title: "Preferências de Conteúdo",
    description: "Como você gosta de criar e consumir conteúdo",
    completeness: getSectionCompleteness(profile, "content"),
  },
  {
    id: "social",
    title: "Redes Sociais",
    description: "Seus perfis para análise personalizada",
    completeness: getSectionCompleteness(profile, "social"),
  },
  {
    id: "business",
    title: "Contexto de Negócio",
    description: "Suas metas e estágio atual",
    completeness: getSectionCompleteness(profile, "business"),
  },
  {
    id: "resources",
    title: "Recursos Disponíveis",
    description: "Ferramentas e time que você possui",
    completeness: getSectionCompleteness(profile, "resources"),
  },
];
