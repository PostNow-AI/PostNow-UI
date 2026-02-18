import { ChipsSelectionStep, INTERESTS_STEP_CONFIG } from "./ChipsSelectionStep";

interface InterestsStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step de seleção de interesses do público
 * Usa o componente genérico ChipsSelectionStep
 */
export const InterestsStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: InterestsStepProps) => {
  return (
    <ChipsSelectionStep
      {...INTERESTS_STEP_CONFIG}
      value={value}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
    />
  );
};
