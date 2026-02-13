import { Input } from "@/components/ui/input";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { MapPin } from "lucide-react";

interface LocationStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LocationStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: LocationStepProps) => {
  const isValid = value.trim().length >= 2;

  return (
    <MicroStepLayout
      step={11}
      totalSteps={TOTAL_STEPS}
      title="Onde seu público está?"
      subtitle="Cidade, estado ou região que você atende."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-4">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ex: São Paulo, SP"
            className="h-14 text-lg pl-12"
            autoFocus
            maxLength={100}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Se atende online/todo Brasil, escreva "Brasil" ou "online".
        </p>
      </div>
    </MicroStepLayout>
  );
};
