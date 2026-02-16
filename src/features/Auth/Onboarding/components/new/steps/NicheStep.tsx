import { Input } from "@/components/ui/input";
import { MicroStepLayout } from "../MicroStepLayout";
import { SelectableCards } from "../SelectableCards";
import { TOTAL_STEPS, nicheOptions } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { useState } from "react";

interface NicheStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const NicheStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: NicheStepProps) => {
  const [customNiche, setCustomNiche] = useState("");
  const isOther = value === "outro";
  const isValid = value.length > 0 && (!isOther || customNiche.trim().length > 0);

  const handleSelect = (id: string) => {
    onChange(id);
    if (id !== "outro") {
      setCustomNiche("");
    }
  };

  const handleNext = () => {
    if (isOther && customNiche.trim()) {
      onChange(customNiche.trim());
    }
    onNext();
  };

  return (
    <MicroStepLayout
      step={4}
      totalSteps={TOTAL_STEPS}
      title="Qual é o seu nicho de atuação?"
      subtitle="Escolha a área que melhor representa seu negócio."
      onNext={handleNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-4">
        <SelectableCards
          options={nicheOptions}
          selected={value}
          onSelect={handleSelect}
          columns={2}
          size="sm"
        />

        {isOther && (
          <Input
            value={customNiche}
            onChange={(e) => setCustomNiche(e.target.value)}
            placeholder="Digite seu nicho..."
            className="h-12 text-base"
            autoFocus
          />
        )}
      </div>
    </MicroStepLayout>
  );
};
