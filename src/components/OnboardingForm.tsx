import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Loading,
  ThemeToggle,
} from "@/components/ui";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Validation schemas for each step
const platformSchema = z.object({
  main_platform: z.string().min(1, "Selecione uma plataforma"),
});

const nicheSchema = z.object({
  niche: z.string().min(3, "Nicho deve ter pelo menos 3 caracteres"),
});

const experienceSchema = z.object({
  experience_level: z.string().min(1, "Selecione seu nível de experiência"),
});

const goalSchema = z.object({
  primary_goal: z.string().min(1, "Selecione seu objetivo principal"),
});

const timeSchema = z.object({
  time_available: z.string().min(1, "Selecione seu tempo disponível"),
});

// Complete onboarding schema
const onboardingSchema = z.object({
  main_platform: z.string().min(1, "Selecione uma plataforma"),
  niche: z.string().min(3, "Nicho deve ter pelo menos 3 caracteres"),
  experience_level: z.string().min(1, "Selecione seu nível de experiência"),
  primary_goal: z.string().min(1, "Selecione seu objetivo principal"),
  time_available: z.string().min(1, "Selecione seu tempo disponível"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  onComplete: () => void;
}

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form setup
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  // Fetch choices and suggestions
  const { data: choices, isLoading: choicesLoading } = useQuery({
    queryKey: ["profile-choices"],
    queryFn: creatorProfileApi.getChoices,
  });

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["profile-suggestions"],
    queryFn: creatorProfileApi.getSuggestions,
  });

  // Submit onboarding mutation
  const onboardingMutation = useMutation({
    mutationFn: creatorProfileApi.submitOnboarding,
    onSuccess: (data) => {
      toast.success("Perfil criado com sucesso!", {
        description: `${data.profile.completeness_percentage}% do seu perfil está completo`,
      });

      setTimeout(() => {
        onComplete();
      }, 1000);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erro ao criar perfil";
      toast.error("Erro no onboarding", {
        description: message,
      });
    },
  });

  // Watch form values for navigation
  const watchedValues = watch();

  // Step validation functions
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return platformSchema.safeParse({
          main_platform: watchedValues.main_platform,
        }).success;
      case 2:
        return nicheSchema.safeParse({ niche: watchedValues.niche }).success;
      case 3:
        return experienceSchema.safeParse({
          experience_level: watchedValues.experience_level,
        }).success;
      case 4:
        return goalSchema.safeParse({
          primary_goal: watchedValues.primary_goal,
        }).success;
      case 5:
        return timeSchema.safeParse({
          time_available: watchedValues.time_available,
        }).success;
      default:
        return false;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Campo obrigatório", {
        description: "Complete o campo atual antes de continuar",
      });
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const onSubmit = (data: OnboardingFormData) => {
    onboardingMutation.mutate(data);
  };

  // Progress calculation
  const progress = (currentStep / 5) * 100;

  if (choicesLoading || suggestionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Carregando onboarding..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Vamos personalizar suas ideias!
            </CardTitle>
            <CardDescription>
              Quanto mais informações, melhores as sugestões
            </CardDescription>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progresso</span>
                <span>{currentStep}/5</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Main Platform */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Onde você publica mais conteúdo?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Isso nos ajuda a sugerir formatos ideais para sua
                      audiência
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {choices?.platforms.map((platform) => (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() =>
                          setValue("main_platform", platform.value)
                        }
                        className={`p-4 rounded-lg border-2 transition-all ${
                          watchedValues.main_platform === platform.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-2xl mb-2">
                          {platform.value === "instagram" && "📸"}
                          {platform.value === "linkedin" && "💼"}
                          {platform.value === "youtube" && "🎥"}
                          {platform.value === "tiktok" && "🎵"}
                          {platform.value === "twitter" && "🐦"}
                        </div>
                        <div className="font-medium">{platform.label}</div>
                      </button>
                    ))}
                  </div>

                  {errors.main_platform && (
                    <p className="text-destructive text-sm">
                      {errors.main_platform.message}
                    </p>
                  )}
                </div>
              )}

              {/* Step 2: Niche */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Qual seu nicho ou área de atuação?
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <Input
                      {...register("niche")}
                      placeholder="Digite seu nicho"
                      className="text-center"
                    />

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        💡 Sugestões populares:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions?.niches.slice(0, 6).map((niche) => (
                          <button
                            key={niche}
                            type="button"
                            onClick={() => setValue("niche", niche)}
                            className="px-3 py-1 text-xs rounded-full border border-border hover:border-primary transition-colors"
                          >
                            {niche}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {errors.niche && (
                    <p className="text-destructive text-sm">
                      {errors.niche.message}
                    </p>
                  )}
                </div>
              )}

              {/* Step 3: Experience Level */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Qual sua experiência com criação de conteúdo?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Isso personaliza a complexidade das sugestões para você
                    </p>
                  </div>

                  <div className="space-y-3">
                    {choices?.experience_levels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() =>
                          setValue("experience_level", level.value)
                        }
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          watchedValues.experience_level === level.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {level.value === "beginner" && "🌱"}
                            {level.value === "intermediate" && "🌿"}
                            {level.value === "advanced" && "🌳"}
                          </div>
                          <div>
                            <div className="font-semibold">{level.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {level.value === "beginner" &&
                                "Menos de 6 meses criando conteúdo"}
                              {level.value === "intermediate" &&
                                "Entre 6 meses e 2 anos"}
                              {level.value === "advanced" &&
                                "Mais de 2 anos de experiência"}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {errors.experience_level && (
                    <p className="text-destructive text-sm">
                      {errors.experience_level.message}
                    </p>
                  )}
                </div>
              )}

              {/* Step 4: Primary Goal */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Qual seu principal objetivo com conteúdo?
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {choices?.goals.map((goal) => (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => setValue("primary_goal", goal.value)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          watchedValues.primary_goal === goal.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {goal.value === "authority" && "🏆"}
                            {goal.value === "leads" && "💰"}
                            {goal.value === "education" && "📚"}
                            {goal.value === "networking" && "🤝"}
                          </div>
                          <div>
                            <div className="font-semibold">{goal.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {goal.value === "authority" &&
                                "Ser reconhecido como especialista"}
                              {goal.value === "leads" &&
                                "Atrair potenciais clientes"}
                              {goal.value === "education" &&
                                "Compartilhar conhecimento"}
                              {goal.value === "networking" &&
                                "Conectar com outros profissionais"}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {errors.primary_goal && (
                    <p className="text-destructive text-sm">
                      {errors.primary_goal.message}
                    </p>
                  )}
                </div>
              )}

              {/* Step 5: Time Available */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Quanto tempo você tem por semana para criar conteúdo?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Isso ajuda a sugerir ideias compatíveis com seu tempo
                    </p>
                  </div>

                  <div className="space-y-3">
                    {choices?.time_options.map((timeOption) => (
                      <button
                        key={timeOption.value}
                        type="button"
                        onClick={() =>
                          setValue("time_available", timeOption.value)
                        }
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          watchedValues.time_available === timeOption.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {timeOption.value === "1-5" && "📝"}
                            {timeOption.value === "6-15" && "⚡"}
                            {timeOption.value === "16+" && "🚀"}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {timeOption.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {timeOption.value === "1-5" &&
                                "Conteúdo rápido e direto"}
                              {timeOption.value === "6-15" &&
                                "Conteúdo consistente e planejado"}
                              {timeOption.value === "16+" &&
                                "Estratégia completa de conteúdo"}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {errors.time_available && (
                    <p className="text-destructive text-sm">
                      {errors.time_available.message}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      Voltar
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!validateStep(currentStep)}
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={onboardingMutation.isPending}
                      className="min-w-[120px]"
                    >
                      {onboardingMutation.isPending ? (
                        <Loading text="Salvando..." size="sm" />
                      ) : (
                        "🚀 Criar Perfil"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
