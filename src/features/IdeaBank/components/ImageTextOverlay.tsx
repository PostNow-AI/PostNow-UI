import {
  type ImageTextData,
  type ImageTextElement,
} from "@/features/IdeaBank/types";
import { cn } from "@/lib/utils";
import React from "react";
import { buildStyle } from "../utils";

interface ImageTextOverlayProps {
  imageUrl: string;
  imageTextData: ImageTextData;
  className?: string;
  containerWidth?: number;
  containerHeight?: number;
}

// Text element component
const TextElement: React.FC<{
  element: ImageTextElement;
  className?: string;
}> = ({ element, className }) => {
  if (!element.text) return null;

  return (
    <div
      className={cn("absolute whitespace-pre-wrap", className)}
      style={buildStyle(element)}
    >
      {element.text}
    </div>
  );
};

export const ImageTextOverlay: React.FC<ImageTextOverlayProps> = ({
  imageUrl,
  imageTextData,
  className,
}) => {
  if (!imageTextData) {
    return (
      <img
        src={imageUrl}
        alt="Post"
        className={cn("w-full object-cover rounded-md", className)}
        style={{ aspectRatio: `4/5` }}
      />
    );
  }

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ aspectRatio: `4/5` }}
    >
      <img
        src={imageUrl}
        alt="Post"
        className="w-full h-full object-cover rounded-md"
      />

      <div className="absolute inset-0">
        {imageTextData.title && (
          <TextElement element={imageTextData.title} className="z-30" />
        )}
        {imageTextData.subtitle && (
          <TextElement element={imageTextData.subtitle} className="z-20" />
        )}
        {imageTextData.cta && (
          <TextElement element={imageTextData.cta} className="z-10" />
        )}
      </div>
    </div>
  );
};

export default ImageTextOverlay;
