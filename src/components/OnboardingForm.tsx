import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnboarding } from "@/hooks/useOnboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Palette,
  User,
  Verified,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader, Separator, Textarea } from "./ui";

// Updated schema focused on essential fields for post-based system
const onboardingSchema = z.object({
  // Personal Info (Step 1)
  professional_name: z
    .string()
    .min(2, "Nome profissional deve ter pelo menos 2 caracteres"),
  profession: z.string().min(1, "Por favor, selecione uma profissão"),
  custom_profession: z.string().optional(),
  instagram_username: z.string().optional(),
  whatsapp_number: z
    .string()
    .min(10, "Número de WhatsApp deve ter pelo menos 10 dígitos"),
  // Business Info (Step 2)
  business_name: z
    .string()
    .min(2, "Nome do negócio deve ter pelo menos 2 caracteres"),
  specialization: z.string().min(1, "Por favor, selecione um setor/nicho"),
  custom_specialization: z.string().optional(),
  business_instagram: z.string().optional(),
  business_website: z
    .string()
    .refine((val) => {
      if (!val || val === "") return true; // Allow empty
      // Check if it's a valid URL with or without protocol
      try {
        // If no protocol, add https:// for validation
        const urlToTest =
          val.startsWith("http://") || val.startsWith("https://")
            ? val
            : `https://${val}`;
        new URL(urlToTest);
        return true;
      } catch {
        return false;
      }
    }, "URL do website deve ser válida (ex: exemplo.com ou https://exemplo.com)")
    .optional()
    .or(z.literal("")),
  business_location: z
    .string()
    .min(2, "Localização do negócio deve ter pelo menos 2 caracteres"),
  business_description: z
    .string()
    .min(10, "Descrição do negócio deve ter pelo menos 10 caracteres"),

  // Branding (Step 3)
  voice_tone_personality: z
    .string()
    .min(1, "Por favor, defina o tom de voz e personalidade"),
  logo_image_url: z.string().optional().or(z.literal("")),
  color_1: z.string().optional(),
  color_2: z.string().optional(),
  color_3: z.string().optional(),
  color_4: z.string().optional(),
  color_5: z.string().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  onComplete: () => void;
}

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      professional_name: "",
      profession: "",
      custom_profession: "",
      instagram_username: "",
      whatsapp_number: "+55",
      business_name: "",
      specialization: "",
      custom_specialization: "",
      business_instagram: "",
      business_website: "",
      business_location: "",
      business_description: "",
      voice_tone_personality: "",
      logo_image_url: "",
      color_1: "#FF6B6B", // Soft Red
      color_2: "#4ECDC4", // Turquoise
      color_3: "#45B7D1", // Sky Blue
      color_4: "#96CEB4", // Sage Green
      color_5: "#FFBE0B", // Golden Yellow
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    trigger,
  } = form;

  const {
    isSubmitting,
    watchedValues,
    selectedProfession,
    allAvailableProfessions,
    availableSpecializations,
    handleFormSubmit,
    isLoadingSpecializations,
  } = useOnboarding(form, { onComplete });

  // Step validation functions
  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "professional_name",
          "profession",
          "whatsapp_number",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "business_name",
          "specialization",
          "business_location",
          "business_description",
        ];
        break;
      case 3:
        fieldsToValidate = ["voice_tone_personality"];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < 4) {
      // Debug: Log current form values when moving to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderBusinessInfoStep();
      case 3:
        return renderBrandingStep();
      case 4:
        return reviewStep();
      default:
        return null;
    }
  };

  const reviewStep = () => (
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

  const renderPersonalInfoStep = () => (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="text-primary h-5 w-5" />
          Informações do usuário
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6 overflow-auto">
        <div className="space-y-2">
          <Label htmlFor="professional_name">Nome Profissional *</Label>
          <Input
            id="professional_name"
            placeholder="Ex: Dr. João Silva"
            {...register("professional_name")}
          />
          <span className="text-muted-foreground text-sm">
            Como as pessoas te chamam?
          </span>
          {errors.professional_name && (
            <p className="text-sm text-destructive">
              {errors.professional_name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="profession">Profissão *</Label>
          <Select
            onValueChange={(value) => setValue("profession", value)}
            value={watchedValues.profession || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma profissão" />
            </SelectTrigger>
            <SelectContent>
              {allAvailableProfessions.map((profession) => (
                <SelectItem key={profession} value={profession}>
                  {profession}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.profession && (
            <p className="text-sm text-destructive">
              {errors.profession.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram_username">Instagram</Label>
          <Input
            id="instagram_username"
            placeholder="@seu_usuario"
            {...register("instagram_username")}
          />
          {errors.instagram_username && (
            <p className="text-sm text-destructive">
              {errors.instagram_username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp_number">WhatsApp *</Label>
          <Input
            id="whatsapp_number"
            placeholder="+55 99 99999-9999"
            {...register("whatsapp_number")}
          />
          <p className="text-sm text-muted-foreground">
            Você receberá suas ideais de post por esse número{" "}
          </p>
          {errors.whatsapp_number && (
            <p className="text-sm text-destructive">
              {errors.whatsapp_number.message}
            </p>
          )}
        </div>
      </CardContent>
    </>
  );

  const renderBusinessInfoStep = () => (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Informações de Negócio
        </CardTitle>
        <CardDescription>
          Utilizaremos essa informações para criar ideias de posts mais precisas
          e customizadas para seu negócio. Quanto mais detalhes fornecer,
          melhores serão os resultados.
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6 overflow-auto">
        {" "}
        <div className="space-y-2">
          <Label htmlFor="business_website">Site</Label>
          <Input
            id="business_website"
            placeholder="Ex: https://seusite.com.br"
            {...register("business_website")}
          />
          {errors.business_website && (
            <p className="text-sm text-destructive">
              {errors.business_website.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_name">Nome do Negócio *</Label>
          <Input
            id="business_name"
            placeholder="Digite o nome do seu negócio"
            {...register("business_name")}
          />{" "}
          <p className="text-sm text-muted-foreground">
            Caso seja autônomo, digite seu nome profissional{" "}
          </p>
          {errors.business_name && (
            <p className="text-sm text-destructive">
              {errors.business_name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialization">Setor/Nicho *</Label>
          {isLoadingSpecializations ? (
            <Loader />
          ) : (
            <Select
              onValueChange={(value) => setValue("specialization", value)}
              value={watchedValues.specialization || ""}
              disabled={!selectedProfession}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o nicho de negócio" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecializations.map(
                  (specialization: { id: number; name: string }) => (
                    <SelectItem
                      key={specialization.id}
                      value={specialization.name}
                    >
                      {specialization.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}
          {errors.specialization && (
            <p className="text-sm text-destructive">
              {errors.specialization.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_instagram">Instagram do Negócio</Label>
          <Input
            id="business_instagram"
            placeholder="@seu_negocio"
            {...register("business_instagram")}
          />
          {errors.business_instagram && (
            <p className="text-sm text-destructive">
              {errors.business_instagram.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_location">Localização do negócio * </Label>
          <Input
            id="business_location"
            placeholder="Ex: Brasília/DF"
            {...register("business_location")}
          />
          {errors.business_location && (
            <p className="text-sm text-destructive">
              {errors.business_location.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_description">Descrição do Negócio *</Label>
          <Textarea
            rows={3}
            id="business_description"
            placeholder="Descreva o que seu negócio faz, seus produtos/serviços, mercado alvo e o que o torna único."
            {...register("business_description")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisos serão as ideais
            geradas.{" "}
          </p>
          {errors.business_description && (
            <p className="text-sm text-destructive">
              {errors.business_description.message}
            </p>
          )}
        </div>
      </CardContent>
    </>
  );

  const renderBrandingStep = () => (
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
            value={watchedValues.logo_image_url || ""}
            onChange={(value) => setValue("logo_image_url", value)}
            onError={(error) => {
              // Handle error by setting form error
              setError("logo_image_url", { type: "manual", message: error });
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
          {errors.logo_image_url && (
            <p className="text-sm text-destructive">
              {errors.logo_image_url.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="voice_tone_personality">
            Tom de voz e personalidade da marca *{" "}
          </Label>
          <Select
            value={watchedValues.voice_tone_personality || ""}
            onValueChange={(value) => setValue("voice_tone_personality", value)}
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
          {errors.voice_tone_personality && (
            <p className="text-sm text-destructive">
              {errors.voice_tone_personality.message}
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <img src="Logo-sonoria.svg" alt="Logo" className="mx-auto mb-4" />

          <h1 className="text-2xl font-bold">
            Vamos começar, me fale um pouco{" "}
            <span className="text-primary">sobre você</span>
          </h1>
        </div>

        {/* Progress Indicator */}
        {currentStep <= 3 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Etapa {currentStep} de 3</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Form */}
        <form className="space-y-6">
          <Card className={"max-h-[70vh]"}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="px-6 self-end flex gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(handleFormSubmit)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Finalizar
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};
