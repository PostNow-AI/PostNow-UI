import { Calendar, Type } from "lucide-react";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@/components/ui";
import { Container } from "@/components/ui/container";
import { useDailyPosts } from "./hooks/useDailyPosts";

export const AllDailyPosts = () => {
  const { data: dailyPostsData, isLoading, error } = useDailyPosts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <div className="text-muted-foreground">
            <p>Erro ao carregar posts diários</p>
            <p className="text-sm mt-2">Tente novamente mais tarde</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (
    !dailyPostsData ||
    !dailyPostsData.users_with_posts ||
    dailyPostsData.users_with_posts.length === 0
  ) {
    return (
      <div className="mt-30 flex-col items-center justify-center text-center p-4">
        <Type className="h-12 w-12 mx-auto text-primary-light mb-4" />
        <p className="text-xl font-bold mb-2">Nenhum post diário encontrado</p>
        <p className="text-sm text-slate-400 mb-6">Não há posts gerados hoje</p>
      </div>
    );
  }

  const header = () => {
    return (
      <div>
        <p className="text-sm text-muted-foreground">
          Total: {dailyPostsData.users_with_posts.length} posts
        </p>
        <p className="text-sm text-muted-foreground">
          Usuários: {dailyPostsData.user_amount} usuários
        </p>
        <p className="text-sm text-muted-foreground">
          Expectativa de posts automáticos gerados:{" "}
          {dailyPostsData.automatic_expected_posts_amount} posts
        </p>
        <p className="text-sm text-muted-foreground">
          Qtde. real de posts automáticos gerados:{" "}
          {dailyPostsData.actual_automatic_posts_amount} posts
        </p>
      </div>
    );
  };

  return (
    <Container
      headerTitle={
        "Posts Diários - " + dailyPostsData.date.split("-").reverse().join("/")
      }
      headerDescription={header()}
    >
      <div className="space-y-8">
        {dailyPostsData.users_with_posts.map((user) => (
          <div key={user.id} className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm text-muted-foreground">
                @{user.username} • {user.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.posts.length} posts gerados
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.posts.map((post) => (
                <Card
                  key={post.id}
                  className="transition-colors rounded-lg bg-background p-0 hover:bg-muted/50 relative flex flex-col h-full"
                >
                  <div className="w-full h-full p-0 max-h-[360px] rounded-t-lg overflow-hidden bg-muted">
                    {post.ideas &&
                    post.ideas.length > 0 &&
                    post.ideas[0]?.image_url ? (
                      <img
                        src={post.ideas[0].image_url}
                        alt="Post image"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-orange-100 to-yellow-100">
                        <div className="text-center text-muted-foreground">
                          <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Imagem não disponível</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 absolute top-4 right-4">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${
                        post.type === "feed"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : post.type === "live"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : post.type === "reels"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : post.type === "post"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : post.type === "carrossel"
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : post.type === "story"
                                    ? "bg-pink-50 text-pink-700 border-pink-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {post.type === "Post" ? "Feed" : post.type}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold line-clamp-2">{post.name}</h3>
                  </CardHeader>
                  {post.ideas && post.ideas.length > 0 && (
                    <CardContent className="pt-0 pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-8 text-ellipsis">
                        {(() => {
                          const content =
                            post.ideas[post.ideas.length - 1].content;
                          // Strip HTML tags
                          const strippedContent = content
                            .replace(/<[^>]*>/g, "")
                            .trim();
                          return strippedContent.length > 200
                            ? `${strippedContent.substring(0, 200)}...`
                            : strippedContent;
                        })()}
                      </p>
                      <div className="text-muted-foreground flex items-center text-xs gap-2 mt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.created_at).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
