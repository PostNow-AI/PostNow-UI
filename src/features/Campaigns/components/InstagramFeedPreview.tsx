// @ts-nocheck
/**
 * Preview do Feed do Instagram - Descoberta #2 das simulações (#1 em impacto, 100% valorizam).
 * Simula como os posts aparecerão no feed do Instagram em grid 3x3.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram } from "lucide-react";
import type { CampaignPost } from "../types";

interface InstagramFeedPreviewProps {
  posts: CampaignPost[];
  campaignName?: string;
}

export const InstagramFeedPreview = ({
  posts,
  campaignName = "Sua Marca",
}: InstagramFeedPreviewProps) => {
  // Pegar apenas os primeiros 9 posts para o grid 3x3
  const gridPosts = posts.slice(0, 9);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header simulando perfil do Instagram */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Instagram className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1">
              <CardTitle className="text-lg">{campaignName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {posts.length} {posts.length === 1 ? "publicação" : "publicações"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid 3x3 dos posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Preview do Feed
            <Badge variant="outline" className="text-xs">
              {gridPosts.length}/9 posts visíveis
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {gridPosts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Instagram className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum post para visualizar ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 bg-black p-1 rounded-lg">
              {gridPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="aspect-square relative group cursor-pointer overflow-hidden rounded-sm"
                >
                  {/* Imagem do post */}
                  {post.post?.ideas?.[0]?.image_url ? (
                    <img
                      src={post.post.ideas[0].image_url}
                      alt={`Post ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Instagram className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  {/* Overlay com informações ao hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs p-2">
                    <Badge variant="outline" className="mb-2 text-white border-white">
                      Post #{post.sequence_order}
                    </Badge>
                    <p className="text-center line-clamp-2">
                      {post.post?.ideas?.[0]?.content?.slice(0, 60) || "Sem conteúdo"}...
                    </p>
                    <p className="text-[10px] text-white/70 mt-2">
                      {post.phase}
                    </p>
                  </div>
                </div>
              ))}

              {/* Placeholders para completar o grid 3x3 */}
              {Array.from({ length: Math.max(0, 9 - gridPosts.length) }).map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="aspect-square bg-gray-100 rounded-sm flex items-center justify-center"
                >
                  <div className="text-gray-400 text-xs text-center">
                    <Instagram className="h-6 w-6 mx-auto mb-1 opacity-30" />
                    <p className="text-[10px]">Post {gridPosts.length + i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info sobre o feed */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="p-4 text-sm text-blue-900 dark:text-blue-100">
          <p className="font-medium mb-1">💡 Dica:</p>
          <p className="text-xs">
            Este é um preview de como seus primeiros 9 posts aparecerão no feed do Instagram.
            Reorganize os posts arrastando-os para criar uma harmonia visual melhor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

