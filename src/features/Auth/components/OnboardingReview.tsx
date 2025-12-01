import type { OnboardingFormData } from "@/features/Auth/Onboarding/constants/onboardingSchema";
import { Building, Edit, Palette } from "lucide-react";
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
import { useVisualStylePreferences } from "../Onboarding/hooks/useVisualStylePreferences";

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
  const { visualStylePreferences } = useVisualStylePreferences();

  interface VisualStyle {
    id: number;
    name: string;
  }

  const selectedVisualStyle: VisualStyle | undefined =
    visualStylePreferences?.find(
      (style: VisualStyle) => style.id === Number(values.visual_style_id)
    );
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
          {values.business_phone && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Número do WhatsApp</span>
              <span className="text-sm text-muted-foreground">
                {values.business_phone}
              </span>
            </div>
          )}
          {values.business_website && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Website do negócio</span>
              <span className="text-sm text-muted-foreground">
                {values.business_website}
              </span>
            </div>
          )}
          {values.business_instagram_handle && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Instagram do negócio</span>
              <span className="text-sm text-muted-foreground">
                @{values.business_instagram_handle}
              </span>
            </div>
          )}
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
          </div>
          {values.business_purpose && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Propósito do negócio</span>
              <span className="text-sm text-muted-foreground">
                {values.business_purpose}
              </span>
            </div>
          )}
          {values.brand_personality && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Personalidade da marca</span>
              <span className="text-sm text-muted-foreground">
                {values.brand_personality}
              </span>
            </div>
          )}
          {values.products_services && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Produtos/Serviços</span>
              <span className="text-sm text-muted-foreground">
                {values.products_services}
              </span>
            </div>
          )}
          {values.business_location && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Localização do negócio</span>
              <span className="text-sm text-muted-foreground">
                {values.business_location}
              </span>
            </div>
          )}
          {values.target_audience && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Público-alvo</span>
              <span className="text-sm text-muted-foreground">
                {values.target_audience}
              </span>
            </div>
          )}
          {values?.target_interests?.length && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Interesses do público-alvo</span>
              <span className="text-sm text-muted-foreground">
                {values.target_interests}
              </span>
            </div>
          )}
          {values?.main_competitors?.length && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Principais concorrentes</span>
              <span className="text-sm text-muted-foreground">
                {values.main_competitors}
              </span>
            </div>
          )}
          {values?.reference_profiles?.length && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Perfis de referência</span>
              <span className="text-sm text-muted-foreground">
                {values.reference_profiles}
              </span>
            </div>
          )}
        </CardContent>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="text-primary h-5 w-5" />
            Manual da marca do negócio
          </CardTitle>
          <Separator className="my-4" />
        </CardHeader>
        <CardHeader className="space-y-6 px-6">
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
            <span className="text-sm">Tom de voz</span>
            <span className="text-sm text-muted-foreground">
              {values.voice_tone}
            </span>
          </div>
          {values.visual_style_id && (
            <div className="space-y-2 flex flex-col">
              <span className="text-sm">Estilo Visual Preferido</span>
              <span className="text-sm text-muted-foreground">
                {selectedVisualStyle?.name || `ID: ${values.visual_style_id}`}
              </span>
            </div>
          )}
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
        </CardHeader>
      </CardContent>
    </>
  );
};
