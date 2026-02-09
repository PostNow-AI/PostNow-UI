import { Textarea } from "@/components/ui/textarea";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface TargetAudienceStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const TargetAudienceStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: TargetAudienceStepProps) => {
  const isValid = value.trim().length >= 10;
  const charCount = value.length;

  return (
    <MicroStepLayout
      step={9}
      totalSteps={TOTAL_STEPS}
      title="Quem é seu cliente ideal?"
      subtitle="Descreva características demográficas e comportamentais."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Mulheres de 25 a 45 anos, classe média-alta, que se preocupam com autocuidado e buscam tratamentos de qualidade..."
          className="min-h-[140px] text-base resize-none"
          autoFocus
          maxLength={1000}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {charCount < 10 ? `Mínimo ${10 - charCount} caracteres` : "Perfeito!"}
          </span>
          <span>{charCount}/1000</span>
        </div>
      </div>
    </MicroStepLayout>
  );
};
