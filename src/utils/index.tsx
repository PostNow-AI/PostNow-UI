import type { CampaignIdea } from "@/lib/services/ideaBankService";

export const isCampaignIdea = (idea: CampaignIdea): boolean => {
  try {
    if (!idea.content) return false;
    const content = JSON.parse(idea.content);
    return content.variacao_a && content.variacao_b && content.variacao_c;
  } catch {
    return false;
  }
};

export const ideaToCampaignData = (idea: CampaignIdea) => {
  try {
    // Se já é uma campanha, retorna os dados
    if (isCampaignIdea(idea)) {
      const content = JSON.parse(idea.content);
      return {
        plataforma: content.plataforma || idea.platform,
        tipo_conteudo: content.tipo_conteudo || idea.content_type,
        titulo_principal: content.titulo_principal || idea.title,
        variacao_a: content.variacao_a || {},
        variacao_b: content.variacao_b || {},
        variacao_c: content.variacao_c || {},
        estrategia_implementacao:
          content.estrategia_implementacao || idea.description,
        metricas_sucesso: content.metricas_sucesso || [],
        proximos_passos: content.proximos_passos || [],
      };
    }

    // Se não é uma campanha, cria uma estrutura de campanha a partir da ideia
    const baseVariation = {
      headline: idea.headline || idea.title,
      copy: idea.copy || idea.description,
      cta: idea.cta || "Clique para saber mais!",
      hashtags: idea.hashtags || ["#ideia", "#conteudo"],
      visual_description: idea.visual_description || "Descrição visual padrão",
      color_composition: idea.color_composition || "Paleta de cores padrão",
    };

    return {
      plataforma: idea.platform || "instagram",
      tipo_conteudo: idea.content_type || "post",
      titulo_principal: idea.title || "Ideia",
      variacao_a: { ...baseVariation },
      variacao_b: { ...baseVariation },
      variacao_c: { ...baseVariation },
      estrategia_implementacao:
        idea.description || "Implementar conforme planejado",
      metricas_sucesso: ["Engajamento", "Alcance", "Conversões"],
      proximos_passos: ["Monitorar resultados", "Otimizar campanha"],
    };
  } catch {
    // Fallback para ideias sem conteúdo estruturado
    const baseVariation = {
      headline: idea.title || "Ideia",
      copy: idea.description || "Descrição da ideia",
      cta: "Clique para saber mais!",
      hashtags: ["#ideia", "#conteudo"],
      visual_description: "Descrição visual padrão",
      color_composition: "Paleta de cores padrão",
    };

    return {
      plataforma: idea.platform || "instagram",
      tipo_conteudo: idea.content_type || "post",
      titulo_principal: idea.title || "Ideia",
      variacao_a: { ...baseVariation },
      variacao_b: { ...baseVariation },
      variacao_c: { ...baseVariation },
      estrategia_implementacao:
        idea.description || "Implementar conforme planejado",
      metricas_sucesso: ["Engajamento", "Alcance", "Conversões"],
      proximos_passos: ["Monitorar resultados", "Otimizar campanha"],
    };
  }
};
