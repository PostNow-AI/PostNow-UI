// @ts-nocheck
/**
 * Ações em massa para posts selecionados.
 * Permite aprovar/rejeitar/regenerar múltiplos posts de uma vez.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw, Trash2 } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onRegenerateAll: () => void;
  onDeleteAll: () => void;
  isLoading?: boolean;
}

export const BulkActions = ({
  selectedCount,
  onApproveAll,
  onRejectAll,
  onRegenerateAll,
  onDeleteAll,
  isLoading = false,
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">
              {selectedCount} {selectedCount === 1 ? "post selecionado" : "posts selecionados"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onApproveAll}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
              aria-label={`Aprovar ${selectedCount} posts selecionados`}
            >
              <Check className="h-4 w-4 mr-2" />
              Aprovar {selectedCount}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onRegenerateAll}
              disabled={isLoading}
              aria-label={`Regenerar ${selectedCount} posts selecionados`}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Regenerar
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onRejectAll}
              disabled={isLoading}
              aria-label={`Rejeitar ${selectedCount} posts selecionados`}
            >
              <X className="h-4 w-4 mr-2" />
              Rejeitar
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={onDeleteAll}
              disabled={isLoading}
              aria-label={`Deletar ${selectedCount} posts selecionados`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Deletar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

