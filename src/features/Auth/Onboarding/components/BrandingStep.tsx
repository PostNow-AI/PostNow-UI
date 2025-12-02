import {
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ColorPicker,
  ImagePicker,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormData } from "../constants/onboardingSchema";
import { useVisualStylePreferences } from "../hooks/useVisualStylePreferences";

export const BrandingStep = ({
  form,
}: {
  form: UseFormReturn<OnboardingFormData>;
}) => {
  const {
    setError,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const watchedValues = watch();
  console.log({ errors });

  const { visualStylePreferences, isLoading, createPreferenceMutation } =
    useVisualStylePreferences();

  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  useEffect(() => {
    if (createPreferenceMutation.isSuccess && createPreferenceMutation.data) {
      const currentIds = watchedValues.visual_style_ids || [];
      const newIds = [
        ...currentIds,
        createPreferenceMutation.data.id.toString(),
      ];
      setValue("visual_style_ids", newIds);
      setShowCustom(false);
      setCustomName("");
      setCustomDescription("");
    }
  }, [
    createPreferenceMutation.isSuccess,
    createPreferenceMutation.data,
    setValue,
    watchedValues.visual_style_ids,
  ]);

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Manual de marca{" "}
        </CardTitle>
        <CardDescription>
          Utilizaremos essa informações para criar ideias de posts mais precisas
          e customizadas para seu negócio. Quanto mais detalhes fornecer,
          melhores serão os resultados.{" "}
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Logo Marca</Label>
          <ImagePicker
            value={watchedValues.logo || ""}
            onChange={(value) => setValue("logo", value)}
            onError={(error) => {
              // Handle error by setting form error
              setError("logo", { type: "manual", message: error });
            }}
            maxSize={5 * 1024 * 1024} // 5MB
            acceptedFormats={[
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/webp",
            ]}
          />
          <span className="text-sm text-muted-foreground">
            Adicione uma imagem da sua logomarca
          </span>
          {errors.logo && (
            <p className="text-sm text-destructive">{errors.logo.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Estilos Visuais Preferidos * </Label>
          <div className="space-y-3">
            {visualStylePreferences?.map(
              (preference: {
                id: number;
                name: string;
                description?: string;
              }) => {
                const currentIds = watchedValues.visual_style_ids || [];
                const isChecked = currentIds.includes(preference.id.toString());

                return (
                  <div
                    key={preference.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={`visual_style_${preference.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        let newIds;

                        if (checked) {
                          newIds = [...currentIds, preference.id.toString()];
                        } else {
                          newIds = currentIds.filter(
                            (id: string) => id !== preference.id.toString()
                          );
                        }

                        setValue("visual_style_ids", newIds);
                      }}
                      disabled={isLoading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={`visual_style_${preference.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {preference.name}
                      </Label>
                      {preference.description && (
                        <p className="text-xs text-muted-foreground">
                          {preference.description.slice(0, 100)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
            {!showCustom && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCustom(true)}
                className="w-full"
              >
                Criar Estilo Personalizado
              </Button>
            )}
            {showCustom && (
              <div className="space-y-2">
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Nome do estilo personalizado"
                />
                <Input
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Descrição do estilo personalizado"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      if (customName.trim() && customDescription.trim()) {
                        createPreferenceMutation.mutate({
                          name: customName.trim(),
                          description: customDescription.trim(),
                        });
                      }
                    }}
                    disabled={
                      createPreferenceMutation.isPending ||
                      !customName.trim() ||
                      !customDescription.trim()
                    }
                    className="flex-1"
                  >
                    {createPreferenceMutation.isPending
                      ? "Criando..."
                      : "Criar"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCustom(false);
                      setCustomName("");
                      setCustomDescription("");
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
          {errors.visual_style_ids && (
            <p className="text-sm text-destructive">
              {errors.visual_style_ids.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="voice_tone">Tom de voz * </Label>
          <Select
            value={watchedValues.voice_tone || ""}
            onValueChange={(value) => setValue("voice_tone", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tom de voz..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal e Profissional</SelectItem>
              <SelectItem value="casual">Casual e Amigável</SelectItem>
              <SelectItem value="inspirador">
                Inspirador e Motivacional
              </SelectItem>
              <SelectItem value="educativo">Educativo e Didático</SelectItem>
              <SelectItem value="engraçado">
                Descontraído e Engraçado
              </SelectItem>
              <SelectItem value="autoridade">Autoridade no Assunto</SelectItem>
              <SelectItem value="empático">Empático e Compreensivo</SelectItem>
              <SelectItem value="minimalista">Direto e Minimalista</SelectItem>
            </SelectContent>
          </Select>
          {errors.voice_tone && (
            <p className="text-sm text-destructive">
              {errors.voice_tone.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Cores da marca</Label>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <ColorPicker
                key={num}
                value={
                  (watchedValues[
                    `color_${num}` as keyof typeof watchedValues
                  ] as string) || "#ffffff"
                }
                onChange={(color) =>
                  setValue(
                    `color_${num}` as
                      | "color_1"
                      | "color_2"
                      | "color_3"
                      | "color_4"
                      | "color_5",
                    color
                  )
                }
                placeholder="#ffffff"
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Escolha as cores que representam a sua marca{" "}
          </span>
        </div>
      </CardContent>
    </>
  );
};
