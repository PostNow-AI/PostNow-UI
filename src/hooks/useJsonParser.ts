import { useCallback, useEffect, useState } from "react";

// Mapeamento de tradução para chaves JSON
const KEY_TRANSLATIONS: Record<string, string> = {
  // Campos principais
  headline: "Título Principal",
  copy: "Texto do Conteúdo",
  cta: "Chamada para Ação",
  hashtags: "Hashtags",
  visual_description: "Descrição Visual",
  color_composition: "Composição de Cores",

  // Campos de campanha
  plataforma: "Plataforma",
  tipo_conteudo: "Tipo de Conteúdo",
  titulo_principal: "Título Principal",
  variacao_a: "Ideia A",
  variacao_b: "Ideia B",
  variacao_c: "Ideia C",
  estrategia_implementacao: "Estratégia de Implementação",
  metricas_sucesso: "Métricas de Sucesso",
  proximos_passos: "Próximos Passos",

  // Campos de persona
  persona_age: "Faixa Etária",
  persona_location: "Localização",
  persona_income: "Faixa de Renda",
  persona_interests: "Interesses",
  persona_behavior: "Comportamento",
  persona_pain_points: "Pontos de Dor",

  // Campos de campanha
  objectives: "Objetivos",
  platforms: "Plataformas",
  content_types: "Tipos de Conteúdo",
  voice_tone: "Tom de Voz",
  product_description: "Descrição do Produto",
  value_proposition: "Proposta de Valor",
  campaign_urgency: "Urgência da Campanha",

  // Campos de ideia
  title: "Título",
  description: "Descrição",
  content: "Conteúdo",
  platform: "Plataforma",
  content_type: "Tipo de Conteúdo",
  variation_type: "Tipo de Variação",
  status: "Status",

  // Campos de usuário
  user: "Usuário",
  email: "E-mail",
  first_name: "Nome",
  last_name: "Sobrenome",

  // Campos de tempo
  created_at: "Criado em",
  updated_at: "Atualizado em",
  generated_at: "Gerado em",
};

// Tradução de valores específicos
const CONTENT_TYPE_TRANSLATIONS: Record<string, string> = {
  post: "Post",
  story: "Story",
  reel: "Reel",
  video: "Vídeo",
  carousel: "Carrossel",
  live: "Live",
  custom: "Personalizado",
};

// Mapa inverso para salvar valor normalizado ao editar
const CONTENT_TYPE_INVERSE: Record<string, string> = {
  post: "post",
  story: "story",
  reel: "reel",
  video: "video",
  vídeo: "video",
  carrossel: "carousel",
  carousel: "carousel",
  live: "live",
  personalizado: "custom",
  personalizad: "custom",
};

// Função auxiliar para corrigir JSON malformado
const fixMalformedJson = (content: string): string => {
  let cleanedContent = content.trim();

  // Remover markdown se presente
  if (cleanedContent.startsWith("```json")) {
    cleanedContent = cleanedContent.substring(7);
  }
  if (cleanedContent.startsWith("```")) {
    cleanedContent = cleanedContent.substring(3);
  }
  if (cleanedContent.endsWith("```")) {
    cleanedContent = cleanedContent.substring(0, cleanedContent.length - 3);
  }

  cleanedContent = cleanedContent.trim();

  // Converter aspas simples para duplas (problema comum do Gemini)
  cleanedContent = cleanedContent.replace(/'/g, '"');

  // Corrigir arrays malformados (problema específico do hashtags)
  cleanedContent = cleanedContent.replace(/\)\s*}/g, "] }");
  cleanedContent = cleanedContent.replace(/\)\s*,/g, "],");
  cleanedContent = cleanedContent.replace(/\)\s*$/g, "]");

  // Corrigir especificamente o problema do hashtags que termina com parêntese
  cleanedContent = cleanedContent.replace(/([^[]*)\s*\)\s*([,}])/g, "$1]$2");
  cleanedContent = cleanedContent.replace(/([^[]*)\s*\)\s*$/g, "$1]");

  // Correção mais agressiva para arrays malformados
  cleanedContent = cleanedContent.replace(/(\[.*?)(\))(.*?[,}])/g, "$1]$3");
  cleanedContent = cleanedContent.replace(/(\[.*?)(\))(\s*$)/g, "$1]$3");

  // Corrigir problemas comuns de formatação
  cleanedContent = cleanedContent.replace(/,\s*}/g, "}");
  cleanedContent = cleanedContent.replace(/,\s*]/g, "]");

  // Correção específica para o problema do "De Programador a Líder"
  cleanedContent = cleanedContent.replace(
    /"De Programador a Líder"/g,
    '"De Programador a Líder"'
  );

  // Correção específica para aspas duplas malformadas
  cleanedContent = cleanedContent.replace(/""/g, '"');

  // Tentar uma abordagem mais robusta se ainda houver problemas
  try {
    JSON.parse(cleanedContent);
  } catch {
    // Se ainda há erro, tentar correções mais agressivas
    cleanedContent = cleanedContent.replace(
      /([^\\])"([^",:}]+)"([^",:}])/g,
      '$1"$2\\"$3'
    );
    cleanedContent = cleanedContent.replace(
      /(\[.*?)"([^"]*?)"\s*\)/g,
      '$1"$2"]'
    );
  }

  return cleanedContent;
};

export const useJsonParser = (
  content: string,
  readOnly: boolean,
  onContentChange?: (newContent: string) => void
) => {
  const [parsedContent, setParsedContent] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para traduzir chaves
  const translateKey = (key: string): string => {
    return KEY_TRANSLATIONS[key] || key;
  };

  // Tradução de valores específicos
  const translateValue = (key: string, value: unknown): unknown => {
    if (typeof value !== "string") return value;
    if (key === "tipo_conteudo" || key === "content_type") {
      return CONTENT_TYPE_TRANSLATIONS[value] || value;
    }
    return value;
  };

  // Parse JSON content
  const parseContent = useCallback(() => {
    try {
      if (!content || content.trim() === "") {
        setParsedContent({});
        setError(null);
        return;
      }

      const cleanedContent = fixMalformedJson(content);

      const parsed = JSON.parse(cleanedContent);
      setParsedContent(parsed);
      setError(null);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Usando fallback de emergência...");

      // Use emergency fallback instead of showing error
      try {
        const fallbackContent = emergencyFallback(content);
        setParsedContent(fallbackContent);
        setError(null);
      } catch (fallbackError) {
        console.error("Emergency fallback failed:", fallbackError);
        setError(
          `Erro ao analisar JSON: ${
            parseError instanceof Error
              ? parseError.message
              : "Erro desconhecido"
          }`
        );
        setParsedContent(null);
      }
    }
  }, [content]);

  // Parse content on mount and when content changes
  useEffect(() => {
    parseContent();
  }, [content, parseContent]);

  // Handle field changes
  const handleFieldChange = (path: string[], value: string | string[]) => {
    if (!parsedContent || readOnly) return;

    const newContent = { ...parsedContent };
    let current = newContent as Record<string, unknown>;

    // Navigate to the nested field
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current) || typeof current[path[i]] !== "object") {
        current[path[i]] = {};
      }
      current = current[path[i]] as Record<string, unknown>;
    }

    // Set the value
    current[path[path.length - 1]] = value;

    // Update content
    const newContentString = JSON.stringify(newContent, null, 2);
    if (onContentChange) {
      onContentChange(newContentString);
    }
    setParsedContent(newContent);
  };

  // Handle string field changes with content type normalization
  const handleStringFieldChange = (
    path: string[],
    key: string,
    value: string
  ) => {
    const isContentTypeKey = key === "tipo_conteudo" || key === "content_type";
    if (isContentTypeKey) {
      const typed = value.toLowerCase().trim();
      const normalized = CONTENT_TYPE_INVERSE[typed] || typed;
      handleFieldChange(path, normalized);
    } else {
      handleFieldChange(path, value);
    }
  };

  // Handle array field changes
  const handleArrayFieldChange = (path: string[], value: string) => {
    const arrayValue = value.split("\n").filter((item) => item.trim());
    handleFieldChange(path, arrayValue);
  };

  // Handle content change from error state
  const handleContentChange = (newContent: string) => {
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  // Create empty structure
  const createEmptyStructure = () => {
    const emptyContent = "{}";
    if (onContentChange) {
      onContentChange(emptyContent);
    }
    setParsedContent({});
  };

  // Emergency fallback for extremely malformed JSON
  const emergencyFallback = (originalContent: string) => {
    try {
      // Extract basic structure and rebuild cleanly
      const titleMatch = originalContent.match(
        /"titulo_principal":\s*"([^"]+)"/
      );
      const headlineMatch = originalContent.match(/"headline":\s*"([^"]+)"/);
      const copyMatch = originalContent.match(/"copy":\s*"([^"]+)"/);
      const ctaMatch = originalContent.match(/"cta":\s*"([^"]+)"/);
      const hashtagsMatch = originalContent.match(/"hashtags":\s*\[(.*?)\]/s);

      const fallbackJson = {
        plataforma: "youtube",
        tipo_conteudo: "video",
        titulo_principal: titleMatch ? titleMatch[1] : "Título não encontrado",
        variacao_a: {
          headline: headlineMatch
            ? headlineMatch[1]
            : "Headline não encontrada",
          copy: copyMatch ? copyMatch[1] : "Copy não encontrado",
          cta: ctaMatch ? ctaMatch[1] : "CTA não encontrado",
          hashtags: hashtagsMatch
            ? hashtagsMatch[1]
                .split(",")
                .map((tag) => tag.trim().replace(/"/g, ""))
            : ["#exemplo"],
          visual_description: "Descrição visual não disponível",
          color_composition: "Composição de cores não disponível",
        },
      };

      return fallbackJson;
    } catch {
      return {
        plataforma: "youtube",
        tipo_conteudo: "video",
        titulo_principal: "Erro ao processar conteúdo",
        variacao_a: {
          headline: "Erro ao processar",
          copy: "Erro ao processar",
          cta: "Erro ao processar",
          hashtags: ["#erro"],
          visual_description: "Erro ao processar",
          color_composition: "Erro ao processar",
        },
      };
    }
  };

  // Try to fix and parse content
  const tryFixAndParse = () => {
    try {
      const cleanedContent = fixMalformedJson(content);
      const parsed = JSON.parse(cleanedContent);
      setParsedContent(parsed);
      setError(null);
    } catch {
      // Use emergency fallback
      const fallbackContent = emergencyFallback(content);
      setParsedContent(fallbackContent);
      setError(null);
    }
  };

  return {
    parsedContent,
    error,
    translateKey,
    translateValue,
    handleFieldChange,
    handleStringFieldChange,
    handleArrayFieldChange,
    handleContentChange,
    createEmptyStructure,
    tryFixAndParse,
    parseContent,
    CONTENT_TYPE_INVERSE,
  };
};
