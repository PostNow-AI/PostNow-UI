import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  ThemeToggle,
} from "@/components/ui";
import { Loader } from "@/components/ui/loader";
import { GoogleOAuthButton } from "@/features/Auth/Login/components/GoogleOAuthButton";
import { useRegister } from "@/features/Auth/Register/hooks/useRegister";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
  const { form, isLoading, onSubmit, handleGoogleRegister } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 bg-primary-foreground from-background to-muted">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {" "}
          <img src="Logo-sonoria.svg" alt="Logo" className="mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>
          <CardDescription>Cadastre-se para começar</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  {...register("first_name")}
                  type="text"
                  id="first_name"
                  placeholder="Seu nome"
                />
                {errors.first_name && (
                  <p className="text-destructive text-sm">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  {...register("last_name")}
                  type="text"
                  id="last_name"
                  placeholder="Seu sobrenome"
                />
                {errors.last_name && (
                  <p className="text-destructive text-sm">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

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

            <div className="relative">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Digite sua senha"
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-10 -translate-y-1/2 text-muted-foreground text-sm"
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </Button>
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="space-y-2">
                <Label htmlFor="password">Confirmar senha</Label>
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-10 -translate-y-1/2 text-muted-foreground text-sm"
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
              {isLoading ? <Loader /> : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <GoogleOAuthButton
              onClick={handleGoogleRegister}
              className="w-full"
            >
              Continuar com Google
            </GoogleOAuthButton>
          </div>

          <div className="mt-6 space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Entre aqui
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
