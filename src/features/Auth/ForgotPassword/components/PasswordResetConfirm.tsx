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
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePasswordResetConfirm } from "../hooks";

export const PasswordResetConfirm = () => {
  const { form, isLoading, onSubmit, isValidParams } =
    usePasswordResetConfirm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isValidParams) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <BetaLogo />
            <CardTitle className="text-3xl font-bold">Link inválido</CardTitle>
            <CardDescription>
              O link de redefinição de senha é inválido ou expirou.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Solicitar novo link
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <BetaLogo />
          <CardTitle className="text-3xl font-bold">Redefinir senha</CardTitle>
          <CardDescription>Digite sua nova senha abaixo</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  {...register("newPassword")}
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Digite sua nova senha"
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-10.5 -translate-y-1/2 text-muted-foreground text-sm"
                >
                  {showNewPassword ? <EyeClosed /> : <Eye />}
                </Button>
                {errors.newPassword && (
                  <p className="text-destructive text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirme sua nova senha"
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-10.5 -translate-y-1/2 text-muted-foreground text-sm"
                >
                  {showConfirmPassword ? <EyeClosed /> : <Eye />}
                </Button>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader /> : "Redefinir senha"}
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
