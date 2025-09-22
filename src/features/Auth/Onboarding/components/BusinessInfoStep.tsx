import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@/components";
import { Label } from "@radix-ui/react-label";
import { Building2, Loader } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormData } from "../types";

export const BusinessInfoStep = ({
  form,
  isLoadingSpecializations,
  availableSpecializations,
}: {
  form: UseFormReturn<OnboardingFormData>;
  isLoadingSpecializations: boolean;
  availableSpecializations: { id: number; name: string }[];
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const watchedValues = watch();

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
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
          <Label htmlFor="business_website">Site</Label>
          <Input
            id="business_website"
            placeholder="Ex: https://seusite.com.br"
            {...register("business_website")}
          />
          {errors.business_website && (
            <p className="text-sm text-destructive">
              {errors.business_website.message}
            </p>
          )}
        </div>
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
          <Label htmlFor="specialization">Setor/Nicho *</Label>
          {isLoadingSpecializations ? (
            <Loader />
          ) : (
            <Select
              onValueChange={(value) => setValue("specialization", value)}
              value={watchedValues.specialization || ""}
              disabled={!watchedValues.profession}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o nicho de negócio" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecializations.map(
                  (specialization: { id: number; name: string }) => (
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
          )}
          {errors.specialization && (
            <p className="text-sm text-destructive">
              {errors.specialization.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_instagram">Instagram do Negócio</Label>
          <Input
            id="business_instagram"
            placeholder="@seu_negocio"
            {...register("business_instagram")}
          />
          {errors.business_instagram && (
            <p className="text-sm text-destructive">
              {errors.business_instagram.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_location">Localização do negócio * </Label>
          <Input
            id="business_location"
            placeholder="Ex: Brasília/DF"
            {...register("business_location")}
          />
          {errors.business_location && (
            <p className="text-sm text-destructive">
              {errors.business_location.message}
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
      </CardContent>
    </>
  );
};
