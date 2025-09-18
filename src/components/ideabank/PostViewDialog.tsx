import {
  Copy,
  Download,
  Image,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Textarea,
} from "@/components/ui";
import { usePostIdeas } from "@/hooks";
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

      // Clear the prompt
      setRegeneratePrompt("");

      toast.success("Ideia regenerada!", {
        description: "O conteúdo do post foi atualizado com sucesso",
      });
    } catch (error) {
      console.error("Failed to regenerate idea:", error);
      toast.error("Erro ao regenerar ideia", {
        description: "Não foi possível regenerar o conteúdo do post",
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

      // Clear the prompt
      setImagePrompt("");

      const successMessage = hasImage ? "Imagem regenerada!" : "Imagem gerada!";
      const successDescription = hasImage
        ? "A imagem foi regenerada com sucesso"
        : "A imagem foi gerada com sucesso";

      toast.success(successMessage, {
        description: successDescription,
      });
    } catch (error) {
      console.error("Failed to generate/regenerate image:", error);
      const errorMessage = currentIdea.image_url
        ? "Erro ao regenerar imagem"
        : "Erro ao gerar imagem";
      const errorDescription = currentIdea.image_url
        ? "Não foi possível regenerar a imagem"
        : "Não foi possível gerar a imagem";

      toast.error(errorMessage, {
        description: errorDescription,
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
        className="max-h-[90vh] overflow-y-auto flex flex-col"
        style={{ width: "95vw", maxWidth: "1400px" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {post.name}
          </DialogTitle>
          <DialogDescription>
            Conteúdo gerado por IA • {post.objective_display} •{" "}
            {post.type_display}
          </DialogDescription>
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Column */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Conteúdo do Post
                    </CardTitle>
                    <CardDescription>
                      {currentIdea?.ai_provider} • {currentIdea?.ai_model}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyContent}
                    disabled={!currentIdea?.content}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </CardHeader>
                <CardContent>
                  {currentIdea?.content ? (
                    <Textarea
                      value={currentIdea.content}
                      readOnly
                      className="min-h-[400px] resize-none bg-muted/30 font-mono text-sm"
                      placeholder="Nenhum conteúdo disponível"
                    />
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
                </CardContent>
              </Card>

              {/* Image Column */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Imagem Gerada
                    </CardTitle>
                    <CardDescription>
                      Criada automaticamente pela IA
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadImage}
                    disabled={!currentIdea?.image_url || downloadingImage}
                    className="shrink-0"
                    title="Tentar download direto. Se falhar, abrirá em nova aba."
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingImage ? "Baixando..." : "Baixar"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {currentIdea?.image_url ? (
                    <div className="space-y-3">
                      <img
                        src={currentIdea.image_url}
                        alt={`Imagem para ${post.name}`}
                        className="w-full h-[400px] object-cover rounded-md border transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="min-h-[400px] bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma imagem disponível</p>
                        <p className="text-sm mt-1">
                          Este post foi criado sem imagem
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Regenerate Idea Card - Full width row */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Regenerar Conteúdo
                </CardTitle>
                <CardDescription>
                  Ajuste o conteúdo com instruções personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Instruções para regeneração (opcional)
                  </label>
                  <Textarea
                    value={regeneratePrompt}
                    onChange={(e) => setRegeneratePrompt(e.target.value)}
                    placeholder="Ex: Torne o texto mais formal, adicione mais detalhes sobre o produto, use um tom mais casual..."
                    className="min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco para regenerar com as configurações
                    originais do post
                  </p>
                </div>
                <Button
                  onClick={handleRegenerateIdea}
                  disabled={regeneratingIdea || !currentIdea}
                  className="w-full"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      regeneratingIdea ? "animate-spin" : ""
                    }`}
                  />
                  {regeneratingIdea
                    ? "Gerando novamente..."
                    : "Gerar novamente"}
                </Button>
              </CardContent>
            </Card>

            {/* Image Generation/Regeneration Card - Full width row */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {currentIdea?.image_url ? "Regenerar Imagem" : "Gerar Imagem"}
                </CardTitle>
                <CardDescription>
                  {currentIdea?.image_url
                    ? "Crie uma nova versão da imagem com instruções personalizadas"
                    : "Gere uma imagem para este post com instruções personalizadas"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Instruções para a imagem (opcional)
                  </label>
                  <Textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Ex: Uma foto mais colorida, com fundo azul, estilo minimalista, adicione elementos de tecnologia..."
                    className="min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco para{" "}
                    {currentIdea?.image_url ? "regenerar" : "gerar"} com base no
                    conteúdo do post
                  </p>
                </div>
                <Button
                  onClick={handleImageGeneration}
                  disabled={generatingImage || !currentIdea}
                  className="w-full"
                  variant="outline"
                >
                  <Sparkles
                    className={`h-4 w-4 mr-2 ${
                      generatingImage ? "animate-pulse" : ""
                    }`}
                  />
                  {generatingImage
                    ? currentIdea?.image_url
                      ? "Regenerando imagem..."
                      : "Gerando imagem..."
                    : currentIdea?.image_url
                    ? "Regenerar imagem"
                    : "Gerar imagem"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Post Details */}
        {currentIdea && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Informações do Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  <p>{currentIdea.status_display}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Criado em</p>
                  <p>
                    {new Date(currentIdea.created_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    IA Utilizada
                  </p>
                  <p>{currentIdea.ai_provider}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Modelo</p>
                  <p>{currentIdea.ai_model}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
