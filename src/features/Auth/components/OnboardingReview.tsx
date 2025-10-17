import type { OnboardingFormData } from "@/features/Auth/Onboarding/constants/onboardingSchema";
import { Building, Edit, Palette, User } from "lucide-react";
import {
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ColorPicker,
  Loader,
  Separator,
} from "../../../components/ui";

export const OnboardingReview = ({
  values,
  onEdit,
  onLoading,
  description,
  title,
}: {
  values: OnboardingFormData;
  onEdit?: () => void;
  onLoading?: boolean;
  description?: string | React.ReactNode;
  title?: string | React.ReactNode;
}) => {
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {onEdit && (
            <div className="flex justify-end">
              <Button onClick={onEdit} disabled={onLoading}>
                {onLoading ? (
                  <Loader />
                ) : (
                  <>
                    <Edit /> Editar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
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
              {values.professional_name}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Profissão</span>
            <span className="text-sm text-muted-foreground">
              {values.profession}
            </span>
          </div>
          {values?.instagram_handle && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Instagram</span>
              <span className="text-sm text-muted-foreground">
                @{values.instagram_handle}
              </span>
            </div>
          )}
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Número de celular do WhatsApp</span>
            <span className="text-sm text-muted-foreground">
              +55 {values.whatsapp_number}
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
              {values.business_name}
            </span>
          </div>
          {values?.specialization?.length && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Setor/Nicho</span>
              <span className="text-sm text-muted-foreground">
                {values.specialization}
              </span>
            </div>
          )}
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Descrição do negócio</span>
            <span className="text-sm text-muted-foreground">
              {values.business_description}
            </span>
          </div>{" "}
          <CardTitle className="flex items-center gap-2 text-md pt-4">
            Público alvo do negócio
          </CardTitle>
          {values?.target_gender?.length ? (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Gênero</span>
              <span className="text-sm text-muted-foreground">
                {(() => {
                  switch (values.target_gender.toLowerCase()) {
                    case "all":
                    case "todos":
                      return "Todos";
                    case "male":
                    case "masculino":
                      return "Masculino";
                    case "female":
                    case "feminino":
                      return "Feminino";
                    case "non_binary":
                    case "não-binário":
                    case "nao-binario":
                      return "Não-binário";
                    case "outro":
                    case "other":
                      return "Outro";
                    default:
                      return values.target_gender;
                  }
                })()}
              </span>
            </div>
          ) : null}
          {values?.target_age_range?.length && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Faixa etária</span>
              <span className="text-sm text-muted-foreground">
                {values.target_age_range === "all"
                  ? "Todos"
                  : values.target_age_range}
              </span>
            </div>
          )}
          {values?.target_interests?.length && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Interesses</span>
              <span className="text-sm text-muted-foreground">
                {values.target_interests}
              </span>
            </div>
          )}
          {values?.target_location?.length && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Localização</span>
              <span className="text-sm text-muted-foreground">
                {values.target_location}
              </span>
            </div>
          )}
        </CardContent>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="text-primary h-5 w-5" />
            Manual da marca do negócio
          </CardTitle>
          <Separator />
        </CardHeader>{" "}
        <CardContent className="space-y-6 ">
          {values.logo && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Logo Marca</span>
              <img
                className="text-sm text-muted-foreground max-w-[163px]"
                src={values.logo}
                alt="Logo Marca"
              />
            </div>
          )}
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Tom de voz e personalidade da marca</span>
            <span className="text-sm text-muted-foreground">
              {values.voice_tone}
            </span>
          </div>
          <div className="space-y-2 flex flex-col">
            <span className="text-sm">Cores da marca</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <ColorPicker
                  key={num}
                  value={
                    (values[`color_${num}` as keyof typeof values] as string) ||
                    "#ffffff"
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
