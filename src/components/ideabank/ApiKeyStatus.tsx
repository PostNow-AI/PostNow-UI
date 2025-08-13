import { Badge, Button } from "@/components/ui";
import { geminiKeyApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Key, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GeminiKeyOverlay } from "./GeminiKeyOverlay";

export const ApiKeyStatus = () => {
  const [showKeyOverlay, setShowKeyOverlay] = useState(false);
  const queryClient = useQueryClient();

  const { data: keyStatus, isLoading } = useQuery({
    queryKey: ["gemini-key-status"],
    queryFn: () => geminiKeyApi.getStatus(),
  });

  const deleteKeyMutation = useMutation({
    mutationFn: () => geminiKeyApi.deleteKey(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gemini-key-status"] });
      toast.success("Chave da API removida com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover chave da API");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-muted rounded animate-pulse" />
        <span className="text-sm text-muted-foreground">Verificando...</span>
      </div>
    );
  }

  if (keyStatus?.has_key) {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Key className="h-3 w-3" />
          API Configurada
        </Badge>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKeyOverlay(true)}
            className="h-8 px-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteKeyMutation.mutate()}
            className="h-8 px-2 text-destructive hover:text-destructive"
            disabled={deleteKeyMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {showKeyOverlay && (
          <GeminiKeyOverlay onClose={() => setShowKeyOverlay(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-destructive border-destructive">
        API Não Configurada
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowKeyOverlay(true)}
        className="h-8"
      >
        <Key className="h-4 w-4 mr-2" />
        Configurar
      </Button>

      {showKeyOverlay && (
        <GeminiKeyOverlay onClose={() => setShowKeyOverlay(false)} />
      )}
    </div>
  );
};
