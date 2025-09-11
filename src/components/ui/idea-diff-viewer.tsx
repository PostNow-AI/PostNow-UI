import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle } from "lucide-react";
import { JsonContentViewer } from "../ideabank/JsonContentViewer";

interface IdeaDiffViewerProps {
  originalIdea: {
    image_url: undefined;
    title?: string | null;
    description?: string | null;
    content?: string | null;
  };
  improvedIdea: {
    image_url: undefined;
    title?: string | null;
    description?: string | null;
    content?: string | null;
  };
  className?: string;
}

export const IdeaDiffViewer = ({
  originalIdea,
  improvedIdea,
  className,
}: IdeaDiffViewerProps) => {
  const hasChanges = (
    original: string | null | undefined,
    improved: string | null | undefined
  ) => {
    const originalStr = (original || "").trim();
    const improvedStr = (improved || "").trim();
    return originalStr !== improvedStr;
  };

  const ChangeIndicator = ({ changed }: { changed: boolean }) => (
    <div className="flex items-center gap-1">
      {changed ? (
        <>
          <ArrowRight className="h-3 w-3 text-blue-500" />
          <Badge variant="secondary" className="text-xs">
            Melhorado
          </Badge>
        </>
      ) : (
        <>
          <CheckCircle className="h-3 w-3 text-green-500" />
          <Badge variant="outline" className="text-xs">
            Mantido
          </Badge>
        </>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Comparação de Melhorias</h3>
        <p className="text-sm text-muted-foreground">
          Veja as diferenças entre a versão original e a melhorada pela IA
        </p>
      </div>

      {/* Title Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Título</CardTitle>
            <ChangeIndicator
              changed={hasChanges(originalIdea.title, improvedIdea.title)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <CardDescription className="font-medium text-muted-foreground">
                Original
              </CardDescription>
              <div className="p-3 bg-muted/50 rounded-md border">
                <p className="text-sm">{originalIdea.title || "Sem título"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <CardDescription className="font-medium text-blue-600 dark:text-blue-400">
                Melhorado
              </CardDescription>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                <p className="text-sm">{improvedIdea.title || "Sem título"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Descrição</CardTitle>
            <ChangeIndicator
              changed={hasChanges(
                originalIdea.description,
                improvedIdea.description
              )}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <CardDescription className="font-medium text-muted-foreground">
                Original
              </CardDescription>
              <div className="p-3 bg-muted/50 rounded-md border min-h-[100px]">
                <p className="text-sm whitespace-pre-wrap">
                  {originalIdea.description || "Sem descrição"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <CardDescription className="font-medium text-blue-600 dark:text-blue-400">
                Melhorado
              </CardDescription>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800 min-h-[100px]">
                <p className="text-sm whitespace-pre-wrap">
                  {improvedIdea.description || "Sem descrição"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Conteúdo</CardTitle>
            <ChangeIndicator
              changed={hasChanges(originalIdea.content, improvedIdea.content)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <CardDescription className="font-medium text-muted-foreground">
                Original
              </CardDescription>
              <div className="border border-muted rounded-lg overflow-hidden">
                {originalIdea.content ? (
                  <JsonContentViewer
                    image={originalIdea?.image_url || undefined}
                    content={originalIdea.content}
                    readOnly={true}
                  />
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Sem conteúdo estruturado
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <CardDescription className="font-medium text-blue-600 dark:text-blue-400">
                Melhorado
              </CardDescription>
              <div className="border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden bg-blue-50/50 dark:bg-blue-950/10">
                {improvedIdea.content ? (
                  <JsonContentViewer
                    image={improvedIdea.image_url || undefined}
                    content={improvedIdea.content}
                    readOnly={true}
                  />
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Sem conteúdo estruturado
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
