import React from "react";
import type { ImageTextElement } from "../types";

// Extend CSSProperties to include CSS custom properties
interface ExtendedCSSProperties extends React.CSSProperties {
  [key: `--${string}`]: string | number;
}

// Clean style values by extracting useful CSS from template strings
const cleanValue = (value?: string): string => {
  if (!value) return "";
  if (!value.includes("[")) return value;

  // Handle backdrop-filter specifically (it's a compound property)
  if (value.includes("backdrop-filter") || value.includes("blur(")) {
    const backdropMatch = value.match(/backdrop-filter:\s*([^;}\]]+)/);
    if (backdropMatch) return backdropMatch[1].trim();

    // Handle blur with optional saturate
    const complexBlurMatch = value.match(
      /blur\(\d+(?:\.\d+)?px\)\s*saturate\(\d+(?:\.\d+)?%?\)/
    );
    if (complexBlurMatch) return complexBlurMatch[0];

    const blurMatch = value.match(/blur\(\d+(?:\.\d+)?px\)/);
    if (blurMatch) return blurMatch[0];
  }

  // Handle gradients specifically (they can be complex)
  if (value.includes("gradient")) {
    const gradientMatch = value.match(
      /(linear-gradient|radial-gradient)\([^)]+\)/
    );
    if (gradientMatch) return gradientMatch[0];
  }

  // Extract common CSS patterns including new glassmorphism and professional effects
  const match = value.match(
    /#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\)|\d+(?:\.\d+)?(?:px|em|rem|%)|linear-gradient\([^)]+\)|radial-gradient\([^)]+\)|blur\(\d+(?:\.\d+)?px\)\s*saturate\(\d+(?:\.\d+)?%?\)|blur\(\d+(?:\.\d+)?px\)|saturate\(\d+(?:\.\d+)?%?\)|bold|[1-9]00|center|left|right|uppercase|lowercase|capitalize|none|0\.\d+|[01]|Montserrat|Inter|Poppins|Roboto|Lato|Nunito|Raleway|Ubuntu|Work Sans|Open Sans|Playfair Display|Merriweather|Oswald|Anton|Bebas Neue|Dancing Script|Lobster|Pacifico|Comfortaa|Righteous|Abril Fatface|Quicksand|Crimson Text|Libre Baskerville|Cormorant Garamond|Fredoka One|Source Sans Pro|PT Sans|Noto Sans|Roboto Condensed/
  );
  return match ? match[0] : "";
};

// Build inline styles from element data
export const buildStyle = (
  element: ImageTextElement
): ExtendedCSSProperties => {
  const style: ExtendedCSSProperties = {};

  // Position
  if (element.position?.top) style.top = cleanValue(element.position.top);
  if (element.position?.left) style.left = cleanValue(element.position.left);
  if (element.position?.right) style.right = cleanValue(element.position.right);
  if (element.position?.bottom)
    style.bottom = cleanValue(element.position.bottom);

  // Typography
  if (element.typography?.font_family) {
    const fontFamily = cleanValue(element.typography.font_family);
    style.fontFamily = fontFamily || "Inter, system-ui, sans-serif";
  }
  if (element.typography?.font_size)
    style.fontSize = cleanValue(element.typography.font_size);
  if (element.typography?.font_weight)
    style.fontWeight = cleanValue(element.typography.font_weight);
  if (element.typography?.line_height)
    style.lineHeight = cleanValue(element.typography.line_height);
  if (element.typography?.letter_spacing)
    style.letterSpacing = cleanValue(element.typography.letter_spacing);

  // Color and alignment
  if (element.color) style.color = cleanValue(element.color);
  if (element.text_align) style.textAlign = element.text_align;
  if (element.text_transform) style.textTransform = element.text_transform;

  // Effects
  if (element.effects?.text_shadow)
    style.textShadow = cleanValue(element.effects.text_shadow);
  if (element.effects?.background)
    style.background = cleanValue(element.effects.background);
  if (element.effects?.border)
    style.border = cleanValue(element.effects.border);
  if (element.effects?.border_radius)
    style.borderRadius = cleanValue(element.effects.border_radius);
  if (element.effects?.padding)
    style.padding = cleanValue(element.effects.padding);
  if (element.effects?.box_shadow)
    style.boxShadow = cleanValue(element.effects.box_shadow);
  if (element.effects?.gradient)
    style.background = cleanValue(element.effects.gradient);

  // Glassmorphism and modern effects
  if (element.effects?.backdrop_filter) {
    const backdropValue = cleanValue(element.effects.backdrop_filter);
    if (backdropValue) {
      style.backdropFilter = backdropValue;
      style.WebkitBackdropFilter = backdropValue; // Safari support
    }
  }
  if (element.effects?.opacity) {
    const opacityValue = cleanValue(element.effects.opacity);
    if (opacityValue) {
      const numValue = parseFloat(opacityValue);
      style.opacity = !isNaN(numValue) ? numValue : 1;
    }
  }

  // Handle hover effects (store as CSS custom property)
  if (element.effects?.hover_effects) {
    const hoverValue = cleanValue(element.effects.hover_effects);
    if (hoverValue) {
      // Store hover effects as a CSS custom property
      style["--hover-effect"] = hoverValue;
    }
  }

  // Ensure position absolute for overlay elements
  if (
    element.position &&
    (element.position.top ||
      element.position.left ||
      element.position.right ||
      element.position.bottom)
  ) {
    style.position = "absolute";
  }

  // Handle position padding separately from effects padding
  if (element.position?.padding && !element.effects?.padding) {
    style.padding = cleanValue(element.position.padding);
  }

  return style;
};
