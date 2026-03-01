/**
 * Scheduled Post Card Component
 *
 * Card displaying a scheduled post with actions.
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseDate } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Instagram,
  Loader2,
  MoreVertical,
  RefreshCw,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import type { ScheduledPostListItem, ScheduledPostStatus } from "../types";

interface ScheduledPostCardProps {
  post: ScheduledPostListItem;
  onCancel?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onPublishNow?: (postId: number) => void;
  onRetry?: (postId: number) => void;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<
  ScheduledPostStatus,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  draft: {
    icon: <Clock className="h-3 w-3" />,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  scheduled: {
    icon: <Calendar className="h-3 w-3" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  publishing: {
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  published: {
    icon: <CheckCircle className="h-3 w-3" />,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  failed: {
    icon: <AlertCircle className="h-3 w-3" />,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  cancelled: {
    icon: <XCircle className="h-3 w-3" />,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
};

export function ScheduledPostCard({
  post,
  onCancel,
  onDelete,
  onPublishNow,
  onRetry,
  isLoading,
}: ScheduledPostCardProps) {
  const statusConfig = STATUS_CONFIG[post.status];
  const thumbnailUrl = post.media_urls?.[0];

  const formattedDate = parseDate(post.scheduled_for).format("DD/MM/YYYY");
  const formattedTime = parseDate(post.scheduled_for).format("HH:mm");

  const canModify = ["draft", "scheduled", "failed"].includes(post.status);
  const canPublishNow = ["draft", "scheduled", "failed"].includes(post.status);
  const canRetry = post.status === "failed";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Thumbnail */}
          <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt="Post thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Instagram className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Account & Status */}
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.profile_picture_url ?? ""} />
                <AvatarFallback>
                  <Instagram className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                @{post.instagram_username}
              </span>
              <Badge
                variant="secondary"
                className={`${statusConfig.bgColor} ${statusConfig.color} gap-1`}
              >
                {statusConfig.icon}
                {post.status_display}
              </Badge>
            </div>

            {/* Caption Preview */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {post.caption_preview}
            </p>

            {/* Schedule Info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formattedTime}
              </span>
              <Badge variant="outline" className="text-xs">
                {post.media_type_display}
              </Badge>
            </div>

            {/* Published Link */}
            {post.instagram_permalink && (
              <a
                href={post.instagram_permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
              >
                Ver no Instagram
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Actions Menu */}
          {canModify && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canPublishNow && onPublishNow && (
                  <DropdownMenuItem onClick={() => onPublishNow(post.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Publicar Agora
                  </DropdownMenuItem>
                )}
                {canRetry && onRetry && (
                  <DropdownMenuItem onClick={() => onRetry(post.id)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </DropdownMenuItem>
                )}
                {post.status === "scheduled" && onCancel && (
                  <DropdownMenuItem onClick={() => onCancel(post.id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(post.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
