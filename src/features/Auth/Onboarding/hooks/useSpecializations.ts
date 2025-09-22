import { globalOptionsApi, type Profession } from "@/lib/global-options-api";
import { useQuery } from "@tanstack/react-query";

export const useSpecializations = (
  professions: Profession[],
  selectedProfession: string
) => {
  const { data: specializations, isLoading: isLoadingSpecializations } =
    useQuery({
      queryKey: ["specializations", selectedProfession],
      queryFn: async () => {
        if (selectedProfession && selectedProfession !== "Outro") {
          const profession = professions.find(
            (p) => p.name === selectedProfession
          );
          if (profession) {
            const result = await globalOptionsApi.getProfessionSpecializations(
              profession.id
            );
            return result;
          }
        }
        return { profession: null, specializations: [] };
      },
      enabled: !!professions && selectedProfession !== "Outro",
    });

  return { specializations, isLoadingSpecializations };
};
