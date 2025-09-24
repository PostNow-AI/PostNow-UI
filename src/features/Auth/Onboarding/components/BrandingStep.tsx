import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ColorPicker,
  ImagePicker,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components";
import { Palette } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormData } from "../constants/onboardingSchema";

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
          <Label htmlFor="voice_tone">
            Tom de voz e personalidade da marca *{" "}
          </Label>
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
