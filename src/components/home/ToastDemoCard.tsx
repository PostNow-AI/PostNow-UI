import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

interface ToastDemoCardProps {
  onShowSuccess: () => void;
  onShowError: () => void;
  onShowWarning: () => void;
  onShowInfo: () => void;
}

export const ToastDemoCard = ({
  onShowSuccess,
  onShowError,
  onShowWarning,
  onShowInfo,
}: ToastDemoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sistema de Notificações</CardTitle>
        <CardDescription>Teste os diferentes tipos de toast</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Experimente os diferentes tipos de notificações coloridas disponíveis
          no sistema:
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onShowSuccess}
            variant="outline"
            size="sm"
            className="text-green-700 border-green-200 hover:bg-green-50"
          >
            ✓ Sucesso
          </Button>
          <Button
            onClick={onShowError}
            variant="outline"
            size="sm"
            className="text-red-700 border-red-200 hover:bg-red-50"
          >
            ✗ Erro
          </Button>
          <Button
            onClick={onShowWarning}
            variant="outline"
            size="sm"
            className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
          >
            ⚠ Aviso
          </Button>
          <Button
            onClick={onShowInfo}
            variant="outline"
            size="sm"
            className="text-blue-700 border-blue-200 hover:bg-blue-50"
          >
            ℹ Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
