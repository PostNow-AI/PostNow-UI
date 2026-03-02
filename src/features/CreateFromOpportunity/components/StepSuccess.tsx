import { CheckCircle2, ExternalLink, Plus, Download, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StepSuccessProps {
  onCreateAnother: () => void;
  generatedContent: string | null;
  generatedImageUrl: string | null;
}

export const StepSuccess = ({
  onCreateAnother,
  generatedContent,
  generatedImageUrl,
}: StepSuccessProps) => {
  const navigate = useNavigate();

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast.success("Conteudo copiado!");
    }
  };

  const handleDownloadImage = () => {
    if (generatedImageUrl) {
      window.open(generatedImageUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col items-center px-4 pb-8">
      {/* Success Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Post gerado com sucesso!
        </h2>
      </div>

      {/* Generated Image */}
      {generatedImageUrl && (
        <div className="w-full max-w-sm mb-4">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
            <img
              src={generatedImageUrl}
              alt="Post gerado"
              className="w-full h-full object-cover"
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-2 right-2"
              onClick={handleDownloadImage}
            >
              <Download className="w-4 h-4 mr-1" />
              Baixar
            </Button>
          </div>
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <Card className="w-full max-w-sm mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Legenda</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyContent}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copiar
              </Button>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {generatedContent}
            </p>
          </CardContent>
        </Card>
      )}

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
