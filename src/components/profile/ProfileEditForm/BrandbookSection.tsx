import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { ColorPicker } from "@/components/ui/color-picker";
import { Palette, Type } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

interface BrandbookFormData {
  primary_color?: string;
  secondary_color?: string;
  accent_color_1?: string;
  accent_color_2?: string;
  accent_color_3?: string;
  primary_font?: string;
  secondary_font?: string;
}

interface BrandbookSectionProps {
  form: UseFormReturn<BrandbookFormData>;
}

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Poppins",
  "Montserrat",
  "Lato",
  "Source Sans Pro",
  "Nunito",
  "Ubuntu",
  "Raleway",
  "Playfair Display",
  "Merriweather",
  "PT Sans",
  "Noto Sans",
  "Work Sans",
  "Outro",
];

export const BrandbookSection = ({
  form,
}: BrandbookSectionProps) => {
  const { watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  return (
    <>
      {/* Brandbook - Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paleta de Cores
          </CardTitle>
          <CardDescription>
            Defina as cores da sua marca para personalização visual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              label="Cor Primária"
              value={watchedValues.primary_color}
              onChange={(color) => setValue("primary_color", color)}
              placeholder="#3B82F6"
            />

            <ColorPicker
              label="Cor Secundária"
              value={watchedValues.secondary_color}
              onChange={(color) => setValue("secondary_color", color)}
              placeholder="#EF4444"
            />

            <ColorPicker
              label="Cor de Destaque 1"
              value={watchedValues.accent_color_1}
              onChange={(color) => setValue("accent_color_1", color)}
              placeholder="#10B981"
            />

            <ColorPicker
              label="Cor de Destaque 2"
              value={watchedValues.accent_color_2}
              onChange={(color) => setValue("accent_color_2", color)}
              placeholder="#F59E0B"
            />

            <ColorPicker
              label="Cor de Destaque 3"
              value={watchedValues.accent_color_3}
              onChange={(color) => setValue("accent_color_3", color)}
              placeholder="#8B5CF6"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brandbook - Tipografia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Tipografia
          </CardTitle>
          <CardDescription>Defina as fontes da sua marca</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_font">Fonte Primária</Label>
              <Select
                onValueChange={(value) => setValue("primary_font", value)}
                value={watchedValues.primary_font || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.primary_font && (
                <p className="text-sm text-destructive">
                  {errors.primary_font.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_font">Fonte Secundária</Label>
              <Select
                onValueChange={(value) => setValue("secondary_font", value)}
                value={watchedValues.secondary_font || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.secondary_font && (
                <p className="text-sm text-destructive">
                  {errors.secondary_font.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}; 