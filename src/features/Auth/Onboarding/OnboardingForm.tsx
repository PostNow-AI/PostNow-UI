import { Button, Progress } from "@/components";
import { BetaLogo } from "@/components/ui/beta-logo";
import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/features/Auth/Onboarding/hooks/useOnboarding";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { BrandingStep } from "./components/BrandingStep";
import { BusinessInfoStep } from "./components/BusinessInfoStep";
import { PersonalInfoStep } from "./components/PersonalInfoStep";
import { ReviewStep } from "./components/ReviewStep";

export const OnboardingForm = () => {
  const {
    isSubmitting,
    handleFormSubmit,
    form,
    currentStep,
    handleNextStep,
    handlePrevStep,
    percentage,
  } = useOnboarding();

  const { handleSubmit } = form;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} />;
      case 2:
        return <BusinessInfoStep form={form} />;
      case 3:
        return <BrandingStep form={form} />;
      case 4:
        return <ReviewStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-4">
      <div className="text-center space-y-2 mt-14">
        <BetaLogo />
        <h1 className="text-2xl font-bold">
          Vamos começar, me fale um pouco{" "}
          <span className="text-primary">sobre você</span>
        </h1>
      </div>
      {currentStep <= 3 && (
        <div className="space-y-2 max-w-[640px] w-full px-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Etapa {currentStep} de 3</span>
          </div>
          <Progress className="bg-white" value={percentage} />
        </div>
      )}
      <form className="flex flex-col w-full">
        <Card
          className={"w-full self-center overflow-auto max-w-[640px] mb-20"}
        >
          {renderStepContent()}
          <div className="flex justify-end gap-3 w-full px-4">
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
  );
};
