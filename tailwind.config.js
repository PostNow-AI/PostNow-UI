/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      serif: ["Playfair Display", "Merriweather", "serif"],
      mono: ["Monaco", "Consolas", "monospace"],
      display: ["Oswald", "Anton", "Bebas Neue", "sans-serif"],
      body: ["Inter", "system-ui", "sans-serif"],
      // Individual font families
      inter: ["Inter", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      "open-sans": ["Open Sans", "sans-serif"],
      lato: ["Lato", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
      nunito: ["Nunito", "sans-serif"],
      raleway: ["Raleway", "sans-serif"],
      ubuntu: ["Ubuntu", "sans-serif"],
      "work-sans": ["Work Sans", "sans-serif"],
      "source-sans-pro": ["Source Sans Pro", "sans-serif"],
      "pt-sans": ["PT Sans", "sans-serif"],
      "noto-sans": ["Noto Sans", "sans-serif"],
      quicksand: ["Quicksand", "sans-serif"],
      comfortaa: ["Comfortaa", "sans-serif"],
      // Display fonts
      oswald: ["Oswald", "sans-serif"],
      "roboto-condensed": ["Roboto Condensed", "sans-serif"],
      anton: ["Anton", "sans-serif"],
      "bebas-neue": ["Bebas Neue", "sans-serif"],
      righteous: ["Righteous", "cursive"],
      "fredoka-one": ["Fredoka One", "cursive"],
      "abril-fatface": ["Abril Fatface", "cursive"],
      // Serif fonts
      "playfair-display": ["Playfair Display", "serif"],
      merriweather: ["Merriweather", "serif"],
      "crimson-text": ["Crimson Text", "serif"],
      "libre-baskerville": ["Libre Baskerville", "serif"],
      "cormorant-garamond": ["Cormorant Garamond", "serif"],
      // Handwriting fonts
      "dancing-script": ["Dancing Script", "cursive"],
      lobster: ["Lobster", "cursive"],
      pacifico: ["Pacifico", "cursive"],
    },
  },
  plugins: [],
};
