import { MicroStepLayout } from "../MicroStepLayout";
import { SelectableChips } from "../SelectableChips";
import { TOTAL_STEPS, personalityOptions } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface PersonalityStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PersonalityStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: PersonalityStepProps) => {
  const isValid = value.length >= 1;

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else if (value.length < 5) {
      onChange([...value, option]);
    }
  };

  return (
    <MicroStepLayout
      step={7}
      totalSteps={TOTAL_STEPS}
      title="Como você quer que as pessoas vejam sua marca?"
      subtitle="Escolha até 5 características que definem sua marca."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <SelectableChips
        options={personalityOptions}
        selected={value}
        onToggle={handleToggle}
        maxSelections={5}
        allowCustom
        customPlaceholder="Digite outra característica..."
      />
    </MicroStepLayout>
  );
};
