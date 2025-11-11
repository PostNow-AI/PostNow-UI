import React from "react";
import type { ImageTextElement } from "../types";

// Build inline styles from the new element data structure
export const buildStyle = (element: ImageTextElement): React.CSSProperties => {
  const style: React.CSSProperties = {};

  // Handle position for the main container
  if (element.position) {
    style.position = "absolute";
    if (element.position.top) style.top = element.position.top;
    if (element.position.left) style.left = element.position.left;
    if (element.position.right) style.right = element.position.right;
    if (element.position.bottom) style.bottom = element.position.bottom;
  }

  // Map styles directly from the element's style object
  if (element.style) {
    const elementStyle = element.style;

    // Flexbox properties
    if (elementStyle.display) style.display = elementStyle.display;
    if (elementStyle["flex-direction"])
      style.flexDirection = elementStyle["flex-direction"];
    if (elementStyle["align-items"])
      style.alignItems = elementStyle["align-items"];
    if (elementStyle["justify-content"])
      style.justifyContent = elementStyle["justify-content"];
    if (elementStyle.gap) style.gap = elementStyle.gap;
    if (elementStyle["align-self"])
      style.alignSelf = elementStyle["align-self"];

    // Spacing
    if (elementStyle.padding) style.padding = elementStyle.padding;
    if (elementStyle["margin-top"])
      style.marginTop = elementStyle["margin-top"];

    // Background and Border
    if (elementStyle.background) style.background = elementStyle.background;
    if (elementStyle["border-radius"])
      style.borderRadius = elementStyle["border-radius"];
    if (elementStyle.border) style.border = elementStyle.border;

    // Typography
    if (elementStyle["font-family"])
      style.fontFamily = elementStyle["font-family"];
    if (elementStyle.font_size) style.fontSize = elementStyle.font_size;
    if (elementStyle.font_weight) style.fontWeight = elementStyle.font_weight;
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
    if (elementStyle["box-shadow"])
      style.boxShadow = elementStyle["box-shadow"];
    if (elementStyle.opacity) style.opacity = elementStyle.opacity;

    // Glassmorphism
    if (elementStyle["backdrop-filter"]) {
      style.backdropFilter = elementStyle["backdrop-filter"];
      style.WebkitBackdropFilter = elementStyle["backdrop-filter"];
    }
  }

  return style;
};
