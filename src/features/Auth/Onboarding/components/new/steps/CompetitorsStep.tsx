import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface CompetitorsStepProps {
  competitors: string;
  referenceProfiles: string;
  onCompetitorsChange: (value: string) => void;
  onReferenceProfilesChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CompetitorsStep = ({
  competitors,
  referenceProfiles,
  onCompetitorsChange,
  onReferenceProfilesChange,
  onNext,
  onBack,
}: CompetitorsStepProps) => {
  // Ambos campos são opcionais
  const isValid = true;
  const hasContent = competitors.trim() || referenceProfiles.trim();

  return (
    <MicroStepLayout
      step={12}
      totalSteps={TOTAL_STEPS}
      title="Referências e concorrentes"
      subtitle="Opcional - nos ajuda a entender seu mercado."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
      nextLabel={hasContent ? "Continuar" : "Ignorar"}
    >
      <div className="space-y-5">
        {/* Concorrentes */}
        <div className="space-y-2">
          <Label htmlFor="competitors">Principais concorrentes</Label>
          <Textarea
            id="competitors"
            value={competitors}
            onChange={(e) => onCompetitorsChange(e.target.value)}
            placeholder="Ex: @concorrente1, @concorrente2, Empresa XYZ..."
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            Liste marcas ou perfis que competem no seu mercado.
          </p>
        </div>

        {/* Perfis de referência */}
        <div className="space-y-2">
          <Label htmlFor="reference">Perfis que você admira</Label>
          <Textarea
            id="reference"
            value={referenceProfiles}
            onChange={(e) => onReferenceProfilesChange(e.target.value)}
            placeholder="Ex: @perfil_inspirador, @marca_referencia..."
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            Perfis que você usa como inspiração para seu conteúdo.
          </p>
        </div>
      </div>
    </MicroStepLayout>
  );
};
