import { globalOptionsApi } from "@/lib/global-options-api";
import { useQuery } from "@tanstack/react-query";

export const useProfessions = () => {
  const { data } = useQuery({
    queryKey: ["professions"],
    queryFn: globalOptionsApi.getProfessions,
  });
  return data || [];
};
