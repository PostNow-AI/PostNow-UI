import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FontPreview, FontSelector } from "@/components/ui/FontSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AVAILABLE_FONTS, POPULAR_FONTS } from "@/config/fonts";
import { useState } from "react";

export const FontTester: React.FC = () => {
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [customText, setCustomText] = useState("Your custom text here");
  const [showAllFonts, setShowAllFonts] = useState(false);

  const fontsToDisplay = showAllFonts
    ? AVAILABLE_FONTS.map((f) => f.name)
    : POPULAR_FONTS;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Font Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="font-select">Select Font</Label>
              <FontSelector
                value={selectedFont}
                onValueChange={setSelectedFont}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="custom-text">Custom Text</Label>
              <Input
                id="custom-text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="mt-1"
                placeholder="Enter text to preview"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={showAllFonts ? "outline" : "default"}
              onClick={() => setShowAllFonts(false)}
            >
              Popular Fonts ({POPULAR_FONTS.length})
            </Button>
            <Button
              variant={showAllFonts ? "default" : "outline"}
              onClick={() => setShowAllFonts(true)}
            >
              All Fonts ({AVAILABLE_FONTS.length})
            </Button>
          </div>

          {/* Selected font preview */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Selected Font Preview
            </h3>
            <FontPreview fontFamily={selectedFont} text={customText} />
          </div>
        </CardContent>
      </Card>

      {/* Font grid */}
      <Card>
        <CardHeader>
          <CardTitle>
            {showAllFonts ? "All Available Fonts" : "Popular Fonts"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fontsToDisplay.map((fontName) => {
              const font = AVAILABLE_FONTS.find((f) => f.name === fontName);
              if (!font) return null;

              return (
                <Card
                  key={fontName}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedFont(fontName)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle
                        className="text-base"
                        style={{
                          fontFamily:
                            font.category === "serif"
                              ? `"${font.family}", serif`
                              : font.category === "handwriting"
                              ? `"${font.family}", cursive`
                              : `"${font.family}", sans-serif`,
                        }}
                      >
                        {font.name}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground capitalize">
                        {font.category}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div
                      className="text-sm mb-2"
                      style={{
                        fontFamily:
                          font.category === "serif"
                            ? `"${font.family}", serif`
                            : font.category === "handwriting"
                            ? `"${font.family}", cursive`
                            : `"${font.family}", sans-serif`,
                      }}
                    >
                      {customText}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {font.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Weights: {font.weights.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FontTester;
