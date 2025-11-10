import { useEffect, useState } from "react";

// Font preloader to ensure all fonts are loaded before using them
export const FontPreloader: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const fontFamilies = [
      "Inter",
      "Roboto",
      "Open Sans",
      "Lato",
      "Montserrat",
      "Poppins",
      "Nunito",
      "Raleway",
      "Ubuntu",
      "Work Sans",
      "Source Sans Pro",
      "PT Sans",
      "Noto Sans",
      "Quicksand",
      "Comfortaa",
      "Oswald",
      "Roboto Condensed",
      "Anton",
      "Bebas Neue",
      "Righteous",
      "Fredoka One",
      "Abril Fatface",
      "Playfair Display",
      "Merriweather",
      "Crimson Text",
      "Libre Baskerville",
      "Cormorant Garamond",
      "Dancing Script",
      "Lobster",
      "Pacifico",
    ];

    const loadFont = async (fontFamily: string): Promise<boolean> => {
      try {
        // Try to load the font by creating a temporary element
        const testElement = document.createElement("div");
        testElement.style.fontFamily = `"${fontFamily}", sans-serif`;
        testElement.style.fontSize = "12px";
        testElement.style.position = "absolute";
        testElement.style.visibility = "hidden";
        testElement.innerHTML = "Test";
        document.body.appendChild(testElement);

        // Check if font is loaded using document.fonts API
        if ("fonts" in document && document.fonts) {
          await document.fonts.load(`12px "${fontFamily}"`);
          const isLoaded = document.fonts.check(`12px "${fontFamily}"`);
          if (testElement.parentNode) {
            document.body.removeChild(testElement);
          }
          return isLoaded;
        }

        // Fallback: wait a bit and assume loaded
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (testElement.parentNode) {
          document.body.removeChild(testElement);
        }
        return true;
      } catch (error) {
        console.warn(`Failed to load font: ${fontFamily}`, error);
        return false;
      }
    };

    const loadAllFonts = async () => {
      let loaded = 0;

      for (const fontFamily of fontFamilies) {
        const success = await loadFont(fontFamily);
        if (success) loaded++;
        setLoadingProgress((loaded / fontFamilies.length) * 100);
      }

      setFontsLoaded(true);
    };

    // Start loading fonts
    loadAllFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Loading Fonts...</h3>
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {Math.round(loadingProgress)}% complete
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default FontPreloader;
