import { Badge, Button, Card, Loader } from "@/components";
import type { Post } from "@/features/IdeaBank/types";
import { Calendar, Eye, Trash2, Type } from "lucide-react";

export const PostItem = ({
  post,
  handlePostClick,
  handleDeletePost,
  isDeleting,
}: {
  post: Post;
  handlePostClick: (post: Post) => void;
  handleDeletePost: (post: Post) => void;
  isDeleting: boolean;
}) => (
  <Card
    key={post.id}
    className={`transition-colors rounded-lg bg-background p-0 hover:bg-muted/50 relative flex flex-col h-full`}
  >
    {/* Post Image or Placeholder */}
    {post?.ideas && post.ideas.length > 0 && post.ideas[0]?.image_url ? (
      <div className="w-full h-full p-0 max-h-[360px] rounded-t-lg overflow-hidden bg-muted flex items-center justify-center">
        <img
          src={post.ideas[0].image_url}
          alt="Post image"
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="text-center text-muted-foreground">
          <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Imagem não disponível</p>
        </div>
      </div>
    )}
    {/* Post Details */}
    <div className="flex  gap-2 absolute top-4 right-4">
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
    <h3 className="text-lg font-semibold px-4">{post.name}</h3>
    {post?.ideas && post.ideas.length > 0 && (
      <p className="text-sm px-4 text-muted-foreground">
        {(() => {
          const content = post.ideas[post.ideas.length - 1].content;
          // Strip HTML tags
          const strippedContent = content.replace(/<[^>]*>/g, "").trim();
          return strippedContent.length > 100
            ? `${strippedContent.substring(0, 200)}...`
            : strippedContent;
        })()}
      </p>
    )}
    <div className="flex flex-col px-4 pb-4 mt-auto gap-4">
      <div className="text-muted-foreground flex items-center text-xs gap-2">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {post?.ideas?.[post?.ideas?.length - 1]?.updated_at
            ? new Date(
                post.ideas[post.ideas.length - 1].updated_at
              ).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Data não disponível"}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => handlePostClick(post)}
        >
          <Eye className="h-4 w-4" />
          Visualizar
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleDeletePost(post)}
          disabled={isDeleting}
          title="Excluir post"
        >
          {isDeleting ? (
            <Loader />
          ) : (
            <Trash2 className="text-destructive h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  </Card>
);
