import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { phoneMask } from "@/utils";
import { cn } from "@/lib/utils";

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

// Validation functions
const validateInstagram = (value: string): string | undefined => {
  if (!value) return undefined;
  const clean = value.replace(/^@/, "");
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(clean)) {
    return "Use apenas letras, números, _ e . (máx 30 caracteres)";
  }
  return undefined;
};

const validateWebsite = (value: string): string | undefined => {
  if (!value) return undefined;

  // Verificar se tem espaços ou caracteres inválidos
  if (/\s/.test(value)) {
    return "URL não pode conter espaços";
  }

  // Regex básica para URL
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
  if (!urlPattern.test(value)) {
    return "URL inválida. Ex: https://seunegocio.com";
  }

  return undefined;
};

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
  const [errors, setErrors] = useState<{ instagram?: string; website?: string }>({});

  // Telefone é obrigatório + validation errors
  const isValid = phone.replace(/\D/g, "").length >= 10 && !errors.instagram && !errors.website;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = phoneMask(e.target.value);
    onPhoneChange(masked);
  };

  const handleInstagramChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover @ se o usuário digitar
    const value = e.target.value.replace(/^@/, "");
    onInstagramChange(value);

    // Validate on change
    const error = validateInstagram(value);
    setErrors(prev => ({ ...prev, instagram: error }));
  }, [onInstagramChange]);

  const handleWebsiteChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onWebsiteChange(value);

    // Validate on change
    const error = validateWebsite(value);
    setErrors(prev => ({ ...prev, website: error }));
  }, [onWebsiteChange]);

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
              className={cn("h-12 pl-10", errors.instagram && "border-red-500")}
            />
          </div>
          {errors.instagram && (
            <p className="text-xs text-red-500">{errors.instagram}</p>
          )}
        </div>

        {/* Website - Opcional */}
        <div className="space-y-2">
          <Label htmlFor="website">Website (opcional)</Label>
          <Input
            id="website"
            value={website}
            onChange={handleWebsiteChange}
            placeholder="https://www.seunegocio.com"
            className={cn("h-12", errors.website && "border-red-500")}
          />
          {errors.website && (
            <p className="text-xs text-red-500">{errors.website}</p>
          )}
        </div>
      </div>
    </MicroStepLayout>
  );
};
