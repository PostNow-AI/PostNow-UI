import { MicroStepLayout } from "../MicroStepLayout";
import { SelectableCards } from "../SelectableCards";
import { TOTAL_STEPS, voiceToneOptions } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface VoiceToneStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VoiceToneStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: VoiceToneStepProps) => {
  const isValid = value.length > 0;

  return (
    <MicroStepLayout
      step={13}
      totalSteps={TOTAL_STEPS}
      title="Qual o tom de voz da sua marca?"
      subtitle="Como você quer se comunicar com seu público?"
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <SelectableCards
        options={voiceToneOptions}
        selected={value}
        onSelect={onChange}
        columns={1}
        size="md"
      />
    </MicroStepLayout>
  );
};
