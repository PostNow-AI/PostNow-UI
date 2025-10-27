import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  GoogleOAuthButton,
  Input,
  Label,
  Loader,
} from "@/components/ui";
import { BetaLogo } from "@/components/ui/beta-logo";
import { useLogin } from "@/hooks";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  const { form, isLoading, onSubmit, handleGoogleLogin } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md w-111">
        <CardHeader className="text-center">
          <BetaLogo />
          <CardTitle className="text-3xl font-bold">Faça seu login </CardTitle>
          <CardDescription>
            Digite seu email e senha para entrar em sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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

            <p className="w-full text-sm text-muted-foreground mt-2 text-right">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-light hover:text-primary/80 transition-colors"
              >
                Esqueci a senha
              </Link>
            </p>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader /> : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 space-y-6 ">
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
              onClick={handleGoogleLogin}
              className="mx-auto w-full"
            >
              Continuar com Google
            </GoogleOAuthButton>
          </div>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-light hover:text-primary/80 transition-colors"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
