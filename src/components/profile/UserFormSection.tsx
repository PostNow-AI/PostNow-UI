import { Button, Input, Label } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { type User } from "@/types/auth";
import { UseFormReturn } from "react-hook-form";

interface UserFormSectionProps {
  user: User | null;
  form: UseFormReturn<any>;
  isEditing: boolean;
  isSubmitting: boolean;
  onStartEditing: () => void;
  onCancel: () => void;
}

export const UserFormSection = ({
  user,
  form,
  isEditing,
  isSubmitting,
  onStartEditing,
  onCancel,
}: UserFormSectionProps) => {
  const { register, formState: { errors, isDirty } } = form;

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            {...register("first_name")}
            disabled={!isEditing}
            className={errors.first_name ? "border-destructive" : ""}
          />
          {errors.first_name && (
            <p className="text-sm text-destructive">
              {errors.first_name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            {...register("last_name")}
            disabled={!isEditing}
            className={errors.last_name ? "border-destructive" : ""}
          />
          {errors.last_name && (
            <p className="text-sm text-destructive">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user?.email || ""} readOnly />
        <p className="text-xs text-muted-foreground">
          O email não pode ser alterado
        </p>
      </div>

      <div className="flex gap-2">
        {!isEditing ? (
          <Button
            type="button"
            variant="outline"
            onClick={onStartEditing}
            className="flex-1"
          >
            Editar Informações
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </>
        )}
      </div>
    </form>
  );
}; 