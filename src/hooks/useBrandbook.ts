import { globalOptionsApi } from "@/lib/global-options-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface BrandbookFormData {
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color_1?: string | null;
  accent_color_2?: string | null;
  accent_color_3?: string | null;
  primary_font?: string | null;
  secondary_font?: string | null;
  custom_primary_font?: string | null;
  custom_secondary_font?: string | null;
}

export const useBrandbook = (form: UseFormReturn<BrandbookFormData>) => {
  const { setValue } = form;
  const queryClient = useQueryClient();
  const [customPrimaryFontInput, setCustomPrimaryFontInput] = useState("");
  const [customSecondaryFontInput, setCustomSecondaryFontInput] = useState("");

  // Buscar fontes da API
  const { data: fonts = { predefined: [], custom: [] } } = useQuery({
    queryKey: ["fonts"],
    queryFn: globalOptionsApi.getFonts,
  });

  // Mutation para criar fontes customizadas
  const createFontMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomFont,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fonts"] });
      toast.success("Fonte criada com sucesso!");
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Erro ao criar fonte"
        );
      } else {
        toast.error("Erro ao criar fonte");
      }
    },
  });

  // Handlers para criar fontes customizadas
  const handleAddCustomFont = (fontType: "primary" | "secondary") => {
    const customValue =
      fontType === "primary"
        ? customPrimaryFontInput
        : customSecondaryFontInput;
    if (customValue.trim()) {
      createFontMutation.mutate(
        { name: customValue.trim() },
        {
          onSuccess: () => {
            if (fontType === "primary") {
              setCustomPrimaryFontInput("");
              setValue("primary_font", customValue.trim());
            } else {
              setCustomSecondaryFontInput("");
              setValue("secondary_font", customValue.trim());
            }
          },
        }
      );
    }
  };

  // Obter todas as fontes disponíveis
  const allAvailableFonts = [
    ...(fonts.predefined?.map((f) => f.name) || []),
    ...(fonts.custom?.map((f) => f.name) || []),
    "Outro",
  ];

  return {
    // State
    customPrimaryFontInput,
    setCustomPrimaryFontInput,
    customSecondaryFontInput,
    setCustomSecondaryFontInput,

    // Data
    allAvailableFonts,

    // Mutations
    createFontMutation,

    // Handlers
    handleAddCustomFont,
  };
};
