import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ProfessionalInfoSectionProps {
  form: UseFormReturn<any>;
}

export const ProfessionalInfoSection = ({ form }: ProfessionalInfoSectionProps) => {
  const { register, watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

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
              placeholder="Ex: Dr. João Silva"
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
                <SelectItem value="Advogado">Advogado</SelectItem>
                <SelectItem value="Coach">Coach</SelectItem>
                <SelectItem value="Consultor">Consultor</SelectItem>
                <SelectItem value="Médico">Médico</SelectItem>
                <SelectItem value="Psicólogo">Psicólogo</SelectItem>
                <SelectItem value="Dentista">Dentista</SelectItem>
                <SelectItem value="Contador">Contador</SelectItem>
                <SelectItem value="Arquiteto">Arquiteto</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Programador">Programador</SelectItem>
                <SelectItem value="Professor">Professor</SelectItem>
                <SelectItem value="Fisioterapeuta">Fisioterapeuta</SelectItem>
                <SelectItem value="Nutricionista">Nutricionista</SelectItem>
                <SelectItem value="Personal Trainer">Personal Trainer</SelectItem>
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
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma especialização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tributário">Tributário</SelectItem>
                <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
                <SelectItem value="Executivo">Executivo</SelectItem>
                <SelectItem value="Empresarial">Empresarial</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Digital">Digital</SelectItem>
                <SelectItem value="Estratégico">Estratégico</SelectItem>
                <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                <SelectItem value="Psicologia Clínica">Psicologia Clínica</SelectItem>
                <SelectItem value="Psicologia Organizacional">Psicologia Organizacional</SelectItem>
                <SelectItem value="Endodontia">Endodontia</SelectItem>
                <SelectItem value="Ortodontia">Ortodontia</SelectItem>
                <SelectItem value="Contabilidade Tributária">Contabilidade Tributária</SelectItem>
                <SelectItem value="Contabilidade Societária">Contabilidade Societária</SelectItem>
                <SelectItem value="Arquitetura Residencial">Arquitetura Residencial</SelectItem>
                <SelectItem value="Arquitetura Comercial">Arquitetura Comercial</SelectItem>
                <SelectItem value="Design Gráfico">Design Gráfico</SelectItem>
                <SelectItem value="Design de Produto">Design de Produto</SelectItem>
                <SelectItem value="Desenvolvimento Web">Desenvolvimento Web</SelectItem>
                <SelectItem value="Desenvolvimento Mobile">Desenvolvimento Mobile</SelectItem>
                <SelectItem value="Clínica Geral">Clínica Geral</SelectItem>
                <SelectItem value="Pediatria">Pediatria</SelectItem>
                <SelectItem value="Educação Física">Educação Física</SelectItem>
                <SelectItem value="Nutrição Esportiva">Nutrição Esportiva</SelectItem>
                <SelectItem value="Nutrição Clínica">Nutrição Clínica</SelectItem>
              </SelectContent>
            </Select>
            {errors.specialization && (
              <p className="text-sm text-destructive">
                {errors.specialization.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 