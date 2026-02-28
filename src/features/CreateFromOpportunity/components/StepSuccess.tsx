import { CheckCircle2, ExternalLink, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StepSuccessProps {
  onCreateAnother: () => void;
}

export const StepSuccess = ({ onCreateAnother }: StepSuccessProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
      </div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        Post gerado com sucesso!
      </h2>
      <p className="text-muted-foreground text-center mb-8 max-w-sm">
        Seu post foi criado e adicionado a sua biblioteca de conteudo.
      </p>

      {/* Info Card */}
      <Card className="w-full max-w-sm mb-8">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Acesse a <strong>Biblioteca de Posts</strong> para visualizar, editar ou baixar seu novo conteudo.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        <Button
          onClick={() => navigate("/ideabank")}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          Ver na Biblioteca
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>

        <Button
          variant="outline"
          onClick={onCreateAnother}
          className="w-full h-12"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Outro Post
        </Button>
      </div>
    </div>
  );
};
