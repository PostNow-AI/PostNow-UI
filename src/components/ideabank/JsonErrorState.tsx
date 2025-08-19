import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface JsonErrorStateProps {
  error: string;
  content: string;
  readOnly: boolean;
  onContentChange?: (newContent: string) => void;
  onTryFix: () => void;
  handleContentChange: (newContent: string) => void;
}

export const JsonErrorState = ({
  error,
  content,
  readOnly,
  onContentChange,
  onTryFix,
  handleContentChange,
}: JsonErrorStateProps) => {
  const handleCleanContent = () => {
    try {
      // Aplicar a mesma lógica de limpeza
      let cleanedContent = content.trim();

      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.substring(7);
      }
      if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent.substring(3);
      }
      if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.substring(0, cleanedContent.length - 3);
      }

      cleanedContent = cleanedContent.trim();
      cleanedContent = cleanedContent.replace(/'/g, '"');
      cleanedContent = cleanedContent.replace(/,\s*}/g, "}");
      cleanedContent = cleanedContent.replace(/,\s*]/g, "]");

      JSON.parse(cleanedContent);
      // This will be handled by the parent component
    } catch {
      // If it still fails, create an empty object
      if (onContentChange) {
        onContentChange("{}");
      }
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-600">
          Erro ao Analisar Conteúdo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            readOnly={readOnly}
            className="min-h-[200px] font-mono text-sm"
            placeholder="Conteúdo JSON inválido..."
          />
          {!readOnly && (
            <div className="flex gap-2">
              <Button onClick={onTryFix} variant="outline" size="sm">
                Tentar Analisar Novamente
              </Button>
              <Button
                onClick={() => {
                  handleCleanContent();
                }}
                variant="outline"
                size="sm"
              >
                Criar Estrutura Vazia
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
