import React from "react";
import type {
  ElementStyle,
  ImageTextData,
  ImageTextElement,
  Position,
  TextElement,
} from "../types";

// Helper to normalize position values
const normalizePositionValue = (value: string): string => {
  // Handle special position values from AI prompts
  switch (value) {
    case "strategic_focal_point":
      return "20%";
    case "supporting_area":
      return "50%";
    case "action_zone":
      return "80%";
    default:
      return value;
  }
};

// Build inline styles from position data
export const buildPositionStyle = (
  position?: Position
): React.CSSProperties => {
  const positionStyle: React.CSSProperties = {};

  if (position) {
    positionStyle.position = "absolute";
    if (position.top) positionStyle.top = normalizePositionValue(position.top);
    if (position.left)
      positionStyle.left = normalizePositionValue(position.left);
    if (position.right)
      positionStyle.right = normalizePositionValue(position.right);
    if (position.bottom)
      positionStyle.bottom = normalizePositionValue(position.bottom);
    if (position.width)
      positionStyle.width = normalizePositionValue(position.width);
    if (position.height)
      positionStyle.height = normalizePositionValue(position.height);
    if (position.transform) {
      positionStyle.transform = position.transform;
      if (process.env.NODE_ENV === "development") {
        console.log("🎨 Applied position transform:", position.transform);
      }
    }
  }

  return positionStyle;
};

// Helper to normalize style values
const normalizeStyleValue = (_property: string, value: string): string => {
  // Handle special style values from AI prompts
  switch (value) {
    case "ultra_bold":
      return "900";
    case "light_elegant":
      return "300";
    case "minimal_powerful":
      return "600";
    case "gradient":
      return "linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)";
    default:
      return value;
  }
};

// Build inline styles from element style data
export const buildElementStyle = (
  elementStyle?: ElementStyle
): React.CSSProperties => {
  const style: React.CSSProperties = {};

  if (!elementStyle) return style;

  // Flexbox properties
  if (elementStyle.display)
    style.display = elementStyle.display as React.CSSProperties["display"];
  if (elementStyle["flex-direction"])
    style.flexDirection = elementStyle[
      "flex-direction"
    ] as React.CSSProperties["flexDirection"];
  if (elementStyle["align-items"])
    style.alignItems = elementStyle[
      "align-items"
    ] as React.CSSProperties["alignItems"];
  if (elementStyle["justify-content"])
    style.justifyContent = elementStyle[
      "justify-content"
    ] as React.CSSProperties["justifyContent"];
  if (elementStyle.gap) style.gap = elementStyle.gap;
  if (elementStyle["align-self"])
    style.alignSelf = elementStyle[
      "align-self"
    ] as React.CSSProperties["alignSelf"];

  // Spacing
  if (elementStyle.padding) style.padding = elementStyle.padding;
  if (elementStyle.margin) style.margin = elementStyle.margin;
  if (elementStyle["margin-top"]) style.marginTop = elementStyle["margin-top"];
  if (elementStyle["margin-bottom"])
    style.marginBottom = elementStyle["margin-bottom"];
  if (elementStyle["margin-left"])
    style.marginLeft = elementStyle["margin-left"];
  if (elementStyle["margin-right"])
    style.marginRight = elementStyle["margin-right"];

  // Background and Border
  if (elementStyle.background) {
    style.background = normalizeStyleValue(
      "background",
      elementStyle.background
    );
    // Debug logging for background
    if (process.env.NODE_ENV === "development") {
      console.log("🎨 Applied background:", elementStyle.background);
    }
  }
  if (elementStyle["border-radius"])
    style.borderRadius = elementStyle["border-radius"];
  if (elementStyle.border_radius)
    // Support underscore version
    style.borderRadius = elementStyle.border_radius;
  if (elementStyle.border) style.border = elementStyle.border;

  // Padding for background elements
  if (elementStyle.padding) {
    style.padding = elementStyle.padding;
    if (process.env.NODE_ENV === "development") {
      console.log("🎨 Applied padding:", elementStyle.padding);
    }
  }

  // Typography
  if (elementStyle["font-family"])
    style.fontFamily = elementStyle["font-family"];
  if (elementStyle.font_family)
    // Support underscore version
    style.fontFamily = elementStyle.font_family;

  // Font size - handle both underscore and hyphenated versions
  if (elementStyle.font_size) style.fontSize = elementStyle.font_size;
  if (elementStyle["font-size"]) style.fontSize = elementStyle["font-size"];

  // Font weight - handle both underscore and hyphenated versions
  if (elementStyle.font_weight)
    style.fontWeight = normalizeStyleValue(
      "font_weight",
      elementStyle.font_weight
    );
  if (elementStyle["font-weight"])
    style.fontWeight = normalizeStyleValue(
      "font-weight",
      elementStyle["font-weight"]
    );
  if (elementStyle["line-height"])
    style.lineHeight = elementStyle["line-height"];
  if (elementStyle["letter-spacing"])
    style.letterSpacing = elementStyle["letter-spacing"];

  // Text properties
  if (elementStyle.color) style.color = elementStyle.color;
  if (elementStyle["text-align"])
    style.textAlign = elementStyle[
      "text-align"
    ] as React.CSSProperties["textAlign"];
  if (elementStyle["text-transform"])
    style.textTransform = elementStyle[
      "text-transform"
    ] as React.CSSProperties["textTransform"];

  // Effects
  if (elementStyle["text-shadow"])
    style.textShadow = elementStyle["text-shadow"];
  if (elementStyle.text_shadow)
    // Support underscore version
    style.textShadow = elementStyle.text_shadow;
  if (elementStyle["box-shadow"]) style.boxShadow = elementStyle["box-shadow"];
  if (elementStyle.opacity) style.opacity = elementStyle.opacity;
  if (elementStyle["z-index"]) style.zIndex = elementStyle["z-index"];
  if (elementStyle.transform) style.transform = elementStyle.transform;
  if (elementStyle.transition) style.transition = elementStyle.transition;

  // Glassmorphism
  if (elementStyle["backdrop-filter"]) {
    style.backdropFilter = elementStyle["backdrop-filter"];
    style.WebkitBackdropFilter = elementStyle["backdrop-filter"];
  }

  return style;
};

// Build complete styles for a text element (new structure)
export const buildTextElementStyle = (
  element: TextElement
): React.CSSProperties => {
  const positionStyle = buildPositionStyle(element.position);
  const elementStyle = buildElementStyle(element.style);

  // Debug logging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("buildTextElementStyle - element:", element);
    console.log("buildTextElementStyle - positionStyle:", positionStyle);
    console.log("buildTextElementStyle - elementStyle:", elementStyle);
  }

  return {
    ...positionStyle,
    ...elementStyle,
  };
};

// Build inline styles from the legacy element data structure (backwards compatibility)
export const buildStyle = (element: ImageTextElement): React.CSSProperties => {
  return {
    ...buildPositionStyle(element.position),
    ...buildElementStyle(element.style),
  };
};

// Helper to check if the data uses the new structure
export const isNewStructure = (data: ImageTextData): boolean => {
  return !!(data.title || data.subtitle || data.cta || data.layout_type);
};

// Helper to extract text elements from the new structure
export const extractTextElements = (data: ImageTextData) => {
  const elements: Array<{ type: string; element: TextElement }> = [];

  // Debug logging for element extraction
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 extractTextElements - input data:", data);
    console.log("🔍 extractTextElements - data.title:", data.title);
    console.log("🔍 extractTextElements - data.subtitle:", data.subtitle);
    console.log("🔍 extractTextElements - data.cta:", data.cta);
  }

  if (data.title && data.title.text) {
    elements.push({ type: "title", element: data.title });
    if (process.env.NODE_ENV === "development") {
      console.log("✅ extractTextElements - Added title element");
    }
  } else if (process.env.NODE_ENV === "development") {
    console.log(
      "❌ extractTextElements - Title missing or no text:",
      data.title
    );
  }

  if (data.subtitle && data.subtitle.text) {
    elements.push({ type: "subtitle", element: data.subtitle });
    if (process.env.NODE_ENV === "development") {
      console.log("✅ extractTextElements - Added subtitle element");
    }
  } else if (process.env.NODE_ENV === "development") {
    console.log(
      "❌ extractTextElements - Subtitle missing or no text:",
      data.subtitle
    );
  }

  if (data.cta && data.cta.text) {
    elements.push({ type: "cta", element: data.cta });
    if (process.env.NODE_ENV === "development") {
      console.log("✅ extractTextElements - Added cta element");
    }
  } else if (process.env.NODE_ENV === "development") {
    console.log("❌ extractTextElements - CTA missing or no text:", data.cta);
  }

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 extractTextElements - Final elements array:", elements);
    console.log("🔍 extractTextElements - Elements count:", elements.length);
  }

  return elements;
};

// Debug helper to test JSON parsing
export const testJsonParsing = (jsonString: string) => {
  if (process.env.NODE_ENV === "development") {
    try {
      const parsed = JSON.parse(jsonString);
      console.log("✅ JSON parsed successfully:", parsed);
      console.log(
        "✅ Structure check - isNewStructure:",
        isNewStructure(parsed)
      );
      console.log("✅ Extracted elements:", extractTextElements(parsed));

      // Test style building for each element
      extractTextElements(parsed).forEach(({ type, element }) => {
        console.log(`✅ Style for ${type}:`, buildTextElementStyle(element));
      });

      return parsed;
    } catch (error) {
      console.error("❌ JSON parsing failed:", error);
      return null;
    }
  }
  return null;
};
