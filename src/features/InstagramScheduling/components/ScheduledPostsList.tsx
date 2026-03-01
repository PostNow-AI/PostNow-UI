/**
 * Scheduled Posts List Component
 *
 * List of scheduled posts with filtering and actions.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Instagram, Loader2, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useScheduledPostMutations } from "../hooks/useScheduledPostMutations";
import { useScheduledPosts } from "../hooks/useScheduledPosts";
import { useScheduledPostStats } from "../hooks/useScheduledPostStats";
import type { ScheduledPostStatus } from "../types";
import { ScheduledPostCard } from "./ScheduledPostCard";

interface ScheduledPostsListProps {
  onScheduleNew?: () => void;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "scheduled", label: "Agendados" },
  { value: "published", label: "Publicados" },
  { value: "failed", label: "Com Falha" },
  { value: "cancelled", label: "Cancelados" },
];

export function ScheduledPostsList({ onScheduleNew }: ScheduledPostsListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useScheduledPosts({
    status: statusFilter === "all" ? undefined : (statusFilter as ScheduledPostStatus),
  });

  const { data: stats } = useScheduledPostStats();

  const {
    cancelScheduledPost,
    deleteScheduledPost,
    publishNow,
    retryScheduledPost,
    isLoading: isMutating,
  } = useScheduledPostMutations();

  const handleCancel = (postId: number) => {
    if (confirm("Tem certeza que deseja cancelar este post?")) {
      cancelScheduledPost(postId);
    }
  };

  const handleDelete = (postId: number) => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      deleteScheduledPost(postId);
    }
  };

  const handlePublishNow = (postId: number) => {
    if (confirm("Publicar este post agora?")) {
      publishNow(postId);
    }
  };

  const handleRetry = (postId: number) => {
    retryScheduledPost(postId);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Agendados</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {stats.scheduled_future}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  Publicados Hoje
                </span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.published_today}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Pendentes</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">
                  Total Publicados
                </span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total_published}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {onScheduleNew && (
          <Button onClick={onScheduleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Agendar Post
          </Button>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : isError ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Erro ao carregar posts. Tente novamente.
              </p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        ) : posts?.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Instagram className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum post {statusFilter !== "all" ? STATUS_OPTIONS.find(o => o.value === statusFilter)?.label.toLowerCase() : ""} encontrado.
              </p>
              {onScheduleNew && (
                <Button onClick={onScheduleNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agendar Primeiro Post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          posts?.map((post) => (
            <ScheduledPostCard
              key={post.id}
              post={post}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onPublishNow={handlePublishNow}
              onRetry={handleRetry}
              isLoading={isMutating}
            />
          ))
        )}
      </div>
    </div>
  );
}
