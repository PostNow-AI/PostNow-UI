import { GoogleOAuthButton } from "@/components/GoogleOAuthButton";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { useLogin } from "@/hooks/useLogin";
import { Link } from "react-router-dom";

export function LoginPage() {
  const { form, isLoading, onSubmit, handleGoogleLogin } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Bem-vindo de Volta
          </CardTitle>
          <CardDescription className="text-gray-600">
            Entre na sua conta
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
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Digite sua senha"
              />
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ou continue com
                </span>
              </div>
            </div>

            <GoogleOAuthButton onClick={handleGoogleLogin} className="w-full">
              Continuar com Google
            </GoogleOAuthButton>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
