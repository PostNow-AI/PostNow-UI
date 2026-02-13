import { useQuery } from "@tanstack/react-query";
import { weeklyContextService } from "../services/weeklyContextService";

export const useWeeklyContext = (offset: number = 0) => {
  return useQuery({
    queryKey: ["weekly-context", offset],
    queryFn: () =>
      offset === 0
        ? weeklyContextService.getCurrent()
        : weeklyContextService.getHistory(offset),
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: 1,
  });
};

