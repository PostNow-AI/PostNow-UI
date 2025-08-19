import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JsonEmptyStateProps {
  readOnly: boolean;
  onCreateEmpty: () => void;
}

export const JsonEmptyState = ({ readOnly, onCreateEmpty }: JsonEmptyStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Conteúdo
          <Badge variant="secondary" className="text-xs">
            Vazio
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Nenhum conteúdo para exibir
        </p>
        {!readOnly && (
          <Button onClick={onCreateEmpty} variant="outline" size="sm">
            Criar Estrutura Vazia
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
