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
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  Loader2,
  Palette,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    .min(10, "Número de WhatsApp deve ter pelo menos 10 dígitos")
    .regex(/^\d+$/, "Número de WhatsApp deve conter apenas dígitos"),

  // Business Info (Step 2)
  business_name: z
    .string()
    .min(2, "Nome do negócio deve ter pelo menos 2 caracteres"),
  specialization: z.string().min(1, "Por favor, selecione um setor/nicho"),
  custom_specialization: z.string().optional(),
  business_instagram: z.string().optional(),
  business_website: z
    .string()
    .url("URL do website deve ser válida")
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

const STEPS = [
  { id: 1, title: "Informações Pessoais", description: "Conte-nos sobre você" },
  {
    id: 2,
    title: "Informações de Negócio",
    description: "Defina seu público-alvo",
  },
  {
    id: 3,
    title: "Identidade Visual",
    description: "Crie sua identidade de marca",
  },
];

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
      whatsapp_number: "",
      business_name: "",
      specialization: "",
      custom_specialization: "",
      business_instagram: "",
      business_website: "",
      business_location: "",
      business_description: "",
      voice_tone_personality: "",
      logo_image_url: "",
      color_1: "",
      color_2: "",
      color_3: "",
      color_4: "",
      color_5: "",
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
    if (isStepValid && currentStep < 3) {
      // Debug: Log current form values when moving to next step
      console.log(
        "Form values when moving to step",
        currentStep + 1,
        ":",
        form.getValues()
      );
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
      default:
        return null;
    }
  };

  const renderPersonalInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informações Pessoais
        </CardTitle>
        <CardDescription>
          Como você gostaria de ser conhecido profissionalmente?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="professional_name">Nome Profissional *</Label>
          <Input
            id="professional_name"
            placeholder="Ex: Dr. João Silva"
            {...register("professional_name")}
          />
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
            <SelectTrigger>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="5511999999999"
              {...register("whatsapp_number")}
            />
            <p className="text-xs text-muted-foreground">
              Digite apenas números, incluindo código do país (ex:
              5511999999999)
            </p>
            {errors.whatsapp_number && (
              <p className="text-sm text-destructive">
                {errors.whatsapp_number.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBusinessInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Informações de Negócio
        </CardTitle>
        <CardDescription>Conte-nos sobre seu negócio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business_name">Nome do Negócio *</Label>
          <Input
            id="business_name"
            placeholder="Ex: Consultório Dr. Silva"
            {...register("business_name")}
          />
          {errors.business_name && (
            <p className="text-sm text-destructive">
              {errors.business_name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialization">Setor/Nicho *</Label>
          <Select
            onValueChange={(value) => setValue("specialization", value)}
            value={watchedValues.specialization || ""}
            disabled={!selectedProfession}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um setor/nicho" />
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
          {errors.specialization && (
            <p className="text-sm text-destructive">
              {errors.specialization.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="business_website">Website do Negócio</Label>
            <Input
              id="business_website"
              placeholder="https://seunegocio.com.br"
              {...register("business_website")}
            />
            {errors.business_website && (
              <p className="text-sm text-destructive">
                {errors.business_website.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_location">
            Localização do Negócio (Cidade) *
          </Label>
          <Input
            id="business_location"
            placeholder="Ex: São Paulo, SP"
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
          <Input
            id="business_description"
            placeholder="Descreva brevemente seu negócio e o que você oferece"
            {...register("business_description")}
          />
          <p className="text-xs text-muted-foreground">
            Descreva os serviços ou produtos que seu negócio oferece
          </p>
          {errors.business_description && (
            <p className="text-sm text-destructive">
              {errors.business_description.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderBrandingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Identidade da Marca
        </CardTitle>
        <CardDescription>
          Defina o tom de voz, logo e cores que representam sua marca
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Tom de Voz e Personalidade</h4>
          <div className="space-y-2">
            <Label htmlFor="voice_tone_personality">
              Como você se comunica com seu público? *
            </Label>
            <Select
              value={watchedValues.voice_tone_personality || ""}
              onValueChange={(value) =>
                setValue("voice_tone_personality", value)
              }
            >
              <SelectTrigger>
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
                <SelectItem value="autoridade">
                  Autoridade no Assunto
                </SelectItem>
                <SelectItem value="empático">
                  Empático e Compreensivo
                </SelectItem>
                <SelectItem value="minimalista">
                  Direto e Minimalista
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.voice_tone_personality && (
              <p className="text-sm text-destructive">
                {errors.voice_tone_personality.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Logo (Opcional)</h4>
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
          {errors.logo_image_url && (
            <p className="text-sm text-destructive">
              {errors.logo_image_url.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Paleta de Cores (Opcional)</h4>
          <p className="text-sm text-muted-foreground">
            Selecione até 5 cores para representar sua marca
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <ColorPicker
                key={num}
                label={`Cor ${num}`}
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
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Configure seu Perfil</h1>
          <p className="text-muted-foreground">
            Complete as informações abaixo para personalizar sua experiência
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Etapa {currentStep} de 3</span>
            <span>{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Title */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-muted-foreground">
            {STEPS[currentStep - 1].description}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-2"
              >
                Próximo
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
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
                    <CheckCircle className="h-4 w-4" />
                    Finalizar
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Required Fields Note */}
        <p className="text-center text-xs text-muted-foreground">
          * Campos obrigatórios
        </p>
      </div>
    </div>
  );
};
