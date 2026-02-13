import { Textarea } from "@/components/ui/textarea";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface PurposeStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PurposeStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: PurposeStepProps) => {
  const isValid = value.trim().length >= 10;
  const charCount = value.length;

  return (
    <MicroStepLayout
      step={6}
      totalSteps={TOTAL_STEPS}
      title="Qual o propósito da sua marca?"
      subtitle="Por que você faz o que faz? Qual impacto quer causar?"
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Meu propósito é democratizar o acesso à beleza e fazer cada cliente se sentir especial e confiante."
          className="min-h-[120px] text-base resize-none"
          autoFocus
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{charCount < 10 ? `Mínimo ${10 - charCount} caracteres` : "Perfeito!"}</span>
          <span>{charCount}/500</span>
        </div>
      </div>
    </MicroStepLayout>
  );
};
