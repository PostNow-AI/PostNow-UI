// @ts-nocheck
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
    // Se nenhum estilo foi selecionado MAS tem estilos do perfil, usar esses
    const finalSelection = selected.length > 0 
      ? selected 
      : visualStylePreferences?.map((s: any) => s.id) || [];
    
    onSelect(finalSelection.map(String)); // Converter para string[]
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
          ) : visualStylePreferences && visualStylePreferences.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visualStylePreferences.slice(0, 3).map((style: any) => (
                  <div
                    key={style.id}
                    className={`group cursor-pointer transition-all hover:scale-[1.02] ${
                      isSelected(style.id) ? "ring-4 ring-primary ring-offset-2" : "ring-2 ring-border"
                    }`}
                    onClick={() => toggleStyle(style.id)}
                  >
                    {/* IMAGEM COMPLETA DO ESTILO */}
                    <div className="aspect-square rounded-xl overflow-hidden shadow-lg relative">
                      {style.preview_image_url && !style.preview_image_url.includes('placeholder') ? (
                        <img 
                          src={style.preview_image_url} 
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                          <p className="text-sm text-center p-4 font-medium">{style.name}</p>
                        </div>
                      )}
                      
                      {/* Checkbox destacado */}
                      <div className="absolute top-3 left-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-md p-1 shadow-md">
                          <Checkbox checked={isSelected(style.id)} className="h-5 w-5" />
                        </div>
                      </div>
                      
                      {/* Badge "Seu estilo" */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary/90 backdrop-blur-sm shadow-md text-xs">
                          ⭐ Seu estilo
                        </Badge>
                      </div>
                      
                      {/* Nome sempre visível embaixo */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                        <p className="font-semibold text-sm text-white drop-shadow-lg">{style.name}</p>
                        <p className="text-xs text-white/80 mt-1">{style.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                ✓ {selected.length} selecionados (Recomendado: 1-3)
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum estilo do perfil. Explore a biblioteca abaixo.
            </p>
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

            {/* Grid de Estilos - IMAGEM COMPLETA ESTILO INSTAGRAM */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto p-2">
              {filteredStyles?.map((style) => (
                <div
                  key={style.id}
                  className={`group cursor-pointer transition-all hover:scale-[1.02] ${
                    isSelected(style.id) ? "ring-4 ring-primary ring-offset-2" : ""
                  }`}
                  onClick={() => toggleStyle(style.id)}
                >
                  {/* IMAGEM OCUPA 100% - Tamanho Instagram */}
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg relative">
                    {style.preview_image_url && !style.preview_image_url.includes('placeholder') ? (
                      <img 
                        src={style.preview_image_url} 
                        alt={style.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback se imagem falhar
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback com gradiente */}
                    {(!style.preview_image_url || style.preview_image_url.includes('placeholder')) && (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                        <p className="text-sm text-center p-4 font-medium">{style.name}</p>
                      </div>
                    )}
                    
                    {/* Checkbox maior e mais visível */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded-md p-1 shadow-md">
                        <Checkbox 
                          checked={isSelected(style.id)} 
                          className="h-5 w-5"
                        />
                      </div>
                    </div>
                    
                    {/* Nome sempre visível embaixo */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                      <p className="font-semibold text-sm text-white drop-shadow-lg">{style.name}</p>
                      {style.category && (
                        <p className="text-xs text-white/80 mt-0.5 capitalize">{style.category}</p>
                      )}
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
          disabled={(selected.length === 0 && (!visualStylePreferences || visualStylePreferences.length === 0)) || selected.length > 3}
        >
          Continuar com {selected.length > 0 ? selected.length : visualStylePreferences?.length || 0} {(selected.length > 0 ? selected.length : visualStylePreferences?.length || 0) === 1 ? "estilo" : "estilos"} →
        </Button>
      </div>
    </div>
  );
};

