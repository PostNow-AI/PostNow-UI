import { MicroStepLayout } from "../MicroStepLayout";
import { SelectableChips } from "../SelectableChips";
import { TOTAL_STEPS, interestOptions } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface InterestsStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const InterestsStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: InterestsStepProps) => {
  const isValid = value.length >= 1;

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else if (value.length < 8) {
      onChange([...value, option]);
    }
  };

  return (
    <MicroStepLayout
      step={10}
      totalSteps={TOTAL_STEPS}
      title="Quais são os interesses do seu público?"
      subtitle="Escolha até 8 interesses que seu cliente ideal tem."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <SelectableChips
        options={interestOptions}
        selected={value}
        onToggle={handleToggle}
        maxSelections={8}
        allowCustom
        customPlaceholder="Digite outro interesse..."
      />
    </MicroStepLayout>
  );
};
