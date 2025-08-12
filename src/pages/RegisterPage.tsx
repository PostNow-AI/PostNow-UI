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
  ThemeToggle,
} from "@/components/ui";
import { useRegister } from "@/hooks/useRegister";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const { form, isLoading, onSubmit, handleGoogleRegister } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>
          <CardDescription>Cadastre-se para começar</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  {...register("firstName")}
                  type="text"
                  id="firstName"
                  placeholder="Seu nome"
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  {...register("lastName")}
                  type="text"
                  id="lastName"
                  placeholder="Seu sobrenome"
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                {...register("username")}
                type="text"
                id="username"
                placeholder="Escolha um nome de usuário"
              />
              {errors.username && (
                <p className="text-destructive text-sm">
                  {errors.username.message}
                </p>
              )}
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

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Digite sua senha"
              />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                {...register("confirmPassword")}
                type="password"
                id="confirmPassword"
                placeholder="Confirme sua senha"
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Criando Conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
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

          <div className="mt-8 space-y-4">
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Ou experimente
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Quer gerar ideias sem criar conta?
              </p>
              <Link
                to="/public/ideas"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Gerador Público de Ideias
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
