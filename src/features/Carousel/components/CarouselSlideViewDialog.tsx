// @ts-nocheck
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Sparkles, Loader2 } from "lucide-react";
import { useCarouselSlideDialog } from "../hooks/useCarouselSlideDialog";

interface CarouselSlide {
  id: number;
  sequence_order: number;
  title: string;
  content: string;
  image_url: string;
  image_description: string;
  has_arrow: boolean;
  has_numbering: boolean;
}

interface CarouselSlideViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slide: CarouselSlide | null;
  totalSlides: number;
}

/**
 * Modal de visualização e edição de slide do carrossel
 * Permite baixar imagem e editar com IA
 */
export const CarouselSlideViewDialog = ({
  isOpen,
  onClose,
  slide,
  totalSlides,
}: CarouselSlideViewDialogProps) => {
  const {
    generatingImage,
    downloadingImage,
    imagePrompt,
    setImagePrompt,
    handleDownloadImage,
    handleImageGeneration,
  } = useCarouselSlideDialog(slide, isOpen);

  if (!slide) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col"
        style={{ width: "95vw", maxWidth: "1200px" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Customize <span className="text-primary">seu slide</span>
            <span className="text-sm text-gray-500 ml-auto">
              Slide {slide.sequence_order}/{totalSlides}
            </span>
          </DialogTitle>
          <Separator className="absolute left-0 right-0 top-13 w-full" />
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto flex-1 pt-4">
          {/* Coluna Esquerda - Texto */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  📝 Conteúdo do Slide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {slide.title && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                      Título
                    </label>
                    <p className="text-base font-bold">{slide.title}</p>
                  </div>
                )}
                
                {slide.content && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                      Conteúdo
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {slide.content}
                    </p>
                  </div>
                )}

                {slide.image_description && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                      Descrição da Imagem
                    </label>
                    <p className="text-sm text-gray-500 italic">
                      {slide.image_description}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 text-xs text-gray-500">
                  {slide.has_numbering && (
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      ✓ Numeração
                    </span>
                  )}
                  {slide.has_arrow && (
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      ✓ Seta →
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Imagem */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                {slide.image_url ? (
                  <div className="space-y-4">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full rounded-lg shadow-lg"
                      style={{ aspectRatio: "4/5" }}
                    />
                    <Button
                      onClick={handleDownloadImage}
                      disabled={downloadingImage}
                      variant="outline"
                      className="w-full"
                    >
                      {downloadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Baixando...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Baixar imagem
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Edição de imagem
                </CardTitle>
                <CardDescription>
                  Nos fale o que quer mudar na imagem e nós fazemos para você!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    value={imagePrompt}
                    disabled={!slide.image_url}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Ex: Altere a cor do fundo para azul claro"
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <Button
                  onClick={handleImageGeneration}
                  disabled={generatingImage || !slide.image_url || !imagePrompt.trim()}
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
          </div>
        </div>

        <Separator className="absolute left-0 right-0 bottom-17 w-full" />
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

