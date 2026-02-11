# AdminDashboard

Dashboard administrativo para visualização de métricas e analytics da plataforma.

## Estrutura

```
AdminDashboard/
├── components/           # Componentes visuais
│   ├── funnel/          # Componentes do funil de onboarding
│   │   ├── PhaseHeader.tsx      # Cabeçalho de fase (clicável)
│   │   ├── StepRow.tsx          # Linha de etapa individual
│   │   ├── PercentageLabel.tsx  # Label de porcentagem animado
│   │   └── index.ts             # Barrel export
│   ├── FunnelSection.tsx        # Seção principal do funil
│   ├── GeneralView.tsx          # Visão geral com métricas
│   ├── BottomNav.tsx            # Navegação inferior
│   └── ...
├── hooks/               # React Query hooks
│   └── useDashboardMetrics.ts   # Hooks para buscar métricas
├── utils/               # Funções utilitárias
│   └── funnelUtils.ts           # Cálculos de conversão (DRY)
├── types/               # TypeScript types
│   └── index.ts                 # Tipos e constantes
└── index.tsx            # Componente principal
```

## Funil de Onboarding 2.0

O funil rastreia **20 etapas** organizadas em **5 fases**:

| Fase | Nome | Etapas | Cor |
|------|------|--------|-----|
| 1 | Boas-vindas | 1-3 (Welcome, Nome, Contato) | Azul |
| 2 | Seu Negócio | 4-8 (Nicho, Descrição, Propósito, Personalidade, Produtos) | Roxo |
| 3 | Seu Público | 9-12 (Público-Alvo, Interesses, Localização, Concorrentes) | Índigo |
| 4 | Identidade Visual | 13-17 (Tom, Estilo, Logo, Cores, Preview) | Rosa |
| 5 | Autenticação | 18-20 (Perfil Pronto, Cadastro, Pagamento) | Verde |

### Visualização

```
┌─────────────────────────────────────┐
│ ████████████████████ 100   88%      │  ← Fase 1: Boas-vindas
│           ↓ 96%                     │  ← Taxa de conversão para fase 2
│ ███████████████████░ 96    84%      │  ← Fase 2: Seu Negócio
│           ↓ 90%                     │
│ █████████████████░░░ 87    76%      │  ← Fase 3: Seu Público
│           ...                       │
└─────────────────────────────────────┘
```

### Códigos de Cor (Conversão)

| Taxa | Cor | Significado |
|------|-----|-------------|
| ≥90% | Verde | Excelente |
| ≥70% | Amarelo | Atenção |
| <70% | Vermelho | Crítico |

## Métricas Disponíveis

| Métrica | Descrição |
|---------|-----------|
| `subscriptions` | Novas assinaturas |
| `onboardings` | Onboardings iniciados |
| `logins` | Logins de usuários |
| `images` | Imagens geradas |
| `emails-sent` | Emails enviados |
| `emails-opened` | Emails abertos |
| `posts-total` | Total de posts |
| `posts-email` | Posts via email |
| `posts-manual` | Posts manuais |

## Hooks

### `useDashboardMetric(metric, days)`

Busca uma métrica específica.

```typescript
const { data, isLoading, isError } = useDashboardMetric("subscriptions", 30);
```

### `useAllDashboardMetrics(days)`

Busca todas as métricas em paralelo.

```typescript
const { data, isLoading, isError, refetchAll } = useAllDashboardMetrics(30);
// data.subscriptions, data.onboardings, etc.
```

## Utilitários (funnelUtils.ts)

| Função | Descrição |
|--------|-----------|
| `calcConversionRate(current, previous)` | Taxa de conversão entre valores |
| `calcTotalRate(current, total)` | Porcentagem do total |
| `getConversionColorClass(rate)` | Classe CSS baseada na taxa |
| `buildStepCounts(data)` | Extrai contagens por etapa |
| `calcPercentageLabelPosition(rate)` | Posição do label de % |

## Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes do AdminDashboard
npm test -- --run src/features/AdminDashboard
```

### Cobertura

- `FunnelSection.test.tsx` - Testes do funil
- `PhaseHeader.test.tsx` - Testes do cabeçalho de fase
- `StepRow.test.tsx` - Testes da linha de etapa
- `funnelUtils.test.ts` - Testes dos utilitários
- `useDashboardMetrics.test.tsx` - Testes dos hooks
