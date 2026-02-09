import { Textarea } from "@/components/ui/textarea";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface ProductsStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProductsStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: ProductsStepProps) => {
  const isValid = value.trim().length >= 10;
  const charCount = value.length;

  return (
    <MicroStepLayout
      step={8}
      totalSteps={TOTAL_STEPS}
      title="Quais produtos/serviços você oferece?"
      subtitle="Liste seus principais produtos ou serviços."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Limpeza de pele, peeling, design de sobrancelhas, massagem facial, tratamento anti-idade..."
          className="min-h-[140px] text-base resize-none"
          autoFocus
          maxLength={1000}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {charCount < 10 ? `Mínimo ${10 - charCount} caracteres` : "Excelente!"}
          </span>
          <span>{charCount}/1000</span>
        </div>
      </div>
    </MicroStepLayout>
  );
};
