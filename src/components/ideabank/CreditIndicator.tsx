import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserCredits } from "@/hooks/useCredits";
import { Coins } from "lucide-react";

interface CreditIndicatorProps {
  className?: string;
}

export const CreditIndicator = ({ className }: CreditIndicatorProps) => {
  const { data: userCredits, isLoading } = useUserCredits();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-2"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userCredits) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Coins className="h-4 w-4" />
          Saldo de Créditos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-lg font-bold">
            {userCredits.balance.toFixed(2)} créditos
          </Badge>
          <div className="text-xs text-muted-foreground">
            Última atualização:{" "}
            {new Date(userCredits.last_updated).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
