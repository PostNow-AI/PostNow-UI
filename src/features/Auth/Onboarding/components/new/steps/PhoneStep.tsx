import { Input } from "@/components/ui/input";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { phoneMask } from "@/utils";

interface PhoneStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  stepNumber: number;
}

export const PhoneStep = ({
  value,
  onChange,
  onNext,
  onBack,
  stepNumber,
}: PhoneStepProps) => {
  const isValid = value.replace(/\D/g, "").length >= 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = phoneMask(e.target.value);
    onChange(masked);
  };

  return (
    <MicroStepLayout
      step={stepNumber}
      totalSteps={TOTAL_STEPS}
      title="Qual o telefone do seu negócio?"
      subtitle="Usaremos para enviar suas ideias de posts no futuro."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            +55
          </span>
          <Input
            value={value}
            onChange={handleChange}
            placeholder="(99) 99999-9999"
            className="h-14 text-lg pl-14"
            autoFocus
            type="tel"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Informe um número de WhatsApp válido.
        </p>
      </div>
    </MicroStepLayout>
  );
};
