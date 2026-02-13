import { Textarea } from "@/components/ui/textarea";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface DescriptionStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DescriptionStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: DescriptionStepProps) => {
  const isValid = value.trim().length >= 10;
  const charCount = value.length;

  return (
    <MicroStepLayout
      step={5}
      totalSteps={TOTAL_STEPS}
      title="Descreva seu negócio em uma frase"
      subtitle="Seja breve e objetivo - o que seu negócio faz de especial?"
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Ajudo mulheres a recuperarem a autoestima através de tratamentos estéticos personalizados."
          className="min-h-[120px] text-base resize-none"
          autoFocus
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{charCount < 10 ? `Mínimo ${10 - charCount} caracteres` : "Ótimo!"}</span>
          <span>{charCount}/500</span>
        </div>
      </div>
    </MicroStepLayout>
  );
};
