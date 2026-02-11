# AdminDashboard

Dashboard administrativo para visualização de métricas e analytics da plataforma.

## Estrutura

```
AdminDashboard/
├── components/                    # Componentes visuais
│   ├── funnel/                   # Componentes do funil (SOLID - SRP)
│   │   ├── PhaseHeader.tsx       # Cabeçalho de fase clicável
│   │   ├── StepRow.tsx           # Linha de etapa individual
│   │   ├── PercentageLabel.tsx   # Label de % com posicionamento dinâmico
│   │   └── index.ts              # Barrel export
│   ├── BottomNav.tsx             # Navegação inferior (abas)
│   ├── DashboardError.tsx        # Estado de erro
│   ├── DashboardSkeleton.tsx     # Estado de loading
│   ├── EmailSection.tsx          # Seção de métricas de email
│   ├── EngagementSection.tsx     # Seção de engajamento
│   ├── FunnelSection.tsx         # Seção principal do funil
│   ├── GeneralView.tsx           # Visão geral com métricas
│   ├── HeroMetricCard.tsx        # Card de métrica destacada
│   ├── LoginDetailsSheet.tsx     # Sheet de detalhes de login
│   ├── MetricCard.tsx            # Card de métrica padrão
│   ├── MetricChart.tsx           # Gráfico de timeline
│   ├── MetricDetailView.tsx      # Visão detalhada de métrica
│   ├── PeriodSelector.tsx        # Seletor de período (1/7/30/90/180 dias)
│   ├── PhaseDetailsView.tsx      # Detalhes de uma fase do funil
│   ├── StepDetailsDrawer.tsx     # Drawer de detalhes de etapa
│   ├── SubscriptionDetailsSheet.tsx # Sheet de detalhes de assinatura
│   └── index.ts                  # Barrel export
├── hooks/                        # React Query hooks
│   └── useDashboardMetrics.ts    # Hooks para buscar métricas
├── utils/                        # Funções utilitárias (DRY)
│   ├── funnelUtils.ts            # Cálculos de conversão
│   └── index.ts                  # Barrel export
├── types/                        # TypeScript types
│   └── index.ts                  # Tipos, interfaces e constantes
├── services/                     # (Reservado para futura API service layer)
└── index.tsx                     # Componente principal do dashboard
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

**Para Fases (PHASE_THRESHOLDS):**

| Taxa | Cor | Significado |
|------|-----|-------------|
| ≥90% | Verde | Excelente |
| ≥70% | Amarelo | Atenção |
| <70% | Vermelho | Crítico |

**Para Etapas (STEP_THRESHOLDS):**

| Taxa | Cor | Significado |
|------|-----|-------------|
| ≥95% | Verde | Excelente |
| ≥80% | Amarelo | Atenção |
| <80% | Vermelho | Crítico |

## Métricas Disponíveis

| Métrica | Descrição | Crítica? |
|---------|-----------|----------|
| `subscriptions` | Novas assinaturas | Sim |
| `onboardings` | Onboardings iniciados | Sim |
| `images` | Imagens geradas | Sim |
| `logins` | Logins de usuários | Não |
| `emails-sent` | Emails enviados | Não |
| `emails-opened` | Emails abertos | Não |
| `posts-total` | Total de posts | Não |
| `posts-email` | Posts via email | Não |
| `posts-manual` | Posts manuais | Não |

> **Nota:** Métricas críticas causam `isError=true` se falharem. Métricas não-críticas podem falhar silenciosamente.

## Hooks

### `useDashboardMetric(metric, days)`

Busca uma métrica específica.

```typescript
const { data, isLoading, isError } = useDashboardMetric("subscriptions", 30);
```

### `useAllDashboardMetrics(days)`

Busca todas as métricas em paralelo.

```typescript
const {
  data,        // AllMetricsData - dados de todas as métricas
  isLoading,   // boolean - true apenas no primeiro carregamento
  isError,     // boolean - true se métrica CRÍTICA falhar
  isFetching,  // boolean - true durante qualquer fetch
  refetchAll   // () => void - força recarregamento de todas
} = useAllDashboardMetrics(30);

// Acessando dados
data.subscriptions?.count
data.onboardings?.timeline
```

**Comportamento de erro:**
- Retries: 2 tentativas por métrica (exceto 404)
- `isError` só é `true` se uma métrica **crítica** falhar
- Métricas não-críticas podem falhar sem afetar o dashboard

## Utilitários (funnelUtils.ts)

| Função | Descrição |
|--------|-----------|
| `calcConversionRate(current, previous)` | Taxa de conversão entre valores (0-100) |
| `calcTotalRate(current, total)` | Porcentagem do total (0-100) |
| `getConversionColorClass(rate, thresholds)` | Classe CSS (text-green/yellow/red-300) |
| `buildStepCounts(data)` | Extrai contagens por etapa da API |
| `calcPercentageLabelPosition(rate)` | Posição do label (left/right + valor) |

**Constantes exportadas:**
- `PHASE_THRESHOLDS` - Limiares para fases (90/70)
- `STEP_THRESHOLDS` - Limiares para etapas (95/80)

## Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes do AdminDashboard (128 testes)
npm test -- --run src/features/AdminDashboard
```

### Cobertura de Testes

**Componentes principais:**
- `BottomNav.test.tsx` - Navegação inferior (5 testes)
- `EmailSection.test.tsx` - Seção de email (12 testes)
- `EngagementSection.test.tsx` - Seção de engajamento (8 testes)
- `FunnelSection.test.tsx` - Funil principal (9 testes)
- `GeneralView.test.tsx` - Visão geral (5 testes)
- `MetricCard.test.tsx` - Card de métrica (12 testes)
- `MetricChart.test.tsx` - Gráfico (7 testes)
- `PeriodSelector.test.tsx` - Seletor de período (10 testes)
- `PhaseDetailsView.test.tsx` - Detalhes de fase (7 testes)

**Componentes do funil:**
- `PhaseHeader.test.tsx` - Cabeçalho de fase (9 testes)
- `StepRow.test.tsx` - Linha de etapa (9 testes)
- `PercentageLabel.test.tsx` - Label de % (7 testes)

**Utilitários e hooks:**
- `funnelUtils.test.ts` - Funções utilitárias (15 testes)
- `useDashboardMetrics.test.tsx` - Hooks de métricas (13 testes)

**Total: 128 testes**
