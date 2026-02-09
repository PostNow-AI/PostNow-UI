import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { phoneMask } from "@/utils";

interface ContactInfoStepProps {
  phone: string;
  instagram: string;
  website: string;
  onPhoneChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  stepNumber: number;
}

export const ContactInfoStep = ({
  phone,
  instagram,
  website,
  onPhoneChange,
  onInstagramChange,
  onWebsiteChange,
  onNext,
  onBack,
  stepNumber,
}: ContactInfoStepProps) => {
  // Telefone é obrigatório
  const isValid = phone.replace(/\D/g, "").length >= 10;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = phoneMask(e.target.value);
    onPhoneChange(masked);
  };

  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover @ se o usuário digitar
    const value = e.target.value.replace(/^@/, "");
    onInstagramChange(value);
  };

  return (
    <MicroStepLayout
      step={stepNumber}
      totalSteps={TOTAL_STEPS}
      title="Como podemos te contatar?"
      subtitle="Informe seus dados de contato e redes sociais."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-5">
        {/* Telefone - Obrigatório */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone / WhatsApp *</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              +55
            </span>
            <Input
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(99) 99999-9999"
              className="h-12 pl-14"
              autoFocus
              type="tel"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Usaremos para enviar suas ideias de posts no futuro.
          </p>
        </div>

        {/* Instagram - Opcional */}
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram (opcional)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              @
            </span>
            <Input
              id="instagram"
              value={instagram}
              onChange={handleInstagramChange}
              placeholder="seu_usuario"
              className="h-12 pl-10"
            />
          </div>
        </div>

        {/* Website - Opcional */}
        <div className="space-y-2">
          <Label htmlFor="website">Website (opcional)</Label>
          <Input
            id="website"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            placeholder="https://www.seunegocio.com"
            className="h-12"
            type="url"
          />
        </div>
      </div>
    </MicroStepLayout>
  );
};
