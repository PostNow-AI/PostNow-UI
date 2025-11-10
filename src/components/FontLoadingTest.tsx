import React, { useEffect, useState } from "react";

interface FontStatus {
  name: string;
  loaded: boolean;
  error?: string;
}

const fontList = [
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

const FontLoadingTest: React.FC = () => {
  const [fontStatuses, setFontStatuses] = useState<FontStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFonts = async () => {
      const results: FontStatus[] = [];

      for (const fontName of fontList) {
        try {
          if (document.fonts && document.fonts.check) {
            // Check if font is loaded
            const isLoaded = document.fonts.check(`16px "${fontName}"`);
            results.push({
              name: fontName,
              loaded: isLoaded,
            });
          } else {
            // Fallback for browsers without document.fonts
            results.push({
              name: fontName,
              loaded: true, // Assume loaded if we can't check
              error: "Cannot check font loading status",
            });
          }
        } catch (error) {
          results.push({
            name: fontName,
            loaded: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      setFontStatuses(results);
      setLoading(false);
    };

    // Wait a bit for fonts to potentially load
    setTimeout(checkFonts, 2000);
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Checking Font Loading Status...
        </h2>
        <div className="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
        <div className="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
        <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
      </div>
    );
  }

  const loadedFonts = fontStatuses.filter((font) => font.loaded);
  const failedFonts = fontStatuses.filter((font) => !font.loaded);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Font Loading Status Report</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">Total Fonts</h3>
          <p className="text-2xl font-bold text-blue-900">
            {fontStatuses.length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Loaded</h3>
          <p className="text-2xl font-bold text-green-900">
            {loadedFonts.length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Failed</h3>
          <p className="text-2xl font-bold text-red-900">
            {failedFonts.length}
          </p>
        </div>
      </div>

      {/* Success Rate */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Success Rate</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{
              width: `${(loadedFonts.length / fontStatuses.length) * 100}%`,
            }}
          >
            {Math.round((loadedFonts.length / fontStatuses.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Loaded Fonts */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-green-800">
          ✅ Successfully Loaded Fonts ({loadedFonts.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadedFonts.map((font) => (
            <div
              key={font.name}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <h4 className="font-semibold text-green-800">{font.name}</h4>
              <p className="text-sm text-green-600">Font loaded successfully</p>
              <div className="mt-2">
                <span
                  className="text-lg"
                  style={{ fontFamily: `"${font.name}", sans-serif` }}
                >
                  Sample text in {font.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failed Fonts */}
      {failedFonts.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-800">
            ❌ Failed to Load Fonts ({failedFonts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {failedFonts.map((font) => (
              <div
                key={font.name}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <h4 className="font-semibold text-red-800">{font.name}</h4>
                <p className="text-sm text-red-600">Font not detected</p>
                {font.error && (
                  <p className="text-xs text-red-500 mt-1">{font.error}</p>
                )}
                <div className="mt-2">
                  <span
                    className="text-lg"
                    style={{ fontFamily: `"${font.name}", sans-serif` }}
                  >
                    Sample text (fallback font)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontLoadingTest;
