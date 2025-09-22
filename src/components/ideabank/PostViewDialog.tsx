import {
  ChevronRight,
  Copy,
  FileText,
  Image,
  Import,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  handleContentGenerationError,
  handleImageGenerationError,
} from "@/lib/utils/aiErrorHandling";

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
import { usePostIdeas } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { type Post } from "@/lib/services/postService";

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
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [regeneratingIdea, setRegeneratingIdea] = useState(false);
  const [regeneratePrompt, setRegeneratePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  const {
    data: ideas,
    isLoading,
    refetch,
  } = usePostIdeas(post?.id || 0, {
    enabled: !!post?.id && isOpen,
  });

  const currentIdea = ideas?.[0]; // Get the first (or only) idea

  const handleCopyContent = async () => {
    if (!currentIdea?.content) return;

    try {
      await navigator.clipboard.writeText(currentIdea.content);
      toast.success("Conteúdo copiado!", {
        description: "O texto do post foi copiado para a área de transferência",
      });
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Erro ao copiar", {
        description: "Não foi possível copiar o conteúdo",
      });
    }
  };

  const handleRegenerateIdea = async () => {
    if (!currentIdea?.id) return;

    setRegeneratingIdea(true);
    try {
      const { api } = await import("@/lib/api");

      await api.post(`/api/v1/ideabank/ideas/${currentIdea.id}/edit/`, {
        prompt: regeneratePrompt || "",
      });

      // Refetch the ideas to get updated content
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
      // Clear the prompt
      setRegeneratePrompt("");

      toast.success("Ideia regenerada!", {
        description: "O conteúdo do post foi atualizado com sucesso",
      });
    } catch (error) {
      console.error("Failed to regenerate idea:", error);

      // Use the new AI error handler for content regeneration
      const errorResult = handleContentGenerationError(error, "regenerate");

      toast.error(errorResult.title, {
        description: errorResult.description,
      });
    } finally {
      setRegeneratingIdea(false);
    }
  };

  const handleImageGeneration = async () => {
    if (!currentIdea?.id) return;

    setGeneratingImage(true);
    try {
      const { api } = await import("@/lib/api");

      const hasImage = !!currentIdea.image_url;
      const endpoint = hasImage
        ? `/api/v1/ideabank/ideas/${currentIdea.id}/regenerate-image/`
        : `/api/v1/ideabank/ideas/${currentIdea.id}/generate-image/`;

      await api.post(endpoint, {
        prompt: imagePrompt || "",
      });

      // Refetch the ideas to get updated image
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
      // Clear the prompt
      setImagePrompt("");

      const successMessage = hasImage ? "Imagem regenerada!" : "Imagem gerada!";
      const successDescription = hasImage
        ? "A imagem foi regenerada com sucesso"
        : "A imagem foi gerada com sucesso";

      toast.success(successMessage, {
        description: successDescription,
      });
    } catch (error: unknown) {
      console.error("Failed to generate/regenerate image:", error);

      // Use the new AI error handler for image generation
      const isRegeneration = !!currentIdea.image_url;
      const errorResult = handleImageGenerationError(error, isRegeneration);

      toast.error(errorResult.title, {
        description: errorResult.description,
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!currentIdea?.image_url) return;

    setDownloadingImage(true);
    try {
      // Try to fetch with no-cors mode first
      let response;
      try {
        response = await fetch(currentIdea.image_url, {
          mode: "cors",
          headers: {
            Accept: "image/*",
          },
        });
      } catch (corsError) {
        console.log("CORS failed, trying alternative approach:", corsError);
        // If CORS fails, use a different approach
        await downloadImageFallback(
          currentIdea.image_url,
          `${post?.name || "post"}-image`
        );
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${post?.name || "post"}-image.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Imagem baixada!", {
        description: "A imagem foi salva em seus downloads",
      });
    } catch (error) {
      console.error("Failed to download image:", error);

      // Fallback: open image in new tab
      toast.error("Download direto falhou", {
        description: "Abrindo imagem em nova aba para download manual",
      });

      window.open(currentIdea.image_url, "_blank");
    } finally {
      setDownloadingImage(false);
    }
  };

  const downloadImageFallback = async (imageUrl: string, filename: string) => {
    try {
      // Create a canvas to download the image
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";

      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Canvas context not available"));
              return;
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error("Failed to create blob"));
                return;
              }

              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${filename}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);

              toast.success("Imagem baixada!", {
                description: "A imagem foi salva em seus downloads",
              });
              resolve();
            }, "image/png");
          } catch (canvasError) {
            reject(canvasError);
          }
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = imageUrl;
      });
    } catch (error) {
      console.error("Canvas fallback failed:", error);
      // Final fallback: just open in new tab
      window.open(imageUrl, "_blank");
      toast.info("Download indireto", {
        description:
          "Imagem aberta em nova aba. Use 'Salvar como' do navegador",
      });
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col"
        style={{ width: "95vw", maxWidth: "1400px" }}
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
                      <Textarea
                        value={currentIdea.content}
                        readOnly
                        className="min-h-[400px] resize-none font-mono text-sm"
                        placeholder="Nenhum conteúdo disponível"
                      />
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
                  <Card>
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
                  <Separator />
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentIdea?.image_url ? (
                    <div className="space-y-3">
                      <img
                        src={currentIdea.image_url}
                        alt={`Imagem para ${post.name}`}
                        className="w-full  object-cover rounded-md border transition-transform"
                      />
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
                    <Sparkles
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
                  <Card>
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
            Finalizar post <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
