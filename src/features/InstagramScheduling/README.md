# Instagram Scheduling Feature

UI para agendamento de posts no Instagram integrada com o backend PostNow-REST-API.

## Estrutura

```
src/features/InstagramScheduling/
├── types/
│   └── index.ts              # Tipos TypeScript
├── services/
│   └── index.ts              # Service API
├── hooks/
│   ├── index.ts              # Exports
│   ├── useInstagramAccounts.ts
│   ├── useScheduledPosts.ts
│   ├── useScheduledPostMutations.ts
│   └── useScheduledPostStats.ts
├── components/
│   ├── index.ts              # Exports
│   ├── SchedulePostDialog.tsx
│   ├── ScheduledPostsList.tsx
│   ├── ScheduledPostCard.tsx
│   ├── DateTimePicker.tsx
│   └── InstagramAccountSelector.tsx
└── index.ts                  # Barrel export
```

## Componentes

### SchedulePostDialog
Modal para agendar um post no Instagram.

**Props:**
| Prop | Tipo | Descricao |
|------|------|-----------|
| open | boolean | Controla visibilidade |
| onOpenChange | (open: boolean) => void | Callback de mudanca |
| initialCaption | string | Caption pre-preenchido (da IdeaBank) |
| initialImageUrl | string | URL da imagem |
| postIdeaId | number | ID do PostIdea para vinculo |
| onSuccess | () => void | Callback de sucesso |

**Uso:**
```tsx
<SchedulePostDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  initialCaption={idea.content}
  initialImageUrl={idea.image_url}
  postIdeaId={idea.id}
  onSuccess={() => toast.success("Agendado!")}
/>
```

### ScheduledPostsList
Lista de posts agendados com filtros e acoes.

**Props:**
| Prop | Tipo | Descricao |
|------|------|-----------|
| onScheduleNew | () => void | Callback para novo agendamento |

### ScheduledPostCard
Card individual de um post agendado.

**Props:**
| Prop | Tipo | Descricao |
|------|------|-----------|
| post | ScheduledPostListItem | Dados do post |
| onCancel | (id: number) => void | Cancelar agendamento |
| onDelete | (id: number) => void | Excluir post |
| onPublishNow | (id: number) => void | Publicar imediatamente |
| onRetry | (id: number) => void | Retentar publicacao |
| isLoading | boolean | Estado de carregamento |

### DateTimePicker
Seletor de data e hora para agendamento.

**Props:**
| Prop | Tipo | Descricao |
|------|------|-----------|
| value | Date | Data selecionada |
| onChange | (date: Date) => void | Callback de mudanca |
| minDate | Date | Data minima (default: now) |
| hasError | boolean | Estado de erro |
| disabled | boolean | Desabilitado |

### InstagramAccountSelector
Dropdown para selecionar conta Instagram.

**Props:**
| Prop | Tipo | Descricao |
|------|------|-----------|
| accounts | InstagramAccountListItem[] | Lista de contas |
| value | number | ID selecionado |
| onChange | (id: number) => void | Callback de mudanca |
| hasError | boolean | Estado de erro |

## Hooks

### useInstagramAccounts
Gerencia contas Instagram conectadas.

```tsx
const {
  accounts,           // Todas as contas
  connectedAccounts,  // Apenas conectadas
  isLoading,
  disconnect,         // Mutation para desconectar
} = useInstagramAccounts();
```

### useScheduledPosts
Queries para posts agendados.

```tsx
const {
  posts,
  isLoading,
  refetch,
} = useScheduledPosts({ status: 'scheduled' });

const { post } = useScheduledPost(id);
const { events } = useScheduledPostsCalendar({ start, end });
```

### useScheduledPostMutations
Mutations CRUD para posts.

```tsx
const {
  createScheduledPost,
  createScheduledPostAsync,
  updateScheduledPost,
  deleteScheduledPost,
  cancelScheduledPost,
  publishScheduledPostNow,
  retryScheduledPost,
  isCreating,
  isUpdating,
  // ...
} = useScheduledPostMutations();
```

### useScheduledPostStats
Estatisticas de posts.

```tsx
const { stats, isLoading } = useScheduledPostStats();
// stats: { pending, scheduled_future, published_today, failed, total_published }
```

## Integracao com IdeaBank

O `SchedulePostDialog` pode ser aberto a partir do `PostViewDialog` da IdeaBank:

```tsx
// Em PostViewDialog.tsx
<SchedulePostDialog
  open={isScheduleDialogOpen}
  onOpenChange={setIsScheduleDialogOpen}
  initialCaption={currentIdea?.content ?? ""}
  initialImageUrl={currentIdea?.image_url ?? undefined}
  postIdeaId={currentIdea?.id}
/>
```

## Rota

A feature esta disponivel em `/scheduled-posts`:

```tsx
// Em App.tsx
<Route path="/scheduled-posts" element={<ScheduledPostsPage />} />
```

## Dependencias

- `@radix-ui/react-dropdown-menu` - Menu dropdown
- `react-query` - Gerenciamento de estado server
- `sonner` - Toast notifications
- `lucide-react` - Icones

## Validacoes

| Campo | Validacao |
|-------|-----------|
| Caption | Max 2200 caracteres |
| Scheduled For | Deve ser no futuro |
| Media URLs | Pelo menos 1 URL |
| Carousel | Minimo 2 items |
| Instagram Account | Deve estar conectada |

## Estados de Post

| Status | Descricao | Acoes Disponiveis |
|--------|-----------|-------------------|
| draft | Rascunho | Editar, Publicar, Excluir |
| scheduled | Agendado | Editar, Cancelar, Publicar Agora |
| publishing | Em publicacao | Nenhuma |
| published | Publicado | Ver no Instagram |
| failed | Falhou | Retentar, Editar, Excluir |
| cancelled | Cancelado | Excluir |

## Tratamento de Erros

- Erros de validacao mostram mensagens inline
- Erros de API mostram toast de erro
- HTML de IdeaBank e sanitizado automaticamente

## Proximos Passos

1. Adicionar testes unitarios
2. Implementar optimistic updates
3. Adicionar a11y (aria-labels)
4. Implementar i18n
