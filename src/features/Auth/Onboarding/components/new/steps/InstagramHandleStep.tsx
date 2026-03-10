import { Input } from "@/components/ui/input";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface InstagramHandleStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const INSTAGRAM_HANDLE_REGEX = /^[a-zA-Z0-9._]{1,30}$/;

export const InstagramHandleStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: InstagramHandleStepProps) => {
  const isValid = INSTAGRAM_HANDLE_REGEX.test(value);
  const charCount = value.length;

  const handleChange = (raw: string) => {
    const sanitized = raw.replace(/^@+/, "").replace(/[^a-zA-Z0-9._]/g, "");
    onChange(sanitized);
  };

  return (
    <MicroStepLayout
      step={3}
      totalSteps={TOTAL_STEPS}
      title="Qual é o seu Instagram?"
      subtitle="Se você tem um perfil comercial, use o nome de usuário do Instagram (ex: @studio_maria_souza)."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-4">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Ex: studio_maria_souza"
          className="h-14 text-lg px-4"
          autoFocus
          maxLength={30}
        />
        <p className="text-sm text-muted-foreground">
          Este nome será usado para personalizar suas ideias de posts.
        </p>
          <div className="flex justify-between text-xs text-muted-foreground">
          <span>{charCount < 2 ? `Mínimo ${2 - charCount} caracteres` : "Ótimo!"}</span>
          <span>{charCount}/30</span>
        </div>
      </div>
    </MicroStepLayout>
  );
};
