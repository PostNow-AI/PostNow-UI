import { PersonalityQuizStep } from "./PersonalityQuizStep";

interface PersonalityStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step de seleção de personalidade da marca
 * Usa o quiz "This or That" para descobrir a personalidade
 */
export const PersonalityStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: PersonalityStepProps) => {
  return (
    <PersonalityQuizStep
      value={value}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
    />
  );
};
