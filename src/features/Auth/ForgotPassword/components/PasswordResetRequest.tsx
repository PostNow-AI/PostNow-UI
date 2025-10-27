import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Loader,
} from "@/components/ui";
import { BetaLogo } from "@/components/ui/beta-logo";
import { Link } from "react-router-dom";
import { usePasswordResetRequest } from "../hooks";

export const PasswordResetRequest = () => {
  const { form, isLoading, onSubmit } = usePasswordResetRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <BetaLogo />
          <CardTitle className="text-3xl font-bold">
            Esqueci minha senha
          </CardTitle>
          <CardDescription>
            Digite seu email para receber instruções de redefinição de senha
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Endereço de Email</Label>
              <Input
                {...register("email")}
                type="email"
                id="email"
                placeholder="Digite seu email"
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader /> : "Enviar instruções"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Lembrou sua senha?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Voltar ao login
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
