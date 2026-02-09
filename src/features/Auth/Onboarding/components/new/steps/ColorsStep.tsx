import { useState, useEffect } from "react";
import { MicroStepLayout } from "../MicroStepLayout";
import { ColorPicker } from "../ColorPicker";
import { TOTAL_STEPS, colorPalettes } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface ColorsStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestedColors?: string[];
  onNext: () => void;
  onBack: () => void;
}

export const ColorsStep = ({
  value,
  onChange,
  suggestedColors,
  onNext,
  onBack,
}: ColorsStepProps) => {
  const [hasAppliedSuggested, setHasAppliedSuggested] = useState(false);

  // Auto-aplicar cores sugeridas do logo
  useEffect(() => {
    if (suggestedColors?.length === 5 && !hasAppliedSuggested) {
      onChange(suggestedColors);
      setHasAppliedSuggested(true);
    }
  }, [suggestedColors, hasAppliedSuggested, onChange]);

  // Cores sempre são válidas (tem default)
  const isValid = value.length === 5;

  return (
    <MicroStepLayout
      step={16}
      totalSteps={TOTAL_STEPS}
      title="Suas cores"
      subtitle="Escolha uma paleta ou personalize suas cores da marca."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <ColorPicker
        colors={value}
        onChange={onChange}
        palettes={colorPalettes}
        logoPalette={suggestedColors}
      />
    </MicroStepLayout>
  );
};
