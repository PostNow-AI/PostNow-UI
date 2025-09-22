import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/features/Auth/Onboarding/hooks/useOnboarding";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { BrandingStep } from "./BrandingStep";
import { BusinessInfoStep } from "./BusinessInfoStep";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { ReviewStep } from "./ReviewStep";

export const OnboardingForm = () => {
  const {
    isSubmitting,
    allAvailableProfessions,
    availableSpecializations,
    handleFormSubmit,
    isLoadingSpecializations,
    form,
    currentStep,
    handleNextStep,
    handlePrevStep,
  } = useOnboarding();

  const { handleSubmit } = form;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep professions={allAvailableProfessions} form={form} />
        );
      case 2:
        return (
          <BusinessInfoStep
            form={form}
            isLoadingSpecializations={isLoadingSpecializations}
            availableSpecializations={availableSpecializations}
          />
        );
      case 3:
        return <BrandingStep form={form} />;
      case 4:
        return <ReviewStep form={form} />;
      default:
        return null;
    }
  };

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
