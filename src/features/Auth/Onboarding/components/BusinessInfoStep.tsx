import {
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
  Separator,
  Textarea,
} from "@/components";
import { Building } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  ageRangeOptions,
  genderOptions,
  type OnboardingFormData,
} from "../constants/onboardingSchema";

export const BusinessInfoStep = ({
  form,
}: {
  form: UseFormReturn<OnboardingFormData>;
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Informações de Negócio
        </CardTitle>
        <CardDescription>
          Utilizaremos essa informações para criar ideias de posts mais precisas
          e customizadas para seu negócio. Quanto mais detalhes fornecer,
          melhores serão os resultados.
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6 overflow-auto">
        {" "}
        <div className="space-y-2">
          <Label htmlFor="business_name">Nome do Negócio *</Label>
          <Input
            id="business_name"
            placeholder="Digite o nome do seu negócio"
            {...register("business_name")}
          />{" "}
          <p className="text-sm text-muted-foreground">
            Caso seja autônomo, digite seu nome profissional{" "}
          </p>
          {errors.business_name && (
            <p className="text-sm text-destructive">
              {errors.business_name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialization">Nicho/especialidade</Label>
          <Input
            id="specialization"
            placeholder="Ex: Saúde, Beleza, Tecnologia"
            {...register("specialization")}
          />{" "}
          {errors.specialization && (
            <p className="text-sm text-destructive">
              {errors.specialization.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_description">Descrição do Negócio *</Label>
          <Textarea
            rows={3}
            id="business_description"
            placeholder="Descreva o que seu negócio faz, seus produtos/serviços, mercado alvo e o que o torna único."
            {...register("business_description")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisos serão as ideais
            geradas.{" "}
          </p>
          {errors.business_description && (
            <p className="text-sm text-destructive">
              {errors.business_description.message}
            </p>
          )}
        </div>
        <CardTitle>Público-Alvo</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_gender">Gênero *</Label>
            <Select
              onValueChange={(value) => setValue("target_gender", value)}
              value={watch().target_gender || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um gênero" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.target_gender && (
              <p className="text-sm text-destructive">
                {errors.target_gender.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_age_range">Idade *</Label>
            <Select
              onValueChange={(value) => setValue("target_age_range", value)}
              value={watch().target_age_range || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma faixa etária" />
              </SelectTrigger>
              <SelectContent>
                {ageRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.target_age_range && (
              <p className="text-sm text-destructive">
                {errors.target_age_range.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_location">Localização *</Label>
          <Input
            id="target_location"
            placeholder="Ex: São Paulo, Brasil, região Sul..."
            {...register("target_location")}
          />

          {errors.target_location && (
            <p className="text-sm text-destructive">
              {errors.target_location.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_interests">Interesses</Label>
          <Textarea
            rows={3}
            id="target_interests"
            placeholder="Descreve os interesses, hobbies, problemas e comportamentos do seu público (ex: entusiastas de fitness, profissionais ocupados, consumidores conscientes)"
            {...register("target_interests")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisos serão as ideais
            geradas.{" "}
          </p>
          {errors.business_description && (
            <p className="text-sm text-destructive">
              {errors.business_description.message}
            </p>
          )}
        </div>
      </CardContent>
    </>
  );
};
