// Google Fonts configuration for PostNow
// This file contains all available fonts for text overlays

export interface FontFamily {
  name: string;
  family: string;
  category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
  weights: number[];
  description: string;
}

export const AVAILABLE_FONTS: FontFamily[] = [
  // Sans-serif fonts
  {
    name: "Inter",
    family: "Inter",
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    description: "Modern, clean, and highly readable",
  },
  {
    name: "Roboto",
    family: "Roboto",
    category: "sans-serif",
    weights: [100, 300, 400, 500, 700, 900],
    description: "Google's signature font",
  },
  {
    name: "Open Sans",
    family: "Open Sans",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    description: "Friendly and open curves",
  },
  {
    name: "Lato",
    family: "Lato",
    category: "sans-serif",
    weights: [100, 300, 400, 700, 900],
    description: "Humanist sans-serif",
  },
  {
    name: "Montserrat",
    family: "Montserrat",
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    description: "Inspired by urban Buenos Aires",
  },
  {
    name: "Poppins",
    family: "Poppins",
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    description: "Geometric sans-serif",
  },
  {
    name: "Nunito",
    family: "Nunito",
    category: "sans-serif",
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    description: "Rounded sans-serif",
  },
  {
    name: "Raleway",
    family: "Raleway",
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    description: "Elegant sans-serif",
  },
  {
    name: "Ubuntu",
    family: "Ubuntu",
    category: "sans-serif",
    weights: [300, 400, 500, 700],
    description: "Ubuntu's signature font",
  },
  {
    name: "Work Sans",
    family: "Work Sans",
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    description: "Optimized for on-screen text",
  },
  {
    name: "Source Sans Pro",
    family: "Source Sans Pro",
    category: "sans-serif",
    weights: [200, 300, 400, 600, 700, 900],
    description: "Adobe's first open source font",
  },
  {
    name: "PT Sans",
    family: "PT Sans",
    category: "sans-serif",
    weights: [400, 700],
    description: "Type family for the Russian language",
  },
  {
    name: "Noto Sans",
    family: "Noto Sans",
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    description: "Google's font to support all languages",
  },
  {
    name: "Quicksand",
    family: "Quicksand",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
    description: "Friendly display sans-serif",
  },
  {
    name: "Comfortaa",
    family: "Comfortaa",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
    description: "Rounded geometric sans-serif",
  },

  // Display fonts
  {
    name: "Oswald",
    family: "Oswald",
    category: "display",
    weights: [200, 300, 400, 500, 600, 700],
    description: "Re-drawn Vernon Adams' original Oswald",
  },
  {
    name: "Roboto Condensed",
    family: "Roboto Condensed",
    category: "display",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    description: "Condensed version of Roboto",
  },
  {
    name: "Anton",
    family: "Anton",
    category: "display",
    weights: [400],
    description: "Single weight display font",
  },
  {
    name: "Bebas Neue",
    family: "Bebas Neue",
    category: "display",
    weights: [400],
    description: "All caps display font",
  },
  {
    name: "Righteous",
    family: "Righteous",
    category: "display",
    weights: [400],
    description: "Casual script with a hand drawn feel",
  },
  {
    name: "Fredoka One",
    family: "Fredoka One",
    category: "display",
    weights: [400],
    description: "Playful rounded display font",
  },
  {
    name: "Abril Fatface",
    family: "Abril Fatface",
    category: "display",
    weights: [400],
    description: "Contemporary revamp of classic Didone",
  },

  // Serif fonts
  {
    name: "Playfair Display",
    family: "Playfair Display",
    category: "serif",
    weights: [400, 500, 600, 700, 800, 900],
    description: "Transitional design for large sizes",
  },
  {
    name: "Merriweather",
    family: "Merriweather",
    category: "serif",
    weights: [300, 400, 700, 900],
    description: "Designed for pleasant reading",
  },
  {
    name: "Crimson Text",
    family: "Crimson Text",
    category: "serif",
    weights: [400, 600, 700],
    description: "Old-style serif for book production",
  },
  {
    name: "Libre Baskerville",
    family: "Libre Baskerville",
    category: "serif",
    weights: [400, 700],
    description: "Web optimized Baskerville",
  },
  {
    name: "Cormorant Garamond",
    family: "Cormorant Garamond",
    category: "serif",
    weights: [300, 400, 500, 600, 700],
    description: "Display serif in the style of Garamond",
  },

  // Handwriting fonts
  {
    name: "Dancing Script",
    family: "Dancing Script",
    category: "handwriting",
    weights: [400, 500, 600, 700],
    description: "Lively casual script",
  },
  {
    name: "Lobster",
    family: "Lobster",
    category: "handwriting",
    weights: [400],
    description: "Bold condensed script",
  },
  {
    name: "Pacifico",
    family: "Pacifico",
    category: "handwriting",
    weights: [400],
    description: "Original and fun brush script",
  },
];

// Get fonts by category
export const getFontsByCategory = (category: FontFamily["category"]) => {
  return AVAILABLE_FONTS.filter((font) => font.category === category);
};

// Get font by name
export const getFontByName = (name: string) => {
  return AVAILABLE_FONTS.find((font) => font.name === name);
};

// Get all font families as array for CSS
export const getAllFontFamilies = () => {
  return AVAILABLE_FONTS.map((font) => font.family);
};

// Popular fonts for quick access
export const POPULAR_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Oswald",
  "Dancing Script",
  "Lobster",
  "Bebas Neue",
];
