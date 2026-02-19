import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVisualStylePreference,
  fetchVisualStylePreferences,
  type VisualStylePreference,
} from "../services";

export const useVisualStylePreferences = (enabled = false) => {
  const queryClient = useQueryClient();

  const {
    data: visualStylePreferences,
    isLoading,
    isError,
  } = useQuery<VisualStylePreference[]>({
    queryKey: ["visualStylePreferences"],
    queryFn: fetchVisualStylePreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled, // Só busca quando explicitamente habilitado
  });

  const createPreferenceMutation = useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => createVisualStylePreference(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visualStylePreferences"] });
    },
  });

  return {
    visualStylePreferences,
    isLoading,
    isError,
    createPreferenceMutation,
  };
};
