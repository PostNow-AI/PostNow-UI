import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Loading,
} from "@/components/ui";
import { useOptionalOnboarding } from "@/hooks";
import {
  Step1Professional,
  Step2Content,
  Step3SocialBusiness,
  Step4Resources,
} from "./optional-onboarding";

interface OptionalOnboardingFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OptionalOnboardingForm = ({
  onComplete,
  onSkip,
}: OptionalOnboardingFormProps) => {
  const {
    // Form
    onSubmit,
    register,
    setValue,
    watch,

    // State
    currentStep,
    expertiseInput,
    setExpertiseInput,
    toolsInput,
    setToolsInput,

    // Data
    choices,
    suggestions,

    // Loading
    isLoading,

    // Mutation
    optionalMutation,

    // Handlers
    handleAddExpertise,
    handleRemoveExpertise,
    handleAddTool,
    handleRemoveTool,
    handleToggleHour,
    handleNext,
    handlePrevious,

    // Computed
    progress,
  } = useOptionalOnboarding({ onComplete });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Carregando informações..." />
      </div>
    );
  }

  const stepProps = { register, setValue, watch };

  const stepComponents = {
    1: (
      <Step1Professional
        {...stepProps}
        choices={choices}
        suggestions={suggestions}
        expertiseInput={expertiseInput}
        setExpertiseInput={setExpertiseInput}
        handleAddExpertise={handleAddExpertise}
        handleRemoveExpertise={handleRemoveExpertise}
      />
    ),
    2: <Step2Content {...stepProps} choices={choices} />,
    3: <Step3SocialBusiness {...stepProps} choices={choices} />,
    4: (
      <Step4Resources
        {...stepProps}
        suggestions={suggestions}
        toolsInput={toolsInput}
        setToolsInput={setToolsInput}
        handleAddTool={handleAddTool}
        handleRemoveTool={handleRemoveTool}
        handleToggleHour={handleToggleHour}
      />
    ),
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Aprimorar Perfil - Etapa {currentStep} de 4
                </CardTitle>
                <CardDescription>
                  Informações opcionais para personalizar sua experiência
                </CardDescription>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                return;
              }}
              className="space-y-6"
            >
              {stepComponents[currentStep as keyof typeof stepComponents]}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onSkip}>
                    Pular
                  </Button>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      Anterior
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {currentStep < 4 ? (
                    <Button type="button" onClick={handleNext}>
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={optionalMutation.isPending}
                      className="min-w-[120px]"
                      onClick={() => {
                        const formData = watch();
                        onSubmit(formData);
                      }}
                    >
                      {optionalMutation.isPending ? (
                        <Loading text="Salvando..." size="sm" />
                      ) : (
                        "🎉 Finalizar"
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
