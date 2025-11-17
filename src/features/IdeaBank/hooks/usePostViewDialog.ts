import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ideaBankService } from "../services";
import type { ImageTextData, ImageTextElement, Post } from "../types";
import { extractTextElements, isNewStructure } from "../utils";

// Hook for PostViewDialog
export const usePostViewDialog = (post: Post | null, isOpen: boolean) => {
  const [regeneratingIdea, setRegeneratingIdea] = useState(false);
  const [regeneratePrompt, setRegeneratePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [showTextOverlay, setShowTextOverlay] = useState(true);

  const queryClient = useQueryClient();

  const {
    data: ideas,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["post-ideas", post?.id],
    queryFn: async () => {
      if (!post?.id) return [];
      const response = await ideaBankService.getPostIdeas(post.id);
      return response;
    },
    enabled: !!post?.id && isOpen,
  });

  const currentIdea = ideas?.[0];

  const handleCopyContent = async () => {
    if (!currentIdea?.content) return;

    try {
      // Strip HTML tags from content before copying
      const strippedContent = currentIdea.content
        .replace(/<[^>]*>/g, "")
        .trim();
      await navigator.clipboard.writeText(strippedContent);
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
      await ideaBankService.editPostIdea(currentIdea.id, {
        content: currentIdea.content,
        improvement_prompt: regeneratePrompt,
      });

      await refetch();
      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      setRegeneratePrompt("");

      toast.success("Ideia regenerada!", {
        description: "O conteúdo do post foi atualizado com sucesso",
      });
    } catch (error) {
      console.error("Failed to regenerate idea:", error);
      toast.error("Erro ao regenerar ideia", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setRegeneratingIdea(false);
    }
  };

  const handleImageGeneration = async () => {
    if (!currentIdea?.id) return;

    setGeneratingImage(true);
    try {
      const hasImage = !!currentIdea.image_url;
      if (hasImage) {
        await ideaBankService.regenerateImageForIdea(currentIdea.id, {
          prompt: imagePrompt,
        });
      } else {
        await ideaBankService.generateImageForIdea(currentIdea.id, {
          prompt: imagePrompt,
        });
      }

      await refetch();
      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
      setImagePrompt("");

      const successMessage = hasImage ? "Imagem regenerada!" : "Imagem gerada!";
      toast.success(successMessage, {
        description: hasImage
          ? "A imagem foi regenerada com sucesso"
          : "A imagem foi gerada com sucesso",
      });
    } catch (error) {
      console.error("Failed to generate/regenerate image:", error);
      toast.error("Erro na geração da imagem", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!currentIdea?.image_url) return;

    setDownloadingImage(true);

    // Check if we can use direct download (requires CORS)
    const canUseDirectDownload = await checkCorsSupport(currentIdea.image_url);

    if (!canUseDirectDownload) {
      // CORS not supported - inform user and open in new tab
      toast.error("Download direto não disponível", {
        description:
          "Abrindo imagem em nova aba. Clique com botão direito para salvar.",
      });
      window.open(currentIdea.image_url, "_blank");
      setDownloadingImage(false);
      return;
    }

    try {
      let downloadUrl: string;
      let filename = `${post?.name || "post"}-image.png`;

      if (!showTextOverlay || !currentIdea.image_text) {
        // Simple case: download original image
        downloadUrl = currentIdea.image_url;
      } else {
        // Complex case: generate composite image with text overlays
        try {
          downloadUrl = await generateCompositeImage(
            currentIdea.image_url,
            currentIdea?.image_text
              ? JSON.parse(currentIdea?.image_text as unknown as string)
                  ?.feed_image_text
              : undefined
          );
          filename = `${post?.name || "post"}-with-text.png`;
        } catch {
          // If text overlay fails due to CORS, fall back to original
          toast.error("Overlay de texto não disponível", {
            description: "Baixando imagem original...",
          });
          downloadUrl = currentIdea.image_url;
          filename = `${post?.name || "post"}-original.png`;
        }
      }

      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Clean up generated blob URL if it was created
      if (downloadUrl !== currentIdea.image_url) {
        URL.revokeObjectURL(downloadUrl);
      }

      toast.success("Imagem baixada!", {
        description: "A imagem foi salva em seus downloads",
      });
    } catch (error) {
      console.error("Failed to download image:", error);
      toast.error("Download falhou", {
        description: "Abrindo imagem em nova aba para download manual",
      });
      window.open(currentIdea.image_url, "_blank");
    } finally {
      setDownloadingImage(false);
    }
  };

  // Check if CORS is supported for the given URL
  const checkCorsSupport = async (imageUrl: string): Promise<boolean> => {
    try {
      const response = await fetch(imageUrl, {
        method: "HEAD",
        mode: "cors",
      });
      return response.ok;
    } catch {
      // CORS error or network error
      return false;
    }
  };

  // Generate composite image with text overlays using canvas
  const generateCompositeImage = async (
    imageUrl: string,
    imageTextData: ImageTextData
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous"; // Enable CORS

      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Advanced text rendering with proper font and styling
          const drawText = (element: ImageTextElement, defaultY: number) => {
            if (!element?.text) return;

            ctx.save();

            // Extract font family (default to Inter if not specified)
            let fontFamily = "Inter";
            if (element.style?.["font-family"]) {
              const cleanFont = element.style["font-family"].replace(
                /['"]/g,
                ""
              );
              if (cleanFont.includes("Montserrat")) fontFamily = "Montserrat";
              else if (cleanFont.includes("Roboto")) fontFamily = "Roboto";
              else if (cleanFont.includes("Open Sans"))
                fontFamily = "Open Sans";
              else if (cleanFont.includes("Lato")) fontFamily = "Lato";
              else if (cleanFont.includes("Poppins")) fontFamily = "Poppins";
              else if (cleanFont.includes("Nunito")) fontFamily = "Nunito";
              else if (cleanFont.includes("Raleway")) fontFamily = "Raleway";
              else if (cleanFont.includes("Ubuntu")) fontFamily = "Ubuntu";
              else if (cleanFont.includes("Work Sans"))
                fontFamily = "Work Sans";
              else if (cleanFont.includes("Playfair Display"))
                fontFamily = "Playfair Display";
              else if (cleanFont.includes("Merriweather"))
                fontFamily = "Merriweather";
              else if (cleanFont.includes("Oswald")) fontFamily = "Oswald";
              else if (cleanFont.includes("Anton")) fontFamily = "Anton";
              else if (cleanFont.includes("Bebas Neue"))
                fontFamily = "Bebas Neue";
              else if (cleanFont.includes("Dancing Script"))
                fontFamily = "Dancing Script";
              else if (cleanFont.includes("Lobster")) fontFamily = "Lobster";
              else if (cleanFont.includes("Pacifico")) fontFamily = "Pacifico";
              else if (cleanFont.includes("Comfortaa"))
                fontFamily = "Comfortaa";
              else if (cleanFont.includes("Righteous"))
                fontFamily = "Righteous";
              else if (cleanFont.includes("Abril Fatface"))
                fontFamily = "Abril Fatface";
              else if (cleanFont.includes("Quicksand"))
                fontFamily = "Quicksand";
              else if (cleanFont.includes("Crimson Text"))
                fontFamily = "Crimson Text";
              else if (cleanFont.includes("Libre Baskerville"))
                fontFamily = "Libre Baskerville";
              else if (cleanFont.includes("Cormorant Garamond"))
                fontFamily = "Cormorant Garamond";
              else if (cleanFont.includes("Fredoka One"))
                fontFamily = "Fredoka One";
              else if (cleanFont.includes("Source Sans Pro"))
                fontFamily = "Source Sans Pro";
              else if (cleanFont.includes("PT Sans")) fontFamily = "PT Sans";
              else if (cleanFont.includes("Noto Sans"))
                fontFamily = "Noto Sans";
              else if (cleanFont.includes("Roboto Condensed"))
                fontFamily = "Roboto Condensed";
            }

            // Extract font size (default to 32px)
            let fontSize = 32;
            if (element.style?.font_size) {
              const sizeMatch =
                element.style.font_size.match(/(\d+(?:\.\d+)?)/);
              if (sizeMatch) fontSize = parseInt(sizeMatch[1]);
            }

            // Extract font weight (default to bold)
            let fontWeight = "bold";
            if (element.style?.font_weight) {
              const weight = element.style.font_weight;
              if (weight.includes("100") || weight.includes("thin"))
                fontWeight = "100";
              else if (weight.includes("200") || weight.includes("extra-light"))
                fontWeight = "200";
              else if (weight.includes("300") || weight.includes("light"))
                fontWeight = "300";
              else if (weight.includes("400") || weight.includes("normal"))
                fontWeight = "400";
              else if (weight.includes("500") || weight.includes("medium"))
                fontWeight = "500";
              else if (weight.includes("600") || weight.includes("semi-bold"))
                fontWeight = "600";
              else if (weight.includes("700") || weight.includes("bold"))
                fontWeight = "700";
              else if (weight.includes("800") || weight.includes("extra-bold"))
                fontWeight = "800";
              else if (weight.includes("900") || weight.includes("black"))
                fontWeight = "900";
            }

            // Set font
            ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

            // Extract text color (default to white)
            let textColor = "#ffffff";
            if (element.style?.color) {
              const colorMatch = element.style.color.match(
                /#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/
              );
              if (colorMatch) textColor = colorMatch[0];
            }

            ctx.fillStyle = textColor;
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = Math.max(1, fontSize / 16); // Scale stroke with font size

            // Text alignment
            const textAlign = element.style?.["text-align"];
            if (
              textAlign === "left" ||
              textAlign === "center" ||
              textAlign === "right"
            ) {
              ctx.textAlign = textAlign;
            } else {
              ctx.textAlign = "center";
            }

            // Add shadow for better readability
            if (element.style?.["text-shadow"]) {
              // Parse text shadow if provided
              const shadowMatch = element.style["text-shadow"].match(
                /(\d+)px\s+(\d+)px\s+(\d+)px\s+([^,)]+)/
              );
              if (shadowMatch) {
                ctx.shadowOffsetX = parseInt(shadowMatch[1]);
                ctx.shadowOffsetY = parseInt(shadowMatch[2]);
                ctx.shadowBlur = parseInt(shadowMatch[3]);
                ctx.shadowColor = shadowMatch[4];
              } else {
                // Default shadow
                ctx.shadowColor = "rgba(0,0,0,0.8)";
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 4;
              }
            } else {
              // Default shadow for readability
              ctx.shadowColor = "rgba(0,0,0,0.8)";
              ctx.shadowOffsetX = Math.max(1, fontSize / 16);
              ctx.shadowOffsetY = Math.max(1, fontSize / 16);
              ctx.shadowBlur = Math.max(2, fontSize / 8);
            }

            // Calculate position
            let x = canvas.width / 2;
            let y = defaultY;

            // Position based on element position data
            if (element.position) {
              if (element.position.left) {
                const leftMatch =
                  element.position.left.match(/(\d+(?:\.\d+)?)/);
                if (leftMatch) {
                  const leftValue = parseFloat(leftMatch[1]);
                  x = element.position.left.includes("%")
                    ? (canvas.width * leftValue) / 100
                    : leftValue;
                  ctx.textAlign = "left";
                }
              }
              if (element.position.right) {
                const rightMatch =
                  element.position.right.match(/(\d+(?:\.\d+)?)/);
                if (rightMatch) {
                  const rightValue = parseFloat(rightMatch[1]);
                  x = element.position.right.includes("%")
                    ? canvas.width - (canvas.width * rightValue) / 100
                    : canvas.width - rightValue;
                  ctx.textAlign = "right";
                }
              }
              if (element.position.top) {
                const topMatch = element.position.top.match(/(\d+(?:\.\d+)?)/);
                if (topMatch) {
                  const topValue = parseFloat(topMatch[1]);
                  y = element.position.top.includes("%")
                    ? (canvas.height * topValue) / 100
                    : topValue;
                }
              }
              if (element.position.bottom) {
                const bottomMatch =
                  element.position.bottom.match(/(\d+(?:\.\d+)?)/);
                if (bottomMatch) {
                  const bottomValue = parseFloat(bottomMatch[1]);
                  y = element.position.bottom.includes("%")
                    ? canvas.height - (canvas.height * bottomValue) / 100
                    : canvas.height - bottomValue;
                }
              }
            }

            // Apply text transform
            let finalText = element.text;
            if (element.style?.["text-transform"]) {
              switch (element.style["text-transform"]) {
                case "uppercase":
                  finalText = finalText.toUpperCase();
                  break;
                case "lowercase":
                  finalText = finalText.toLowerCase();
                  break;
                case "capitalize":
                  finalText = finalText.replace(/\b\w/g, (l: string) =>
                    l.toUpperCase()
                  );
                  break;
              }
            }

            // Draw text with stroke for better visibility
            ctx.strokeText(finalText, x, y);
            ctx.fillText(finalText, x, y);
            ctx.restore();
          };

          // Draw text elements with proper positioning
          const useNewStructure = isNewStructure(imageTextData);

          if (useNewStructure) {
            // New structure: individual title, subtitle, cta elements
            const textElements = extractTextElements(imageTextData);
            textElements.forEach(({ type, element }) => {
              if (element.text) {
                // Convert TextElement to ImageTextElement format for compatibility with drawText
                const legacyElement: ImageTextElement = {
                  text: element.text,
                  position: element.position,
                  style: element.style,
                };
                const defaultY =
                  type === "title"
                    ? 100
                    : type === "subtitle"
                    ? canvas.height / 2
                    : canvas.height - 100;
                drawText(legacyElement, defaultY);
              }
            });
          } else {
            // Legacy structure: main_container with children
            if (imageTextData.main_container?.children) {
              imageTextData.main_container.children.forEach((child, index) => {
                if (child.text) {
                  const defaultY =
                    index === 0
                      ? 100
                      : index === 1
                      ? canvas.height / 2
                      : canvas.height - 100;
                  drawText(child, defaultY);
                }
              });
            }
            // Support for legacy elements array
            if (imageTextData.elements) {
              imageTextData.elements.forEach((element, index) => {
                if (element.text) {
                  const defaultY =
                    index === 0
                      ? 100
                      : index === 1
                      ? canvas.height / 2
                      : canvas.height - 100;
                  drawText(element, defaultY);
                }
              });
            }
          }

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error("Failed to generate image"));
            }
          }, "image/png");
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Image load failed - CORS configuration required"));
      };

      img.src = imageUrl;
    });
  };

  return {
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
  };
};
