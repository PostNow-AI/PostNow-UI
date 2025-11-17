import {
  type ImageTextData,
  type ImageTextElement,
  type TextElement,
} from "@/features/IdeaBank/types";
import { cn } from "@/lib/utils";
import React from "react";
import {
  buildStyle,
  buildTextElementStyle,
  extractTextElements,
  isNewStructure,
} from "../utils";

interface ImageTextOverlayProps {
  imageUrl: string;
  imageTextData: ImageTextData | string | null;
  className?: string;
  containerWidth?: number;
  containerHeight?: number;
}

// Legacy text element component (for backwards compatibility)
const LegacyTextElement: React.FC<{
  element: ImageTextElement;
  className?: string;
  zIndex?: number;
}> = ({ element, className, zIndex }) => {
  if (!element.text) return null;

  const elementStyle = buildStyle(element);
  if (zIndex !== undefined) {
    elementStyle.zIndex = zIndex;
  }

  return (
    <div
      className={cn("whitespace-pre-wrap overflow-wrap-break-word", className)}
      style={elementStyle}
    >
      {element.text}
    </div>
  );
};

// New text element component (for new structure)
const NewTextElement: React.FC<{
  element: TextElement;
  className?: string;
  type: string;
  zIndex?: number;
}> = ({ element, className, type, zIndex }) => {
  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log(`🎯 NewTextElement rendering ${type}:`, element);
    console.log(`🎯 NewTextElement ${type} text:`, element.text);
  }

  if (!element.text) {
    console.log(
      `❌ NewTextElement ${type} - no text found in element:`,
      element
    );
    return null;
  }

  const elementStyle = buildTextElementStyle(element);
  if (zIndex !== undefined) {
    elementStyle.zIndex = zIndex;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`🎯 NewTextElement ${type} final style:`, elementStyle);
    console.log(
      `🎯 NewTextElement ${type} about to render with text: "${element.text}"`
    );
  }

  return (
    <div
      className={cn("whitespace-pre-wrap overflow-wrap-break-word", className)}
      style={elementStyle}
      data-element-type={type}
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
  // Handle case where imageTextData might be a string (needs parsing)
  let parsedImageTextData: ImageTextData | null = null;

  console.log("🧩 ImageTextOverlay - imageTextData:", imageTextData);
  if (typeof imageTextData === "string") {
    try {
      parsedImageTextData = JSON.parse(imageTextData) as ImageTextData;
      console.log("🔧 Parsed string imageTextData:", parsedImageTextData);
    } catch (error) {
      console.error("❌ Failed to parse imageTextData string:", error);
      parsedImageTextData = null;
    }
  } else if (imageTextData && typeof imageTextData === "object") {
    parsedImageTextData = imageTextData;
  }

  if (!parsedImageTextData) {
    console.log("⚠️ No valid imageTextData, showing image only");
    return (
      <img
        src={imageUrl}
        alt="Post"
        className={cn("w-full object-cover rounded-md", className)}
        style={{ aspectRatio: `4/5` }}
      />
    );
  }

  // Use parsed data for the rest of the component
  const validImageTextData: ImageTextData = parsedImageTextData;

  const useNewStructure = isNewStructure(validImageTextData);

  // Debug logging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 ImageTextOverlay DEBUG START");
    console.log("📊 original imageTextData type:", typeof imageTextData);
    console.log("📊 original imageTextData:", imageTextData);
    console.log("📊 validImageTextData:", validImageTextData);
    console.log(
      "📊 validImageTextData keys:",
      Object.keys(validImageTextData || {})
    );
    console.log("📊 useNewStructure:", useNewStructure);

    // Check what isNewStructure is looking for
    console.log("📊 checking isNewStructure conditions:");
    console.log("📊 data.title:", validImageTextData.title);
    console.log("📊 data.subtitle:", validImageTextData.subtitle);
    console.log("📊 data.cta:", validImageTextData.cta);
    console.log("📊 data.layout_type:", validImageTextData.layout_type);

    // Check individual properties
    console.log("📊 data.title:", validImageTextData.title);
    console.log("📊 data.subtitle:", validImageTextData.subtitle);
    console.log("📊 data.cta:", validImageTextData.cta);
    console.log("📊 data.layout_type:", validImageTextData.layout_type);

    if (useNewStructure) {
      const extractedElements = extractTextElements(validImageTextData);
      console.log("📊 extractedElements:", extractedElements);
      console.log("📊 extractedElements length:", extractedElements.length);

      extractedElements.forEach(({ type, element }) => {
        console.log(`📊 Element ${type}:`, element);
        console.log(`📊 Element ${type} text:`, element.text);
        console.log(`📊 Element ${type} position:`, element.position);
        console.log(`📊 Element ${type} style:`, element.style);
      });
    }
    console.log("🔍 ImageTextOverlay DEBUG END");
  }

  // Build outer border style if present
  const outerBorderStyle = validImageTextData.outer_border
    ? {
        backgroundColor: validImageTextData.outer_border.color,
        padding: validImageTextData.outer_border.padding,
        borderRadius: validImageTextData.outer_border.border_radius || "0px",
      }
    : {};

  if (process.env.NODE_ENV === "development") {
    console.log("🎨 Outer border style:", outerBorderStyle);
  }

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ aspectRatio: `4/5`, ...outerBorderStyle }}
    >
      <img
        src={imageUrl}
        alt="Post"
        className={cn(
          "w-full h-full object-cover",
          validImageTextData.outer_border ? "rounded-md" : "rounded-md"
        )}
        style={
          validImageTextData.outer_border
            ? { borderRadius: validImageTextData.outer_border.border_radius }
            : {}
        }
      />

      <div className="absolute inset-0">
        {useNewStructure ? (
          // New structure: individual title, subtitle, cta elements
          <>
            {(() => {
              const extractedElements = extractTextElements(validImageTextData);
              if (process.env.NODE_ENV === "development") {
                console.log(
                  "🎯 ImageTextOverlay - About to render elements:",
                  extractedElements
                );
                console.log(
                  "🎯 ImageTextOverlay - Elements count:",
                  extractedElements.length
                );
              }
              return extractedElements.map(({ type, element }, index) => (
                <NewTextElement
                  key={`${type}-${index}`}
                  element={element}
                  type={type}
                  zIndex={30 - index * 5}
                />
              ));
            })()}
          </>
        ) : (
          // Legacy structure: main_container with children
          <>
            {validImageTextData.main_container && (
              <div style={buildStyle(validImageTextData.main_container)}>
                {validImageTextData.main_container.children?.map(
                  (child: ImageTextElement, index: number) => (
                    <LegacyTextElement
                      key={child.element || index}
                      element={child}
                      zIndex={30 - index * 10}
                    />
                  )
                )}
              </div>
            )}
            {/* Support for legacy elements array */}
            {validImageTextData.elements?.map(
              (element: ImageTextElement, index: number) => (
                <LegacyTextElement
                  key={element.element || index}
                  element={element}
                  zIndex={20 - index * 5}
                />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageTextOverlay;
