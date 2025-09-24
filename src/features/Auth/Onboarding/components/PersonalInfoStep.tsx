import {
  CardContent,
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
} from "@/components/ui";
import { phoneMask } from "@/utils";
import { User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormData } from "../constants/onboardingSchema";

export const PersonalInfoStep = ({
  form,
  professions,
}: {
  form: UseFormReturn<OnboardingFormData>;
  professions: string[];
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
          <User className="text-primary h-5 w-5" />
          Informações do usuário
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6 overflow-auto">
        <div className="space-y-2">
          <Label htmlFor="professional_name">Nome Profissional *</Label>
          <Input
            id="professional_name"
            placeholder="Ex: Dr. João Silva"
            {...register("professional_name")}
          />
          <span className="text-muted-foreground text-sm">
            Como as pessoas te chamam?
          </span>
          {errors.professional_name && (
            <p className="text-sm text-destructive">
              {errors.professional_name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="profession">Profissão *</Label>
          <Select
            onValueChange={(value) => setValue("profession", value)}
            value={watch().profession || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma profissão" />
            </SelectTrigger>
            <SelectContent>
              {professions.map((profession) => (
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
          <Label htmlFor="instagram_username">Instagram</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              @
            </span>
            <Input
              id="instagram_username"
              placeholder="seu_usuario"
              className="pl-8"
              {...register("instagram_username")}
            />
          </div>
          {errors.instagram_username && (
            <p className="text-sm text-destructive">
              {errors.instagram_username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp_number">WhatsApp *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              +55
            </span>
            <Input
              id="whatsapp_number"
              placeholder="(99) 99999-9999"
              className="pl-12"
              {...register("whatsapp_number", {
                onChange: (e) => {
                  const value = phoneMask(e.target.value);
                  setValue("whatsapp_number", value);
                },
              })}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Você receberá suas ideais de post por esse número{" "}
          </p>
          {errors.whatsapp_number && (
            <p className="text-sm text-destructive">
              {errors.whatsapp_number.message}
            </p>
          )}
        </div>
      </CardContent>
    </>
  );
};
