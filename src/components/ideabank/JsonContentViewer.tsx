import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface JsonContentViewerProps {
  content: string;
  readOnly?: boolean;
  onContentChange?: (newContent: string) => void;
}

// Mapeamento de tradução para chaves JSON
const KEY_TRANSLATIONS: Record<string, string> = {
  // Campos principais
  headline: "Título Principal",
  copy: "Texto do Conteúdo",
  cta: "Chamada para Ação",
  hashtags: "Hashtags",
  visual_description: "Descrição Visual",
  color_composition: "Composição de Cores",

  // Campos de campanha
  plataforma: "Plataforma",
  tipo_conteudo: "Tipo de Conteúdo",
  titulo_principal: "Título Principal",
  variacao_a: "Variação A",
  variacao_b: "Variação B",
  variacao_c: "Variação C",
  estrategia_implementacao: "Estratégia de Implementação",
  metricas_sucesso: "Métricas de Sucesso",
  proximos_passos: "Próximos Passos",

  // Campos de persona
  persona_age: "Faixa Etária",
  persona_location: "Localização",
  persona_income: "Faixa de Renda",
  persona_interests: "Interesses",
  persona_behavior: "Comportamento",
  persona_pain_points: "Pontos de Dor",

  // Campos de campanha
  objectives: "Objetivos",
  platforms: "Plataformas",
  content_types: "Tipos de Conteúdo",
  voice_tone: "Tom de Voz",
  product_description: "Descrição do Produto",
  value_proposition: "Proposta de Valor",
  campaign_urgency: "Urgência da Campanha",

  // Campos de ideia
  title: "Título",
  description: "Descrição",
  content: "Conteúdo",
  platform: "Plataforma",
  content_type: "Tipo de Conteúdo",
  variation_type: "Tipo de Variação",
  status: "Status",

  // Campos de usuário
  user: "Usuário",
  email: "E-mail",
  first_name: "Nome",
  last_name: "Sobrenome",

  // Campos de tempo
  created_at: "Criado em",
  updated_at: "Atualizado em",
  generated_at: "Gerado em",
};

// Função para traduzir chaves
const translateKey = (key: string): string => {
  return KEY_TRANSLATIONS[key] || key;
};

export const JsonContentViewer = ({
  content,
  readOnly = true,
  onContentChange,
}: JsonContentViewerProps) => {
  const [parsedContent, setParsedContent] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse JSON content
  const parseContent = () => {
    try {
      // Se o conteúdo estiver vazio, criar um objeto vazio
      if (!content || content.trim() === "") {
        setParsedContent({});
        setError(null);
        return;
      }

      const parsed = JSON.parse(content);
      setParsedContent(parsed);
      setError(null);
    } catch {
      setError("Erro ao analisar JSON");
      setParsedContent(null);
    }
  };

  // Parse content on mount and when content changes
  useEffect(() => {
    parseContent();
  }, [content]);

  // Handle field changes
  const handleFieldChange = (path: string[], value: string | string[]) => {
    if (!parsedContent || readOnly) return;

    const newContent = { ...parsedContent };
    let current = newContent as Record<string, unknown>;

    // Navigate to the nested field
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current) || typeof current[path[i]] !== "object") {
        current[path[i]] = {};
      }
      current = current[path[i]] as Record<string, unknown>;
    }

    // Set the value
    current[path[path.length - 1]] = value;

    // Update content
    const newContentString = JSON.stringify(newContent, null, 2);
    if (onContentChange) {
      onContentChange(newContentString);
    }
    setParsedContent(newContent);
  };

  // Render field based on type
  const renderField = (
    path: string[],
    key: string,
    value: unknown,
    depth: number
  ) => {
    const indent = depth * 20;
    const translatedKey = translateKey(key);
    const isEmpty =
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (typeof value === "string") {
      const isLong = value.length > 100;

      if (isLong) {
        return (
          <div key={path.join(".")} style={{ marginLeft: indent }}>
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
              {translatedKey}
              {isEmpty && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Vazio
                </Badge>
              )}
            </Label>
            <Textarea
              value={value}
              onChange={(e) => handleFieldChange(path, e.target.value)}
              readOnly={readOnly}
              className="min-h-[100px]"
              placeholder={`Digite o valor para ${translatedKey}...`}
            />
          </div>
        );
      } else {
        return (
          <div key={path.join(".")} style={{ marginLeft: indent }}>
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
              {translatedKey}
              {isEmpty && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Vazio
                </Badge>
              )}
            </Label>
            <Input
              value={value}
              onChange={(e) => handleFieldChange(path, e.target.value)}
              readOnly={readOnly}
              placeholder={`Digite o valor para ${translatedKey}...`}
            />
          </div>
        );
      }
    } else if (Array.isArray(value)) {
      return (
        <div key={path.join(".")} style={{ marginLeft: indent }}>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            {translatedKey}{" "}
            <Badge variant="secondary" className="ml-2">
              Lista
            </Badge>
            {isEmpty && (
              <Badge variant="outline" className="ml-2 text-xs">
                Vazio
              </Badge>
            )}
          </Label>
          <Textarea
            value={value.join("\n")}
            onChange={(e) =>
              handleFieldChange(
                path,
                e.target.value.split("\n").filter((item) => item.trim())
              )
            }
            readOnly={readOnly}
            className="min-h-[80px]"
            placeholder={`Digite os valores para ${translatedKey}, um por linha...`}
          />
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <div key={path.join(".")} style={{ marginLeft: indent }}>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            {translatedKey}{" "}
            <Badge variant="outline" className="ml-2">
              Objeto
            </Badge>
            {isEmpty && (
              <Badge variant="outline" className="ml-2 text-xs">
                Vazio
              </Badge>
            )}
          </Label>
          <div className="border-l-2 border-muted pl-4 space-y-4">
            {Object.entries(value as Record<string, unknown>).map(
              ([subKey, subValue]) =>
                renderField([...path, subKey], subKey, subValue, depth + 1)
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div key={path.join(".")} style={{ marginLeft: indent }}>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            {translatedKey}
            {isEmpty && (
              <Badge variant="outline" className="ml-2 text-xs">
                Vazio
              </Badge>
            )}
          </Label>
          <Input
            value={String(value)}
            onChange={(e) => handleFieldChange(path, e.target.value)}
            readOnly={readOnly}
            placeholder={`Digite o valor para ${translatedKey}...`}
          />
        </div>
      );
    }
  };

  // Se há erro, mostrar o conteúdo raw e opção de corrigir
  if (error) {
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
              onChange={(e) => {
                if (onContentChange) {
                  onContentChange(e.target.value);
                }
              }}
              readOnly={readOnly}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Conteúdo JSON inválido..."
            />
            {!readOnly && (
              <div className="flex gap-2">
                <Button
                  onClick={() => parseContent()}
                  variant="outline"
                  size="sm"
                >
                  Tentar Analisar Novamente
                </Button>
                <Button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(content);
                      setParsedContent(parsed);
                      setError(null);
                    } catch {
                      // Se ainda falhar, criar um objeto vazio
                      setParsedContent({});
                      setError(null);
                    }
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
  }

  // Se não há conteúdo, mostrar mensagem
  if (!parsedContent || Object.keys(parsedContent).length === 0) {
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
            <Button
              onClick={() => {
                const emptyContent = "{}";
                if (onContentChange) {
                  onContentChange(emptyContent);
                }
                setParsedContent({});
              }}
              variant="outline"
              size="sm"
            >
              Criar Estrutura Vazia
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

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
          {Object.entries(parsedContent).map(([key, value]) =>
            renderField([key], key, value, 0)
          )}
        </CardContent>
      </Card>
    </div>
  );
};
