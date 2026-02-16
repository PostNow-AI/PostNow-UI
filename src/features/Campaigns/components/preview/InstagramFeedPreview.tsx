// @ts-nocheck
/**
 * Preview do Instagram Feed - Grid 3x3 simulado.
 * Feature #1 em impacto descoberta nas 25 simulações.
 */

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { Grid3x3, Shuffle } from "lucide-react";
import type { CampaignPost } from "../../types";

interface InstagramFeedPreviewProps {
  posts: CampaignPost[];
  onReorganize?: (newOrder: number[]) => void;
}

export const InstagramFeedPreview = ({
  posts,
  onReorganize,
}: InstagramFeedPreviewProps) => {
  const [harmonScore, setHarmonyScore] = useState<number | null>(null);

  // Organizar posts em grid 3x3
  const arrangeInGrid = () => {
    const grid: CampaignPost[][] = [];
    const sortedPosts = [...posts].sort((a, b) => a.sequence_order - b.sequence_order);
    
    for (let i = 0; i < sortedPosts.length; i += 3) {
      grid.push(sortedPosts.slice(i, i + 3));
    }
    
    return grid;
  };

  const grid = arrangeInGrid();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Grid3x3 className="h-5 w-5" />
            Preview do Instagram
          </h3>
          <p className="text-sm text-muted-foreground">
            Como seu perfil ficará com esta campanha
          </p>
        </div>

        {harmonScore !== null && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Harmonia Visual</div>
            <Badge
              variant={harmonScore >= 85 ? "default" : harmonScore >= 70 ? "secondary" : "destructive"}
              className="text-lg px-4 py-1"
            >
              {harmonScore}/100
            </Badge>
          </div>
        )}
      </div>

      {/* Simulação de Feed do Instagram */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-950 rounded-lg shadow-xl overflow-hidden">
          {/* Header do Instagram */}
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="flex-1">
              <div className="font-semibold">@seuperfil</div>
              <div className="text-xs text-muted-foreground">Seu Negócio</div>
            </div>
            <div className="text-2xl">⋯</div>
          </div>

          {/* Grid 3x3 */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-white dark:bg-gray-950">
            {grid.map((row, rowIndex) => (
              row.map((post, colIndex) => (
                <div
                  key={post.id}
                  className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-sm overflow-hidden relative group"
                >
                  {post.post.ideas && post.post.ideas[0]?.image_url ? (
                    <>
                      <img
                        src={post.post.ideas[0].image_url}
                        alt={`Post ${post.sequence_order}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center px-2">
                          <div className="text-xs font-medium mb-1">
                            Post {post.sequence_order}
                          </div>
                          <div className="text-xs">
                            {post.phase_display}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      Post {post.sequence_order}
                    </div>
                  )}
                </div>
              ))
            ))}
          </div>

          {/* Footer com dicas */}
          <div className="p-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Este é um preview de como seu perfil ficará
            </p>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm">
          <Shuffle className="h-4 w-4 mr-2" />
          Reorganizar Posts
        </Button>
        
        <Button variant="outline" size="sm">
          Analisar Harmonia Visual
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        💡 Dica: Um feed harmonioso alterna estilos visuais e mantém coesão de cores
      </p>
    </div>
  );
};

