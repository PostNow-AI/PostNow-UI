import { Badge, Card, CardContent, CardHeader } from "@/components/ui";
import { Calendar, Type } from "lucide-react";
import type { DailyPostsResponse } from "../types";

export const AllPostsList = ({
  dailyPostsData,
}: {
  dailyPostsData: DailyPostsResponse;
}) => {
  return (
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
                        {new Date(post.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
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
  );
};
