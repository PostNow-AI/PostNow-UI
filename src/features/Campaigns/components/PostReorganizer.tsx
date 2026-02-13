// @ts-nocheck
/**
 * Componente para reorganizar posts com Drag & Drop.
 * Usa @dnd-kit para funcionalidade moderna de arrastar.
 */

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import { GripVertical, Save } from "lucide-react";
import type { CampaignPost } from "../types";

interface PostReorganizerProps {
  posts: CampaignPost[];
  onSave: (newOrder: number[]) => void;
  onCancel: () => void;
}

interface SortablePostProps {
  post: CampaignPost;
}

const SortablePost = ({ post }: SortablePostProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={`cursor-move ${isDragging ? 'shadow-2xl ring-2 ring-primary' : ''}`}>
        <CardContent className="p-4 flex items-center gap-3">
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">Post {post.sequence_order}</Badge>
              <span className="text-sm font-medium truncate">
                {post.phase_display || post.phase}
              </span>
            </div>
            
            {post.post?.ideas?.[0]?.content && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {post.post.ideas[0].content.slice(0, 100)}...
              </p>
            )}
          </div>
          
          {post.post?.ideas?.[0]?.image_url && (
            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
              <img
                src={post.post.ideas[0].image_url}
                alt={`Post ${post.sequence_order}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const PostReorganizer = ({ posts, onSave, onCancel }: PostReorganizerProps) => {
  const [items, setItems] = useState(posts);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    // Retornar novos IDs na ordem
    const newOrder = items.map((item) => item.id);
    onSave(newOrder);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reorganizar Posts</h3>
          <p className="text-sm text-muted-foreground">
            Arraste para reordenar. A ordem afeta como aparece no feed.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Ordem
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
          <div className="space-y-2">
            {items.map((post) => (
              <SortablePost key={post.id} post={post} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      <p className="text-xs text-muted-foreground">
        💡 Dica: Posts no topo aparecem primeiro no feed do Instagram
      </p>
    </div>
  );
};

