import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { ColorPicker } from "@/components/ui/color-picker";
import { globalOptionsApi } from "@/lib/global-options-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Palette, Type } from "lucide-react";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface BrandbookFormData {
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color_1?: string | null;
  accent_color_2?: string | null;
  accent_color_3?: string | null;
  primary_font?: string;
  secondary_font?: string;
  custom_primary_font?: string;
  custom_secondary_font?: string;
}

interface BrandbookSectionProps {
  form: UseFormReturn<BrandbookFormData>;
}

export const BrandbookSection = ({ form }: BrandbookSectionProps) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;
  const watchedValues = watch();
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
    ...fonts.predefined.map((f: { name: string }) => f.name),
    ...fonts.custom.map((f: { name: string }) => f.name),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  return (
    <>
      {/* Brandbook - Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paleta de Cores
          </CardTitle>
          <CardDescription>
            Defina as cores da sua marca para personalização visual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Cor Primária"
              value={watchedValues.primary_color || ""}
              onChange={(color) => setValue("primary_color", color)}
              placeholder="#3B82F6"
            />

            <ColorPicker
              label="Cor Secundária"
              value={watchedValues.secondary_color || ""}
              onChange={(color) => setValue("secondary_color", color)}
              placeholder="#EF4444"
            />

            <ColorPicker
              label="Cor de Destaque 1"
              value={watchedValues.accent_color_1 || ""}
              onChange={(color) => setValue("accent_color_1", color)}
              placeholder="#10B981"
            />

            <ColorPicker
              label="Cor de Destaque 2"
              value={watchedValues.accent_color_2 || ""}
              onChange={(color) => setValue("accent_color_2", color)}
              placeholder="#F59E0B"
            />

            <ColorPicker
              label="Cor de Destaque 3"
              value={watchedValues.accent_color_3 || ""}
              onChange={(color) => setValue("accent_color_3", color)}
              placeholder="#8B5CF6"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brandbook - Tipografia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Tipografia
          </CardTitle>
          <CardDescription>Defina as fontes da sua marca</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_font">Fonte Primária</Label>
              <Select
                onValueChange={(value) => setValue("primary_font", value)}
                value={watchedValues.primary_font || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {allAvailableFonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.primary_font && (
                <p className="text-sm text-destructive">
                  {errors.primary_font.message}
                </p>
              )}

              {/* Campo para fonte primária customizada */}
              {watchedValues.primary_font === "Outro" && (
                <div className="space-y-2">
                  <Label htmlFor="custom_primary_font">
                    Qual é sua fonte primária?
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom_primary_font"
                      placeholder="Descreva sua fonte"
                      value={customPrimaryFontInput}
                      onChange={(e) =>
                        setCustomPrimaryFontInput(e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddCustomFont("primary")}
                      disabled={
                        !customPrimaryFontInput.trim() ||
                        createFontMutation.isPending
                      }
                    >
                      {createFontMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Adicionar"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sua fonte será salva para referência futura de outros
                    usuários.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_font">Fonte Secundária</Label>
              <Select
                onValueChange={(value) => setValue("secondary_font", value)}
                value={watchedValues.secondary_font || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {allAvailableFonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.secondary_font && (
                <p className="text-sm text-destructive">
                  {errors.secondary_font.message}
                </p>
              )}

              {/* Campo para fonte secundária customizada */}
              {watchedValues.secondary_font === "Outro" && (
                <div className="space-y-2">
                  <Label htmlFor="custom_secondary_font">
                    Qual é sua fonte secundária?
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom_secondary_font"
                      placeholder="Descreva sua fonte"
                      value={customSecondaryFontInput}
                      onChange={(e) =>
                        setCustomSecondaryFontInput(e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddCustomFont("secondary")}
                      disabled={
                        !customSecondaryFontInput.trim() ||
                        createFontMutation.isPending
                      }
                    >
                      {createFontMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Adicionar"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sua fonte será salva para referência futura de outros
                    usuários.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
