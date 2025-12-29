/**
 * Seletor de estilos visuais para campanha.
 * Adaptado de Auth/Onboarding/BrandingStep.tsx (reutilização 80%).
 * Component < 200 linhas (só UI), lógica em useVisualStyles hook.
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Checkbox,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Separator,
} from "@/components/ui";
import { Palette, Search } from "lucide-react";
import { useVisualStyles } from "../../hooks/useVisualStyles";

interface VisualStylePickerProps {
  onSelect: (styleIds: string[]) => void;
  onBack: () => void;
}

export const VisualStylePicker = ({ onSelect, onBack }: VisualStylePickerProps) => {
  const {
    selected,
    toggleStyle,
    isSelected,
    isFromProfile,
    visualStylePreferences,
    campaignStyles,
    isLoading,
  } = useVisualStyles();

  const [showLibrary, setShowLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filtrar estilos por categoria e busca
  const filteredStyles = campaignStyles?.filter((style) => {
    const matchesCategory = activeCategory === "all" || style.category === activeCategory;
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         style.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContinue = () => {
    onSelect(selected.map(String)); // Converter para string[]
  };

  return (
    <div className="space-y-6">
      {/* Estilos do Perfil */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-5 w-5" />
            💡 Seus Estilos do Perfil
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando estilos...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visualStylePreferences?.slice(0, 3).map((pref: any) => (
                  <Card
                    key={pref.id}
                    className={`cursor-pointer transition-all ${
                      isSelected(pref.id) ? "border-primary border-2" : ""
                    }`}
                    onClick={() => toggleStyle(pref.id)}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <Checkbox checked={isSelected(pref.id)} />
                        <div className="flex-1">
                          <h4 className="font-medium">{pref.name}</h4>
                          {isFromProfile(pref.id) && (
                            <Badge variant="secondary" className="mt-1">
                              Seu estilo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                ✓ {selected.length} selecionados (Recomendado: 1-3)
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Explorar Mais Estilos */}
      {!showLibrary && (
        <Button
          variant="outline"
          onClick={() => setShowLibrary(true)}
          className="w-full"
        >
          📚 Explorar Mais Estilos ({campaignStyles?.length || 18} disponíveis)
        </Button>
      )}

      {/* Biblioteca Completa */}
      {showLibrary && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Biblioteca de Estilos</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowLibrary(false)}>
                Fechar
              </Button>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estilo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabs por Categoria */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <div className="overflow-x-auto">
                <TabsList className="inline-flex w-full justify-start">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="minimal">Minimalistas</TabsTrigger>
                  <TabsTrigger value="corporate">Corporativos</TabsTrigger>
                  <TabsTrigger value="bold">Bold</TabsTrigger>
                  <TabsTrigger value="modern">Modernos</TabsTrigger>
                  <TabsTrigger value="creative">Criativos</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>

            {/* Grid de Estilos - SIMPLIFICADO */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2">
              {filteredStyles?.map((style) => (
                <div
                  key={style.id}
                  className={`group cursor-pointer transition-all hover:scale-105 ${
                    isSelected(style.id) ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  onClick={() => toggleStyle(style.id)}
                >
                  {/* Imagem DIRETA sem Card */}
                  <div className="aspect-square rounded-lg overflow-hidden shadow-md relative">
                    {style.preview_image_url ? (
                      <img 
                        src={style.preview_image_url} 
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <p className="text-xs text-center p-2">{style.name}</p>
                      </div>
                    )}
                    
                    {/* Checkbox sobreposto */}
                    <div className="absolute top-2 left-2">
                      <Checkbox 
                        checked={isSelected(style.id)} 
                        className="bg-white/90 backdrop-blur-sm"
                      />
                    </div>
                    
                    {/* Nome sobreposto no hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-medium text-sm text-white">{style.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de Navegação */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Voltar
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selected.length === 0 || selected.length > 3}
        >
          Continuar com {selected.length} {selected.length === 1 ? "estilo" : "estilos"} →
        </Button>
      </div>
    </div>
  );
};

