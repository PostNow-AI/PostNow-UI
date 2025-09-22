import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ColorPicker,
  Separator,
} from "@/components/ui";
import { Building, Palette, User, Verified } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormData } from "../types";

export const ReviewStep = ({
  form,
}: {
  form: UseFormReturn<OnboardingFormData>;
}) => {
  const { watch } = form;

  const watchedValues = watch();
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Verified className="text-lime-600 h-6 w-6" />
          Revise as informações de negócio{" "}
        </CardTitle>{" "}
        <CardDescription>
          Se estiver tudo certo, estamos prontos para começar o trabalho.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0 overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="text-primary h-5 w-5" />
            Informações do usuário
          </CardTitle>
          <Separator />
        </CardHeader>{" "}
        <CardContent className="space-y-6 ">
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Nome Profissional</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.professional_name}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Profissão</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.profession}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Instagram</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.instagram_username || "Não fornecido"}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Número de celular do WhatsApp</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.whatsapp_number}
            </span>
          </div>{" "}
        </CardContent>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building className="text-primary h-5 w-5" />
            Informações do negócio
          </CardTitle>
          <Separator />
        </CardHeader>{" "}
        <CardContent className="space-y-6">
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Nome do negócio</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.business_name}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Setor/Nicho</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.specialization}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Site</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.business_website || "Não fornecido"}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Instagram do negócio</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.business_instagram || "Não fornecido"}
            </span>
          </div>{" "}
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Localização do negócio</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.business_location}
            </span>
          </div>{" "}
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Descrição do negócio</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.business_description}
            </span>
          </div>{" "}
        </CardContent>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="text-primary h-5 w-5" />
            Manual da marca do negócio
          </CardTitle>
          <Separator />
        </CardHeader>{" "}
        <CardContent className="space-y-6 ">
          {watchedValues.logo_image_url && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Logo Marca</span>
              <img
                className="text-sm text-muted-foreground max-w-[163px]"
                src={watchedValues.logo_image_url}
                alt="Logo Marca"
              />
            </div>
          )}
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Tom de voz e personalidade da marca</span>
            <span className="text-sm text-muted-foreground">
              {watchedValues.voice_tone_personality}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Cores da marca</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <ColorPicker
                  key={num}
                  value={
                    (watchedValues[
                      `color_${num}` as keyof typeof watchedValues
                    ] as string) || "#ffffff"
                  }
                  disabled
                  placeholder="#ffffff"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </CardContent>
    </>
  );
};
