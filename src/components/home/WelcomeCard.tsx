import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export const WelcomeCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Principal</CardTitle>
        <CardDescription>Explore as funcionalidades do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Este é seu painel principal. Aqui você pode acessar todas as
          funcionalidades do sistema através do menu lateral.
        </p>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>✨ Funcionalidades disponíveis:</strong>
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Gerenciamento de perfil</li>
            <li>• Configurações de conta</li>
            <li>• Sistema de notificações coloridas</li>
            <li>• Interface responsiva</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
