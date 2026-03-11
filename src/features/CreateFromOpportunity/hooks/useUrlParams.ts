import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import type { OpportunityParams, CategoryKey } from "../types";

const VALID_CATEGORIES: CategoryKey[] = [
  "polemica", "educativo", "newsjacking",
  "entretenimento", "estudo_caso", "futuro", "outros",
];

export const useUrlParams = (): OpportunityParams => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const topic = searchParams.get("topic") || "";
    const rawCategory = searchParams.get("category") || "outros";
    const category: CategoryKey = VALID_CATEGORIES.includes(rawCategory as CategoryKey)
      ? (rawCategory as CategoryKey)
      : "outros";
    const scoreStr = searchParams.get("score") || "0";
    const score = parseInt(scoreStr, 10) || 0;

    return {
      topic,
      category,
      score,
    };
  }, [searchParams]);
};
