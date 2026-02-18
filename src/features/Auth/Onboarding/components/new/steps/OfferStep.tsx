import { Input } from "@/components/ui/input";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { useState, useEffect } from "react";

interface OfferStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface OfferParts {
  audience: string;
  transformation: string;
  method: string;
}

const parseOffer = (value: string): OfferParts => {
  // Try to parse existing value into parts
  // Format: "Eu ajudo [audience] a [transformation] através de [method]"
  const regex = /^Eu ajudo (.+?) a (.+?) através de (.+?)\.?$/i;
  const match = value.match(regex);

  if (match) {
    return {
      audience: (match[1] || "").replace(/\.+$/, ""),
      transformation: (match[2] || "").replace(/\.+$/, ""),
      method: (match[3] || "").replace(/\.+$/, ""),
    };
  }

  return { audience: "", transformation: "", method: "" };
};

const buildOffer = (parts: OfferParts): string => {
  const { audience, transformation, method } = parts;
  if (!audience && !transformation && !method) return "";
  // Remove trailing periods from parts before building
  const cleanAudience = audience.replace(/\.+$/, "");
  const cleanTransformation = transformation.replace(/\.+$/, "");
  const cleanMethod = method.replace(/\.+$/, "");
  return `Eu ajudo ${cleanAudience} a ${cleanTransformation} através de ${cleanMethod}`;
};

const buildPreview = (parts: OfferParts): string => {
  const offer = buildOffer(parts);
  if (!offer) return "";
  return offer + ".";
};

export const OfferStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: OfferStepProps) => {
  const [parts, setParts] = useState<OfferParts>(() => parseOffer(value));

  // Update the combined value when parts change
  useEffect(() => {
    const newValue = buildOffer(parts);
    if (newValue !== value && (parts.audience || parts.transformation || parts.method)) {
      onChange(newValue);
    }
  }, [parts, onChange, value]);

  const updatePart = (key: keyof OfferParts, newValue: string) => {
    setParts(prev => ({ ...prev, [key]: newValue }));
  };

  const isValid = parts.audience.trim().length >= 3 &&
                  parts.transformation.trim().length >= 3 &&
                  parts.method.trim().length >= 3;

  // Preview of the complete phrase (with period at the end)
  const preview = buildPreview(parts);

  return (
    <MicroStepLayout
      step={4}
      totalSteps={TOTAL_STEPS}
      title="Qual é a sua oferta?"
      subtitle="Complete a frase para definir claramente o que você oferece"
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="h-full flex flex-col">
        {/* Guided phrase builder */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground shrink-0">Eu ajudo</span>
            <Input
              id="audience"
              value={parts.audience}
              onChange={(e) => updatePart("audience", e.target.value)}
              placeholder="mulheres que buscam autoestima"
              className="text-sm h-10"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground shrink-0">a</span>
            <Input
              id="transformation"
              value={parts.transformation}
              onChange={(e) => updatePart("transformation", e.target.value)}
              placeholder="recuperar a confiança e se sentir bem"
              className="text-sm h-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground shrink-0">através de</span>
            <Input
              id="method"
              value={parts.method}
              onChange={(e) => updatePart("method", e.target.value)}
              placeholder="tratamentos estéticos"
              className="text-sm h-10"
            />
          </div>
        </div>

        {/* Preview */}
        {isValid && (
          <div className="shrink-0 p-3 bg-primary/5 rounded-lg border border-primary/20 mt-4">
            <p className="text-xs text-muted-foreground mb-1">Sua oferta:</p>
            <p className="text-sm font-medium text-foreground">{preview}</p>
          </div>
        )}
      </div>
    </MicroStepLayout>
  );
};
