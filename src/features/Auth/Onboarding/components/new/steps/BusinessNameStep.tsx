import { Input } from "@/components/ui/input";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface BusinessNameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BusinessNameStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: BusinessNameStepProps) => {
  const isValid = value.trim().length >= 2;

  return (
    <MicroStepLayout
      step={2}
      totalSteps={TOTAL_STEPS}
      title="Qual é o nome do seu negócio?"
      subtitle="Se você é autônomo, pode usar seu nome profissional."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-4">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Studio Maria Souza"
          className="h-14 text-lg px-4"
          autoFocus
          maxLength={200}
        />
        <p className="text-sm text-muted-foreground">
          Este nome será usado para personalizar suas ideias de posts.
        </p>
      </div>
    </MicroStepLayout>
  );
};
