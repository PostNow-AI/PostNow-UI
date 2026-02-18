import { MicroStepLayout } from "../MicroStepLayout";
import { SelectableChips } from "../SelectableChips";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface ChipsSelectionStepProps {
  /** Número do step atual */
  step: number;
  /** Título do step */
  title: string;
  /** Subtítulo/descrição */
  subtitle: string;
  /** Opções disponíveis para seleção */
  options: string[];
  /** Valores selecionados */
  value: string[];
  /** Callback quando seleção muda */
  onChange: (value: string[]) => void;
  /** Máximo de seleções permitidas */
  maxSelections: number;
  /** Mínimo de seleções requeridas (default: 1) */
  minSelections?: number;
  /** Permite adicionar opção customizada */
  allowCustom?: boolean;
  /** Placeholder do input customizado */
  customPlaceholder?: string;
  /** Callback para próximo step */
  onNext: () => void;
  /** Callback para step anterior */
  onBack: () => void;
}

/**
 * Componente genérico para steps de seleção múltipla com chips
 * Usado por PersonalityStep, InterestsStep e outros steps similares
 *
 * @example
 * <ChipsSelectionStep
 *   step={5}
 *   title="Como você quer que as pessoas vejam sua marca?"
 *   subtitle="Escolha até 5 características"
 *   options={personalityOptions}
 *   value={selectedValues}
 *   onChange={setSelectedValues}
 *   maxSelections={5}
 *   allowCustom
 *   customPlaceholder="Digite outra característica..."
 *   onNext={handleNext}
 *   onBack={handleBack}
 * />
 */
export const ChipsSelectionStep = ({
  step,
  title,
  subtitle,
  options,
  value,
  onChange,
  maxSelections,
  minSelections = 1,
  allowCustom = false,
  customPlaceholder,
  onNext,
  onBack,
}: ChipsSelectionStepProps) => {
  const isValid = value.length >= minSelections;

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else if (value.length < maxSelections) {
      onChange([...value, option]);
    }
  };

  return (
    <MicroStepLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      title={title}
      subtitle={subtitle}
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <SelectableChips
        options={options}
        selected={value}
        onToggle={handleToggle}
        maxSelections={maxSelections}
        allowCustom={allowCustom}
        customPlaceholder={customPlaceholder}
      />
    </MicroStepLayout>
  );
};

// === CONFIGURAÇÕES PRÉ-DEFINIDAS ===

import {
  personalityOptions,
  interestOptions,
} from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

/** Configuração para PersonalityStep */
export const PERSONALITY_STEP_CONFIG = {
  step: 5,
  title: "Como você quer que as pessoas vejam sua marca?",
  subtitle: "Escolha as características que melhor definem você.",
  options: personalityOptions,
  maxSelections: 5,
  allowCustom: true,
  customPlaceholder: "Digite outra característica...",
} as const;

/** Configuração para InterestsStep */
export const INTERESTS_STEP_CONFIG = {
  step: 7,
  title: "Quais são os interesses do seu público?",
  subtitle: "Pense no que seu cliente ideal gosta e consome.",
  options: interestOptions,
  maxSelections: 8,
  allowCustom: true,
  customPlaceholder: "Digite outro interesse...",
} as const;
