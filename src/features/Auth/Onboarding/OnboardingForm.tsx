import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/features/Auth/Onboarding/hooks/useOnboarding";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { BrandingStep } from "./components/BrandingStep";
import { BusinessInfoStep } from "./components/BusinessInfoStep";
import { PersonalInfoStep } from "./components/PersonalInfoStep";
import { ReviewStep } from "./components/ReviewStep";

export const OnboardingForm = ({ open }: { open: boolean }) => {
  const {
    isSubmitting,
    handleFormSubmit,
    form,
    currentStep,
    handleNextStep,
    handlePrevStep,
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
    <Dialog open={open}>
      <DialogContent
        className="max-w-6xl max-h-[97vh] [&>button]:hidden p-0 overflow-auto"
        style={{ width: "95vw", maxWidth: "1400px" }}
      >
        <DialogHeader className="px-4 pt-4 h-[60px]">
          <DialogTitle className="flex items-center gap-2">
            Sobre você{" "}
          </DialogTitle>
          <Separator className="absolute left-0 right-0 top-13 w-full" />
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center space-y-2">
            <img src="Logo-sonoria.svg" alt="Logo" className="mx-auto mb-4" />

            <h1 className="text-2xl font-bold">
              Vamos começar, me fale um pouco{" "}
              <span className="text-primary">sobre você</span>
            </h1>
          </div>
          {/* Progress Indicator */}
          {currentStep <= 3 && (
            <div className="space-y-2 max-w-[640px] w-full px-6">
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
          <form className="flex flex-col w-full">
            <Card
              className={
                "w-full self-center  overflow-auto max-w-[640px] mb-20"
              }
            >
              {renderStepContent()}
            </Card>
            <Separator className="w-full" />
            <div className="flex justify-end gap-3 w-full px-4 py-4">
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
          </form>
        </div>{" "}
      </DialogContent>
    </Dialog>
  );
};
