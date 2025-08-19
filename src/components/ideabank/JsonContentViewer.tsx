import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJsonParser } from "@/hooks/useJsonParser";
import { JsonEmptyState } from "./JsonEmptyState";
import { JsonErrorState } from "./JsonErrorState";
import { JsonFieldRenderer } from "./JsonFieldRenderer";

interface JsonContentViewerProps {
  content: string;
  readOnly?: boolean;
  onContentChange?: (newContent: string) => void;
}

export const JsonContentViewer = ({
  content,
  readOnly = true,
  onContentChange,
}: JsonContentViewerProps) => {
  const {
    parsedContent,
    error,
    translateKey,
    translateValue,
    handleFieldChange,
    handleStringFieldChange,
    handleArrayFieldChange,
    handleContentChange,
    createEmptyStructure,
    tryFixAndParse,
  } = useJsonParser(content, readOnly, onContentChange);

  // Se há erro, mostrar o estado de erro
  if (error) {
    return (
      <JsonErrorState
        error={error}
        content={content}
        readOnly={readOnly}
        onContentChange={onContentChange}
        onTryFix={tryFixAndParse}
        handleContentChange={handleContentChange}
      />
    );
  }

  // Se não há conteúdo, mostrar estado vazio
  if (!parsedContent || Object.keys(parsedContent).length === 0) {
    return (
      <JsonEmptyState
        readOnly={readOnly}
        onCreateEmpty={createEmptyStructure}
      />
    );
  }

  // Renderizar conteúdo normal
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Visualização do Conteúdo
            <Badge variant="secondary" className="text-xs">
              {readOnly ? "Somente Leitura" : "Editável"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(parsedContent).map(([key, value]) => (
            <JsonFieldRenderer
              key={key}
              path={[key]}
              value={value}
              depth={0}
              readOnly={readOnly}
              translateKey={translateKey}
              translateValue={translateValue}
              handleStringFieldChange={handleStringFieldChange}
              handleArrayFieldChange={handleArrayFieldChange}
              handleFieldChange={handleFieldChange}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
