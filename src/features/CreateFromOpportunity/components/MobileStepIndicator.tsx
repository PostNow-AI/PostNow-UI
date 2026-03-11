import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const MobileStepIndicator = ({
  currentStep,
  totalSteps,
}: MobileStepIndicatorProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.map((step) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1",
                  step < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
