import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface VoiceToneStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const voiceToneChips = [
  { id: "casual", label: "Casual e Amigável", description: "Tom descontraído e próximo" },
  { id: "inspirador", label: "Inspirador", description: "Mensagens que motivam" },
  { id: "educativo", label: "Educativo", description: "Foco em ensinar e informar" },
  { id: "profissional", label: "Profissional", description: "Comunicação séria e corporativa" },
  { id: "divertido", label: "Divertido", description: "Humor e leveza" },
  { id: "autoridade", label: "Autoridade", description: "Posicionamento como especialista" },
];

export const VoiceToneStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: VoiceToneStepProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  // Check if current value is a predefined option
  const isPredefinedOption = voiceToneChips.some(chip => chip.label === value);
  const isCustomValue = value && !isPredefinedOption;

  const isValid = value.length > 0;

  const handleSelect = (label: string) => {
    if (value === label) {
      onChange("");
    } else {
      onChange(label);
      setShowCustomInput(false);
    }
  };

  const handleOpenCustomInput = () => {
    onChange(""); // Clear previous selection
    setShowCustomInput(true);
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setShowCustomInput(false);
      setCustomValue("");
    }
  };

  const handleCancelCustom = () => {
    setShowCustomInput(false);
    setCustomValue("");
  };

  return (
    <MicroStepLayout
      step={9}
      totalSteps={TOTAL_STEPS}
      title="Qual o tom de voz da sua marca?"
      subtitle="Como você quer se comunicar com seu público?"
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="h-full flex flex-col">
        {/* Chips grid */}
        <div className="flex flex-wrap gap-2">
          {voiceToneChips.map(chip => {
            const isSelected = value === chip.label;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleSelect(chip.label)}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  "border-2",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                {chip.label}
              </button>
            );
          })}

          {/* Custom value chip (if exists) */}
          {isCustomValue && !showCustomInput && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap bg-primary text-primary-foreground border-2 border-primary"
            >
              {value}
            </button>
          )}

          {/* Outro button */}
          {!showCustomInput && !isCustomValue && (
            <button
              type="button"
              onClick={handleOpenCustomInput}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/5"
            >
              <Plus className="h-4 w-4" />
              Outro
            </button>
          )}
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-1" />

        {/* Custom input - at bottom */}
        {showCustomInput && (
          <div className="flex gap-2">
            <Input
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustom();
                } else if (e.key === "Escape") {
                  handleCancelCustom();
                }
              }}
              placeholder="Digite o tom de voz..."
              className="flex-1 h-10 text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddCustom}
              disabled={!customValue.trim()}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                customValue.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              OK
            </button>
          </div>
        )}

        {/* Description of selected option - at bottom */}
        {value && isPredefinedOption && !showCustomInput && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              {voiceToneChips.find(c => c.label === value)?.description}
            </p>
          </div>
        )}
      </div>
    </MicroStepLayout>
  );
};
