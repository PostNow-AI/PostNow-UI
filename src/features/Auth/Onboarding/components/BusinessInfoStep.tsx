import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Textarea,
} from "@/components";
import { phoneMask } from "@/utils";
import { Building } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { type OnboardingFormData } from "../constants/onboardingSchema";

export const BusinessInfoStep = ({
  form,
}: {
  form: UseFormReturn<OnboardingFormData>;
}) => {
  const {
    register,
    formState: { errors },
    setValue,
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
          <Label htmlFor="whatsapp_number">Telefone do negócio *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              +55
            </span>
            <Input
              id="whatsapp_number"
              placeholder="(99) 99999-9999"
              className="pl-12"
              {...register("business_phone", {
                onChange: (e) => {
                  const value = phoneMask(e.target.value);
                  setValue("business_phone", value);
                },
              })}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Beta: No futuro você poderá receber suas ideias de post por esse
            número{" "}
          </p>
          {errors.business_phone && (
            <p className="text-sm text-destructive">
              {errors.business_phone.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialization">Nicho/especialidade *</Label>
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
          <Label htmlFor="instagram_username">Instagram do negócio</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              @
            </span>
            <Input
              id="instagram_handle"
              placeholder="seu_usuario"
              className="pl-8"
              {...register("business_instagram_handle")}
            />
          </div>
          {errors.business_instagram_handle && (
            <p className="text-sm text-destructive">
              {errors.business_instagram_handle.message}
            </p>
          )}
        </div>{" "}
        <div className="space-y-2">
          <Label htmlFor="instagram_username">Website do negócio</Label>
          <div className="relative">
            <Input
              id="business_website"
              placeholder="https://www.seunegocio.com"
              {...register("business_website")}
            />
          </div>
          {errors.business_website && (
            <p className="text-sm text-destructive">
              {errors.business_website.message}
            </p>
          )}
        </div>{" "}
        <div className="space-y-2">
          <Label htmlFor="business_description">Descrição do Negócio *</Label>
          <Textarea
            rows={3}
            id="business_description"
            placeholder="Descreva o que seu negócio faz, o que o torna único."
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
        <div className="space-y-2">
          <Label htmlFor="business_purpose">Propósito do Negócio *</Label>
          <Textarea
            rows={3}
            id="business_purpose"
            placeholder="Descreva o propósito do seu negócio, seus valores e objetivos."
            {...register("business_purpose")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisos serão as ideais
            geradas.{" "}
          </p>
          {errors.business_purpose && (
            <p className="text-sm text-destructive">
              {errors.business_purpose.message}
            </p>
          )}
        </div>{" "}
        <div className="space-y-2">
          <Label htmlFor="brand_personality">Personalidade de marca *</Label>
          <Textarea
            rows={3}
            id="brand_personality"
            placeholder="Descreva a personalidade da sua marca, seu tom de voz e estilo."
            {...register("brand_personality")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisos serão as ideais
            geradas.{" "}
          </p>
          {errors.brand_personality && (
            <p className="text-sm text-destructive">
              {errors.brand_personality.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="products_services">Produtos/Serviços *</Label>
          <Textarea
            rows={3}
            id="products_services"
            placeholder="Descreva os produtos ou serviços que sua empresa oferece."
            {...register("products_services")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisos serão as ideais
            geradas.{" "}
          </p>
          {errors.products_services && (
            <p className="text-sm text-destructive">
              {errors.products_services.message}
            </p>
          )}
        </div>{" "}
        <div className="space-y-2">
          <Label htmlFor="business_location">Localização do Negócio *</Label>
          <Input
            id="business_location"
            placeholder="Descreva a localização do seu negócio."
            {...register("business_location")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisos serão as ideais
            geradas.{" "}
          </p>
          {errors.business_location && (
            <p className="text-sm text-destructive">
              {errors.business_location.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="main_competitors">Principais Concorrentes</Label>{" "}
          <Textarea
            rows={3}
            id="main_competitors"
            placeholder="Descreva os principais concorrentes da sua empresa."
            {...register("main_competitors")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisas serão as ideias
            geradas.{" "}
          </p>
          {errors.main_competitors && (
            <p className="text-sm text-destructive">
              {errors.main_competitors.message}
            </p>
          )}
        </div>{" "}
        <div className="space-y-2">
          <Label htmlFor="reference_profiles">Perfis de referência</Label>
          <Textarea
            rows={3}
            id="reference_profiles"
            placeholder="Descreva os perfis de referência da sua empresa."
            {...register("reference_profiles")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisas serão as ideias
            geradas.{" "}
          </p>
          {errors.reference_profiles && (
            <p className="text-sm text-destructive">
              {errors.reference_profiles.message}
            </p>
          )}
        </div>{" "}
        <CardTitle>Público-Alvo</CardTitle>
        <div className="space-y-2">
          <Label htmlFor="target_audience">Descrição *</Label>
          <Textarea
            rows={3}
            id="target_audience"
            placeholder="Descreva informações demográficas e psicográficas do seu público-alvo (ex: idade, gênero, localização, interesses, comportamentos de compra)"
            {...register("target_audience")}
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes fornecer, mais precisos serão as ideais
            geradas.{" "}
          </p>
          {errors.target_audience && (
            <p className="text-sm text-destructive">
              {errors.target_audience.message}
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
          {errors.target_interests && (
            <p className="text-sm text-destructive">
              {errors.target_interests.message}
            </p>
          )}
        </div>
      </CardContent>
    </>
  );
};
