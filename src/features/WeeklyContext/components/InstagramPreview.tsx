import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

interface InstagramPreviewProps {
  content: string;
  imageUrl?: string;
  profileName: string;
  profileImage?: string;
}

export const InstagramPreview = ({
  content,
  imageUrl,
  profileName,
  profileImage,
}: InstagramPreviewProps) => {
  // Extract hashtags and clean content for preview
  const extractHashtags = (text: string) => {
    const hashtagRegex = /#[\w\u00C0-\u00FF]+/g;
    return text.match(hashtagRegex) || [];
  };

  const cleanContent = content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\n\n+/g, "\n\n") // Normalize line breaks
    .substring(0, 200); // Limit preview

  const hashtags = extractHashtags(content);

  return (
    <div className="flex justify-center py-4">
      <div className="transform scale-75 sm:scale-85 transition-transform">
        <div className="max-w-sm bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profileName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-gray-600">
                  {profileName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {profileName}
          </span>
        </div>
        <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="bg-gray-100 dark:bg-gray-800 aspect-square">
          <img
            src={imageUrl}
            alt="Post preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* No Image State */}
      {!imageUrl && (
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 aspect-square flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sem imagem
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Ative "Gerar imagem" para criar uma
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 text-gray-900 dark:text-gray-100 cursor-pointer hover:text-red-500 transition-colors" />
            <MessageCircle className="h-6 w-6 text-gray-900 dark:text-gray-100 cursor-pointer" />
            <Send className="h-6 w-6 text-gray-900 dark:text-gray-100 cursor-pointer" />
          </div>
          <Bookmark className="h-6 w-6 text-gray-900 dark:text-gray-100 cursor-pointer" />
        </div>

        {/* Likes */}
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Prévia do engajamento
        </p>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {profileName}
          </span>{" "}
          <span className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {cleanContent}
            {content.length > 200 && "..."}
          </span>
        </div>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hashtags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="text-xs text-blue-600 dark:text-blue-400"
              >
                {tag}
              </span>
            ))}
            {hashtags.length > 5 && (
              <span className="text-xs text-gray-500">
                +{hashtags.length - 5} mais
              </span>
            )}
          </div>
        )}

        {/* Time */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Agora mesmo
        </p>
      </div>
    </div>
      </div>
    </div>
  );
};

