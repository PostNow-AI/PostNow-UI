import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { useProfessionalInfo } from "@/hooks/useProfessionalInfo";
import { Loader2, User } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

interface ProfileFormData {
  professional_name?: string | null;
  profession?: string | null;
  specialization?: string | null;
  custom_profession?: string | null;
  custom_specialization?: string | null;
}

interface ProfessionalInfoSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

export const ProfessionalInfoSection = ({
  form,
}: ProfessionalInfoSectionProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedValues = watch();

  const {
    customProfessionInput,
    setCustomProfessionInput,
    isLoadingSpecializations,
    specializationsError,
    allAvailableProfessions,
    availableSpecializations,
    createProfessionMutation,
    createSpecializationMutation,
    handleAddCustomProfession,
    handleAddCustomSpecialization,
  } = useProfessionalInfo(form);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informações Profissionais
        </CardTitle>
        <CardDescription>
          Como você gostaria de ser conhecido profissionalmente?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="professional_name">Nome Profissional</Label>
            <Input
              id="professional_name"
              placeholder="Ex: Dr. João Silva, Maria Santos Consultoria, Tech Solutions Ltda"
              {...register("professional_name")}
            />
            {errors.professional_name && (
              <p className="text-sm text-destructive">
                {errors.professional_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profissão</Label>
            <Select
              onValueChange={(value) => setValue("profession", value)}
              value={watchedValues.profession || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma profissão" />
              </SelectTrigger>
              <SelectContent>
                {allAvailableProfessions.map((profession) => (
                  <SelectItem key={profession} value={profession}>
                    {profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.profession && (
              <p className="text-sm text-destructive">
                {errors.profession.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Especialização</Label>
            <Select
              onValueChange={(value) => setValue("specialization", value)}
              value={watchedValues.specialization || ""}
              disabled={
                !watchedValues.profession ||
                watchedValues.profession === "Outro" ||
                isLoadingSpecializations
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingSpecializations
                      ? "Carregando especializações..."
                      : "Selecione uma especialização"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSpecializations ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Carregando...
                  </div>
                ) : (
                  availableSpecializations.map(
                    (specialization: { id: number; name: string }) => (
                      <SelectItem
                        key={specialization.id}
                        value={specialization.name}
                      >
                        {specialization.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </Select>
            {errors.specialization && (
              <p className="text-sm text-destructive">
                {errors.specialization.message}
              </p>
            )}
            {specializationsError && (
              <p className="text-sm text-destructive">
                Erro ao carregar especializações: {specializationsError.message}
              </p>
            )}
          </div>
        </div>

        {/* Campos condicionais para profissão e especialização personalizadas */}
        {watchedValues.profession === "Outro" && (
          <div className="space-y-2">
            <Label htmlFor="custom_profession">Qual é sua profissão?</Label>
            <div className="flex gap-2">
              <Input
                id="custom_profession"
                placeholder="Ex: Especialista em marketing digital, Consultor de vendas, Designer UX/UI, Analista de dados..."
                value={customProfessionInput}
                onChange={(e) => setCustomProfessionInput(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCustomProfession}
                disabled={
                  !customProfessionInput.trim() ||
                  createProfessionMutation.isPending
                }
              >
                {createProfessionMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Adicionar"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sua profissão será salva para referência futura de outros
              usuários.
            </p>
          </div>
        )}

        {/* Campo de especialização customizada para todas as profissões */}
        {watchedValues.profession && watchedValues.profession !== "Outro" && (
          <div className="space-y-2">
            <Label htmlFor="custom_specialization">
              Especialização Personalizada
            </Label>
            <div className="flex gap-2">
              <Textarea
                id="custom_specialization"
                placeholder="Ex: Marketing de influência para nichos específicos, automação de processos de vendas, estratégias de conteúdo para LinkedIn..."
                rows={3}
                className="flex-1"
                {...register("custom_specialization")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCustomSpecialization}
                disabled={
                  !watchedValues.custom_specialization?.trim() ||
                  createSpecializationMutation.isPending
                }
                className="self-start"
              >
                {createSpecializationMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Adicionar"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sua especialização será salva para referência futura de outros
              usuários.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
