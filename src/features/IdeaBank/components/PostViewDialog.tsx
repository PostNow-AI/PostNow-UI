import parse from "html-react-parser";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Image,
  Import,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
  Skeleton,
  Textarea,
} from "@/components/ui";
import { usePostViewDialog } from "@/features/IdeaBank/hooks";
import { type Post } from "@/features/IdeaBank/types";
import { ImageTextOverlay } from "./ImageTextOverlay";

interface PostViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export const PostViewDialog = ({
  isOpen,
  onClose,
  post,
}: PostViewDialogProps) => {
  const {
    currentIdea,
    isLoading,
    regeneratingIdea,
    generatingImage,
    downloadingImage,
    regeneratePrompt,
    imagePrompt,
    showTextOverlay,
    setRegeneratePrompt,
    setImagePrompt,
    handleCopyContent,
    handleRegenerateIdea,
    handleImageGeneration,
    handleDownloadImage,
    setShowTextOverlay,
  } = usePostViewDialog(post, isOpen);

  // Helper function to detect if content contains HTML
  const containsHTML = (content: string) => {
    const htmlRegex = /<[^>]*>/;
    return htmlRegex.test(content);
  };

  // Get the image text data with proper error handling
  const parseImageText = () => {
    try {
      if (!currentIdea?.image_text) {
        return {};
      }

      const imageTextString = currentIdea.image_text as unknown as string;

      // Check if it's already an object
      if (typeof imageTextString === "object") {
        return imageTextString;
      }

      // If it's a string, try to parse it
      if (typeof imageTextString === "string") {
        // Clean the string first - remove any trailing commas or malformed JSON
        const cleanedString = imageTextString
          .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
          .replace(/[\u0000-\u001f]+/g, "") // Remove control characters
          .trim();

        return JSON.parse(cleanedString);
      }

      return {};
    } catch (error) {
      console.error("Error parsing image text JSON:", error);
      console.log("Raw image_text data:", currentIdea?.image_text);

      // Enhanced fallback parsing for truncated JSON
      if (
        currentIdea?.image_text &&
        typeof currentIdea.image_text === "string"
      ) {
        const rawString = currentIdea.image_text as string;

        // Try to extract the complete feed_image_text object even from truncated JSON
        const feedImageTextMatch = rawString.match(
          /"feed_image_text":\s*(\{[\s\S]*?\})\s*(?:,|\}|$)/
        );

        if (feedImageTextMatch) {
          try {
            const feedImageTextStr = feedImageTextMatch[1];
            console.log("Extracted feed_image_text string:", feedImageTextStr);
            return { feed_image_text: JSON.parse(feedImageTextStr) };
          } catch (feedParseError) {
            console.error(
              "Failed to parse extracted feed_image_text:",
              feedParseError
            );
          }
        }

        // Alternative: try to find and extract individual components
        const titleMatch = rawString.match(
          /"title":\s*(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/
        );
        const subtitleMatch = rawString.match(
          /"subtitle":\s*(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/
        );
        const ctaMatch = rawString.match(
          /"cta":\s*(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/
        );

        if (titleMatch || subtitleMatch || ctaMatch) {
          const reconstructed: Record<string, unknown> = {};

          if (titleMatch) {
            try {
              reconstructed.title = JSON.parse(titleMatch[1]);
            } catch (e) {
              console.log("Title parse failed:", e);
            }
          }
          if (subtitleMatch) {
            try {
              reconstructed.subtitle = JSON.parse(subtitleMatch[1]);
            } catch (e) {
              console.log("Subtitle parse failed:", e);
            }
          }
          if (ctaMatch) {
            try {
              reconstructed.cta = JSON.parse(ctaMatch[1]);
            } catch (e) {
              console.log("CTA parse failed:", e);
            }
          }

          if (Object.keys(reconstructed).length > 0) {
            console.log("Reconstructed feed_image_text:", reconstructed);
            return { feed_image_text: reconstructed };
          }
        }
      }

      return {};
    }
  };

  const imageText = parseImageText();
  const imageTextData = imageText?.feed_image_text || {};

  console.log("Parsed Image Text Data:", imageTextData);
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col"
        style={{ width: "95vw", maxWidth: "1200px" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 ">
            Customize <span className="text-primary">sua ideia</span>
          </DialogTitle>{" "}
          <Separator className="absolute left-0 right-0 top-13 w-full" />
        </DialogHeader>
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Column */}
              <Card>
                <CardHeader>
                  <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="text-primary h-4 w-4" />
                        Aqui está sua ideia de texto!{" "}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Copie o texto abaixo e cole no seu Instagram ou gere um
                        novo!
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyContent}
                      disabled={!currentIdea?.content}
                      className="shrink-0 text-muted-foreground"
                    >
                      Copiar
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator />
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentIdea?.content ? (
                    <>
                      {containsHTML(currentIdea.content) ? (
                        <div className="min-h-[400px] p-4 border rounded-md bg-background overflow-auto">
                          <div className="prose prose-sm max-w-none text-foreground [&>h1]:text-xl [&>h2]:text-lg [&>h3]:text-base [&>h4]:text-sm [&>strong]:font-semibold [&>em]:italic [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>p]:mb-2 [&>br]:mb-2">
                            {parse(currentIdea.content)}
                          </div>
                        </div>
                      ) : (
                        <Textarea
                          value={currentIdea.content}
                          readOnly
                          className="min-h-[400px] bg-background! resize-none font-mono text-sm"
                          placeholder="Nenhum conteúdo disponível"
                        />
                      )}
                      <Button
                        onClick={handleRegenerateIdea}
                        disabled={regeneratingIdea || !currentIdea}
                        className="w-full"
                        variant={"outline"}
                      >
                        <RefreshCw
                          className={`h-4 w-4 mr-2 ${
                            regeneratingIdea ? "animate-spin" : ""
                          }`}
                        />
                        {regeneratingIdea
                          ? "Gerando novamente..."
                          : "Gerar texto novamente"}
                      </Button>
                    </>
                  ) : (
                    <div className="min-h-[400px] bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum conteúdo disponível</p>
                        <p className="text-sm mt-1">
                          O conteúdo pode ainda estar sendo gerado
                        </p>
                      </div>
                    </div>
                  )}
                  <Card className="bg-background">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="text-primary h-4 w-4" />
                        Edição de texto{" "}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Nos fale o que quer mudar no texto e nós fazemos para
                        você!{" "}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Textarea
                          value={regeneratePrompt}
                          onChange={(e) => setRegeneratePrompt(e.target.value)}
                          placeholder="Ex: Crie um título diferente"
                          className="min-h-[100px] resize-none"
                        />
                      </div>
                      <Button
                        onClick={handleRegenerateIdea}
                        disabled={regeneratingIdea || !currentIdea}
                        className="w-full"
                        variant={"outline"}
                      >
                        <Sparkles
                          className={`h-4 w-4 mr-2 ${
                            regeneratingIdea ? "animate-spin" : ""
                          }`}
                        />
                        {regeneratingIdea
                          ? "Gerando novamente..."
                          : "Editar texto"}
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Image Column */}
              <Card>
                <CardHeader>
                  <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Image className="text-primary h-4 w-4" />
                        Aqui está sua imagem!{" "}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {!currentIdea?.image_url
                          ? "Gere uma imagem para seu post e faça e faça o download."
                          : "Baixe sua imagem ou gere uma nova"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {currentIdea?.image_url &&
                        imageTextData &&
                        Object.keys(imageTextData).length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowTextOverlay(!showTextOverlay)}
                            className="shrink-0 text-muted-foreground"
                            title={
                              showTextOverlay
                                ? "Ocultar texto"
                                : "Mostrar texto"
                            }
                          >
                            {showTextOverlay ? (
                              <>
                                <EyeOff className="h-4 w-4" />
                                Ocultar texto
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4" />
                                Mostrar texto
                              </>
                            )}
                          </Button>
                        )}
                      {currentIdea?.image_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDownloadImage}
                          disabled={downloadingImage}
                          className="shrink-0 text-muted-foreground"
                          title="Tentar download direto. Se falhar, abrirá em nova aba."
                        >
                          {downloadingImage ? "Baixando..." : "Baixar"}
                          <Import className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Separator />
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentIdea?.image_url ? (
                    <div className="space-y-3">
                      {imageTextData &&
                      Object.keys(imageTextData).length > 0 &&
                      showTextOverlay ? (
                        <ImageTextOverlay
                          imageUrl={currentIdea.image_url}
                          imageTextData={imageTextData}
                          className="w-full object-cover rounded-md border transition-transform h-full"
                        />
                      ) : (
                        <img
                          src={currentIdea.image_url}
                          alt={`Imagem para ${post.name}`}
                          className="w-full object-cover rounded-md border transition-transform"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="min-h-[269px] border border-primary rounded-sm flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Image className="h-[67px] w-[67px] mx-auto mb-4 text-primary" />
                        <p className="font-semibold text-xl text-popover-foreground">
                          Gere uma imagem para seu post
                        </p>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={handleImageGeneration}
                    disabled={regeneratingIdea || !currentIdea}
                    className="w-full"
                    variant={currentIdea?.image_url ? "outline" : "default"}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        generatingImage ? "animate-spin" : ""
                      }`}
                    />
                    {generatingImage
                      ? "Gerando imagem..."
                      : currentIdea?.image_url
                      ? "Gerar imagem novamente"
                      : "Gerar imagem"}
                  </Button>
                  <Card className="bg-background">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Edição de imagem
                      </CardTitle>
                      <CardDescription>
                        Nos fale o que quer mudar na imagem e nós fazemos para
                        você!
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Textarea
                          value={imagePrompt}
                          disabled={!currentIdea?.image_url}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          placeholder="Ex: Altere a cor do fundo para azul"
                          className="min-h-[100px] resize-none"
                        />
                      </div>
                      <Button
                        onClick={handleImageGeneration}
                        disabled={generatingImage || !currentIdea}
                        className="w-full"
                        variant="outline"
                      >
                        <Sparkles
                          className={`h-4 w-4 mr-2 ${
                            generatingImage ? "animate-spin" : ""
                          }`}
                        />
                        {generatingImage
                          ? "Editando imagem..."
                          : "Editar imagem..."}
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        <Separator className="absolute left-0 right-0 bottom-17 w-full" />
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Salvar post <Check className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
