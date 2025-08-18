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
import { globalOptionsApi } from "@/lib/global-options-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, User } from "lucide-react";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface Specialization {
  id: number;
  name: string;
  is_custom?: boolean;
}

interface ProfileFormData {
  professional_name?: string;
  profession?: string;
  specialization?: string;
  custom_profession?: string;
  custom_specialization?: string;
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
  const queryClient = useQueryClient();
  const [customProfessionInput, setCustomProfessionInput] = useState("");

  // Buscar dados da API
  const { data: professions = [] } = useQuery({
    queryKey: ["professions"],
    queryFn: globalOptionsApi.getProfessions,
  });

  const { data: specializations } = useQuery({
    queryKey: ["specializations", watchedValues.profession],
    queryFn: async () => {
      if (watchedValues.profession && watchedValues.profession !== "Outro") {
        const profession = professions.find(
          (p) => p.name === watchedValues.profession
        );
        if (profession) {
          return await globalOptionsApi.getProfessionSpecializations(
            profession.id
          );
        }
      }
      return { profession: null, specializations: [] };
    },
    enabled: !!watchedValues.profession && watchedValues.profession !== "Outro",
  });

  // Mutations para criar opções customizadas
  const createProfessionMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomProfession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professions"] });
      toast.success("Profissão criada com sucesso!");
      setCustomProfessionInput("");
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Erro ao criar profissão"
        );
      } else {
        toast.error("Erro ao criar profissão");
      }
    },
  });

  const handleAddCustomProfession = async () => {
    if (!customProfessionInput.trim()) return;

    try {
      await createProfessionMutation.mutateAsync({
        name: customProfessionInput.trim(),
      });
    } catch {
      // Error is handled by the mutation
    }
  };

  // Obter todas as profissões disponíveis
  const allAvailableProfessions = [
    ...(professions.map((p) => p.name) || []),
    "Outro",
  ];

  // Obter especializações disponíveis para a profissão selecionada
  const availableSpecializations = specializations?.specializations || [];

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
                watchedValues.profession === "Outro"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma especialização" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecializations.map(
                  (specialization: Specialization) => (
                    <SelectItem
                      key={specialization.id}
                      value={specialization.name}
                    >
                      {specialization.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {errors.specialization && (
              <p className="text-sm text-destructive">
                {errors.specialization.message}
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
            <Textarea
              id="custom_specialization"
              placeholder="Ex: Marketing de influência para nichos específicos, automação de processos de vendas, estratégias de conteúdo para LinkedIn..."
              rows={3}
              {...register("custom_specialization")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
