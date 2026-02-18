import { useMemo } from "react";
import type { OnboardingTempData } from "./useOnboardingStorage";

interface PreviewIdea {
  title: string;
  description: string;
}

// Parse do JSON de audiência para texto legível
const parseAudienceForIdea = (value: string): string => {
  try {
    const parsed = JSON.parse(value);
    const genderLabels: Record<string, string> = {
      mulheres: "mulheres",
      homens: "homens",
      todos: "pessoas",
    };

    // Retorna o público de forma legível
    if (parsed.gender?.includes("todos")) {
      return "seu público";
    } else if (parsed.gender?.length > 0) {
      return parsed.gender.map((g: string) => genderLabels[g] || g).join(" e ");
    }
  } catch {
    // não é JSON
  }
  return "seu público";
};

/**
 * Gera ideias de preview baseadas nos dados do onboarding
 * Usa templates dinâmicos que se adaptam ao nicho e público
 */
export const usePreviewIdeas = (data: OnboardingTempData): PreviewIdea[] => {
  return useMemo(() => {
    const { specialization, target_audience, business_name, brand_personality } = data;

    // Extrair primeira personalidade se existir (limpando "[custom]")
    const personality = Array.isArray(brand_personality) && brand_personality.length > 0
      ? brand_personality.find(p => !p.startsWith("[custom]")) || "profissional"
      : "profissional";

    // Parse do público-alvo
    const audienceText = target_audience ? parseAudienceForIdea(target_audience) : "seu público";

    // Templates baseados no nicho
    const nicheTemplates: Record<string, PreviewIdea[]> = {
      "Marketing Digital": [
        { title: `5 erros comuns no Instagram`, description: "Conteúdo educativo" },
        { title: `Como aumentar seu alcance`, description: "Dicas práticas" },
        { title: `Bastidores de ${business_name || "sua marca"}`, description: "Humanize sua marca" },
      ],
      "Saúde e Bem-estar": [
        { title: `3 hábitos para ter mais energia`, description: "Dicas de rotina" },
        { title: `Mito ou verdade?`, description: "Conteúdo educativo" },
        { title: `Dica de autocuidado`, description: "Conexão emocional" },
      ],
      "Alimentação": [
        { title: `Receita fácil e saudável`, description: "Conteúdo prático" },
        { title: `Benefícios de uma boa alimentação`, description: "Eduque seu público" },
        { title: `O que preparar hoje?`, description: "Inspiração diária" },
      ],
      "Moda e Beleza": [
        { title: `Tendências do momento`, description: "Posicione-se como autoridade" },
        { title: `Dicas de estilo`, description: "Conteúdo engajante" },
        { title: `Novidades em ${business_name || "breve"}`, description: "Gere expectativa" },
      ],
      "Educação": [
        { title: `Por onde começar?`, description: "Guia para iniciantes" },
        { title: `Dica rápida do dia`, description: "Microlearning" },
        { title: `Responda suas dúvidas`, description: "Interação direta" },
      ],
    };

    // Templates genéricos baseados no público
    const audienceBasedTemplates: PreviewIdea[] = [
      {
        title: `O que ${audienceText} precisa saber`,
        description: "Conteúdo direcionado"
      },
      {
        title: `Por trás de ${business_name || "nossa marca"}`,
        description: "Humanize sua marca"
      },
      {
        title: personality === "Divertido" || personality === "divertido"
          ? "Hora de rir um pouco!"
          : "Inspiração para hoje",
        description: "Engajamento diário"
      },
    ];

    // Tentar encontrar templates do nicho
    const nicheIdeas = Object.entries(nicheTemplates).find(
      ([key]) => specialization?.toLowerCase().includes(key.toLowerCase())
    );

    if (nicheIdeas) {
      return nicheIdeas[1];
    }

    // Fallback para templates baseados no público
    return audienceBasedTemplates;
  }, [data]);
};
