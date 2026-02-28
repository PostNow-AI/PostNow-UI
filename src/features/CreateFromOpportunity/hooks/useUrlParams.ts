import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import type { OpportunityParams, CategoryKey } from "../types";

export const useUrlParams = (): OpportunityParams => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const topic = searchParams.get("topic") || "";
    const category = (searchParams.get("category") || "outros") as CategoryKey;
    const scoreStr = searchParams.get("score") || "0";
    const score = parseInt(scoreStr, 10) || 0;

    return {
      topic: decodeURIComponent(topic),
      category,
      score,
    };
  }, [searchParams]);
};
