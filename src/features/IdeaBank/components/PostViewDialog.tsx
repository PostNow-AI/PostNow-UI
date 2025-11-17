/* eslint-disable no-control-regex */
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

  // Get the image text data with proper error handling - enhanced for robust parsing
  const parseImageText = (): Record<string, unknown> => {
    if (process.env.NODE_ENV === "development") {
      console.log("🎯 PostViewDialog - Parsing image text data");
      console.log("🔍 Raw currentIdea.image_text:", currentIdea?.image_text);
    }

    if (!currentIdea?.image_text) {
      console.log("❌ PostViewDialog - No image_text data");
      return {};
    }

    // Handle if it's already an object
    if (typeof currentIdea.image_text === "object") {
      console.log("✅ PostViewDialog - Data already parsed as object");
      return currentIdea.image_text as Record<string, unknown>;
    }

    // Handle string parsing with enhanced error recovery
    if (typeof currentIdea.image_text === "string") {
      const imageTextString = currentIdea.image_text as string;

      try {
        // Multi-layer JSON sanitization
        let cleanedString = imageTextString
          .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
          .replace(/[\x00-\x1f]+/g, "") // Remove control characters
          .replace(/}\s*{/g, "},{") // Fix concatenated objects
          .replace(/"\s*:\s*"/g, '":"') // Fix spaced colons
          .trim();

        // Remove any incomplete trailing structures
        const lastOpenBrace = cleanedString.lastIndexOf("{");
        const lastCloseBrace = cleanedString.lastIndexOf("}");
        if (lastOpenBrace > lastCloseBrace) {
          cleanedString = cleanedString.substring(0, lastOpenBrace).trim();
          if (cleanedString.endsWith(",")) {
            cleanedString = cleanedString.slice(0, -1);
          }
        }

        const parsed = JSON.parse(cleanedString);
        console.log("✅ PostViewDialog - Successfully parsed JSON");
        return parsed;
      } catch (parseError) {
        console.warn(
          "⚠️ PostViewDialog - Initial JSON parse failed, attempting recovery",
          parseError
        );

        // Enhanced fallback parsing for truncated JSON
        const rawString = imageTextString;

        // Try to extract the complete feed_image_text object
        const feedImageTextMatch = rawString.match(
          /"feed_image_text":\s*(\{[\s\S]*?\})\s*(?:,|\}|$)/
        );

        if (feedImageTextMatch) {
          try {
            const feedImageTextStr = feedImageTextMatch[1];
            console.log(
              "🔧 PostViewDialog - Extracted feed_image_text string:",
              feedImageTextStr
            );
            const parsed = { feed_image_text: JSON.parse(feedImageTextStr) };
            console.log(
              "✅ PostViewDialog - Successfully recovered feed_image_text"
            );
            return parsed;
          } catch (feedParseError) {
            console.error(
              "❌ PostViewDialog - Failed to parse extracted feed_image_text:",
              feedParseError
            );
          }
        }

        // Try to reconstruct from individual components
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
              console.log("🔧 PostViewDialog - Recovered title element");
            } catch (e) {
              console.warn("⚠️ PostViewDialog - Title parse failed:", e);
            }
          }
          if (subtitleMatch) {
            try {
              reconstructed.subtitle = JSON.parse(subtitleMatch[1]);
              console.log("🔧 PostViewDialog - Recovered subtitle element");
            } catch (e) {
              console.warn("⚠️ PostViewDialog - Subtitle parse failed:", e);
            }
          }
          if (ctaMatch) {
            try {
              reconstructed.cta = JSON.parse(ctaMatch[1]);
              console.log("🔧 PostViewDialog - Recovered CTA element");
            } catch (e) {
              console.warn("⚠️ PostViewDialog - CTA parse failed:", e);
            }
          }

          if (Object.keys(reconstructed).length > 0) {
            console.log(
              "✅ PostViewDialog - Successfully reconstructed feed_image_text from components"
            );
            return { feed_image_text: reconstructed };
          }
        }

        console.error("❌ PostViewDialog - All parsing methods failed");
        return {};
      }
    }

    console.log(
      "❌ PostViewDialog - Unexpected data type:",
      typeof currentIdea.image_text
    );
    return {};
  };

  const imageText = parseImageText();

  // Smart data extraction - handle both nested and direct structures
  let imageTextData = {};
  if (imageText?.feed_image_text) {
    // Nested structure: { feed_image_text: { layout_type, title, subtitle, cta } }
    imageTextData = imageText.feed_image_text;
  } else if (
    imageText?.layout_type ||
    imageText?.title ||
    imageText?.subtitle ||
    imageText?.cta
  ) {
    // Direct structure: { layout_type, title, subtitle, cta }
    imageTextData = imageText;
  }

  // Debug logging for data structure analysis
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 PostViewDialog - Parsed Image Text:", imageText);
    console.log(
      "🔍 PostViewDialog - Has feed_image_text nested?",
      !!imageText?.feed_image_text
    );
    console.log(
      "🔍 PostViewDialog - Has direct structure?",
      !!(
        imageText?.layout_type ||
        imageText?.title ||
        imageText?.subtitle ||
        imageText?.cta
      )
    );
    console.log(
      "🔍 PostViewDialog - Final imageTextData for overlay:",
      imageTextData
    );
    console.log(
      "🔍 PostViewDialog - imageTextData keys:",
      Object.keys(imageTextData || {})
    );
    console.log(
      "🔍 PostViewDialog - imageTextData type:",
      typeof imageTextData
    );
  }
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
                        <>
                          {/* Additional debugging before rendering */}
                          {process.env.NODE_ENV === "development" &&
                            console.log(
                              "🎯 About to render ImageTextOverlay with:",
                              {
                                imageUrl: currentIdea.image_url,
                                imageTextData,
                                dataType: typeof imageTextData,
                                dataKeys: Object.keys(imageTextData || {}),
                                showTextOverlay,
                              }
                            )}
                          <ImageTextOverlay
                            imageUrl={currentIdea.image_url}
                            imageTextData={imageTextData}
                            className="w-full object-cover rounded-md border transition-transform h-full"
                          />
                        </>
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
