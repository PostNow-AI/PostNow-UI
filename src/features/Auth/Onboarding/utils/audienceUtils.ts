/**
 * Utilitários para parsing e formatação de dados de audiência do onboarding.
 * Centraliza funções que eram duplicadas em useOnboardingStorage e OnboardingNew.
 */

// Mapeamento de gêneros
const GENDER_MAP: Record<string, string> = {
  mulheres: "Mulheres",
  homens: "Homens",
  todos: "Todos",
};

// Mapeamento de classes sociais
const INCOME_MAP: Record<string, string> = {
  "classe-c": "Classe C",
  "classe-b": "Classe B",
  "classe-a": "Classe A",
  todas: "Todas as classes",
};

/**
 * Interface para audiência parseada do JSON
 */
export interface ParsedAudience {
  gender: string[];
  ageRange: string[];
  incomeLevel: string[];
}

/**
 * Converte JSON de audiência para objeto tipado.
 * Retorna null se não for um JSON válido de audiência.
 */
export const parseAudienceJson = (value: string): ParsedAudience | null => {
  try {
    const parsed = JSON.parse(value);
    if (parsed.gender && parsed.ageRange && parsed.incomeLevel) {
      return parsed;
    }
  } catch {
    // não é JSON válido
  }
  return null;
};

/**
 * Converte JSON de audiência para string legível para a API.
 * Formato: "Mulheres, de 25-34 anos, Classe A e Classe B"
 */
export const audienceJsonToString = (value: string): string => {
  const parsed = parseAudienceJson(value);

  if (!parsed) {
    return value;
  }

  const parts: string[] = [];

  // Gênero
  if (parsed.gender.includes("todos")) {
    parts.push("Homens e mulheres");
  } else if (parsed.gender.length > 0) {
    parts.push(parsed.gender.map((g: string) => GENDER_MAP[g] || g).join(" e "));
  }

  // Faixa etária
  if (parsed.ageRange.includes("todas")) {
    parts.push("de todas as idades");
  } else if (parsed.ageRange.length > 0) {
    parts.push(`de ${parsed.ageRange.map((a: string) => `${a} anos`).join(", ")}`);
  }

  // Classe social
  if (parsed.incomeLevel.includes("todas")) {
    parts.push("de todas as classes sociais");
  } else if (parsed.incomeLevel.length > 0) {
    parts.push(parsed.incomeLevel.map((i: string) => INCOME_MAP[i] || i).join(" e "));
  }

  return parts.join(", ");
};

/**
 * Extrai apenas a parte de gênero e idade da audiência.
 * Usado para exibição resumida.
 */
export const audienceToDisplayString = (value: string): string => {
  const parsed = parseAudienceJson(value);

  if (!parsed) {
    if (value && value.length > 0) {
      return value.length > 50 ? value.slice(0, 50) + "..." : value;
    }
    return "Seu público";
  }

  const parts: string[] = [];

  // Gênero
  if (parsed.gender.includes("todos")) {
    parts.push("Todos");
  } else if (parsed.gender.length > 0) {
    parts.push(parsed.gender.map((g: string) => GENDER_MAP[g] || g).join(" e "));
  }

  // Faixa etária
  if (parsed.ageRange.includes("todas")) {
    parts.push("todas as idades");
  } else if (parsed.ageRange.length > 0) {
    parts.push(parsed.ageRange.join(", ") + " anos");
  }

  return parts.join(", ") || "Seu público";
};

/**
 * Extrai apenas a classe social da audiência.
 */
export const audienceIncomeToString = (value: string): string | null => {
  const parsed = parseAudienceJson(value);

  if (!parsed || parsed.incomeLevel.length === 0) {
    return null;
  }

  if (parsed.incomeLevel.includes("todas")) {
    return "Todas as classes";
  }

  return parsed.incomeLevel.map(i => INCOME_MAP[i] || i).join(", ");
};

/**
 * Converte JSON de audiência para formato compacto de exibição.
 * Formato: "Todos, 25-34, Classe A/B"
 * Usado no ProfileReadyStep para resumo visual.
 */
export const audienceToCompactString = (value: string): string => {
  const parsed = parseAudienceJson(value);

  if (!parsed) {
    return value || "";
  }

  const parts: string[] = [];

  // Gender
  if (parsed.gender.includes("todos")) {
    parts.push("Todos");
  } else if (parsed.gender.length > 0) {
    parts.push(parsed.gender.map((g: string) => GENDER_MAP[g] || g).join(" e "));
  }

  // Age range
  if (parsed.ageRange.includes("todas")) {
    parts.push("todas as idades");
  } else if (parsed.ageRange.length > 0) {
    parts.push(parsed.ageRange.join(", "));
  }

  // Income level (compact format: "Classe A/B")
  if (parsed.incomeLevel.includes("todas")) {
    parts.push("todas as classes");
  } else if (parsed.incomeLevel.length > 0) {
    const incomeLabels: Record<string, string> = { "classe-a": "A", "classe-b": "B", "classe-c": "C" };
    parts.push("Classe " + parsed.incomeLevel.map((c: string) => incomeLabels[c] || c).join("/"));
  }

  return parts.join(", ");
};
