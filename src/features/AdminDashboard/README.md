# AdminDashboard

Dashboard administrativo para visualização de métricas e analytics da plataforma.

## Quick Start

```tsx
// 1. Importar o componente
import { AdminDashboard } from "@/features/AdminDashboard";

// 2. Usar na página (não requer props)
export const AdminDashboardPage = () => {
  return <AdminDashboard />;
};
```

**Dependências obrigatórias:**
- `@tanstack/react-query` - Gerenciamento de estado e cache
- `lucide-react` - Ícones
- `recharts` - Gráficos

## Navegação

O dashboard possui **4 abas** de navegação (bottom nav):

| Aba | Componente | Descrição |
|-----|------------|-----------|
| **Geral** | `MetricDetailView` | Gráfico da métrica selecionada com swipe |
| **Funil** | `FunnelSection` | Funil de onboarding com 5 fases |
| **Engaj** | `EngagementSection` | Métricas de engajamento (posts, imagens) |
| **Email** | `EmailSection` | Métricas de email (enviados, abertos) |

## Design

- **Mobile-first**: Layout otimizado para telas pequenas
- **Full-screen**: Cada aba ocupa a tela inteira (sem scroll)
- **Touch-friendly**: Botões mínimo 48x48px (usamos 56px)
- **Swipe navigation**: Deslize entre métricas na aba Geral
- **Bottom nav**: Navegação na "zona verde" (fácil alcance com polegar)

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

## Tipos Principais (types/index.ts)

### Períodos Disponíveis

```typescript
type PeriodDays = 1 | 7 | 30 | 90 | 180;
```

| Valor | Descrição |
|-------|-----------|
| 1 | Últimas 24 horas |
| 7 | Última semana |
| 30 | Último mês |
| 90 | Último trimestre |
| 180 | Último semestre |

### Estrutura de Resposta da API

```typescript
interface DashboardMetric {
  count: number;           // Total no período
  timeline: TimelinePoint[]; // Dados para gráfico
  start_date: string;      // Início do período
  end_date: string;        // Fim do período
  metric_name: string;     // Nome da métrica
  period_days: number;     // Dias do período
  note?: string;           // Nota opcional (ex: "Excludes admin users")
}

interface TimelinePoint {
  date: string;  // "YYYY-MM-DD"
  count: number;
}
```

### Constantes do Funil

```typescript
// Configuração das 5 fases (importar de types/index.ts)
import { FUNNEL_PHASES, STEP_NAMES_PT } from './types';

FUNNEL_PHASES[0].name      // "Boas-vindas"
FUNNEL_PHASES[0].steps     // [1, 2, 3]
FUNNEL_PHASES[0].color     // "bg-blue-500"

STEP_NAMES_PT[1]           // "Boas-vindas"
STEP_NAMES_PT[4]           // "Nicho"
```

## API Backend

O dashboard consome dados do serviço `dashboardApiService` em `@/lib/dashboard-api`.

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/audit/dashboard/{metric}/` | Busca métrica específica |
| GET | `/api/v1/audit/dashboard/subscriptions/details/` | Detalhes de assinaturas |
| GET | `/api/v1/audit/dashboard/logins/details/` | Detalhes de logins |
| GET | `/api/v1/audit/dashboard/onboarding-funnel/` | Dados do funil |
| GET | `/api/v1/audit/dashboard/onboarding-step/{step}/` | Detalhes de etapa |

**Query params comuns:** `?days=30` (1, 7, 30, 90, 180)

### Cache

- **Stale time:** 5 minutos (`STALE_TIME = 5 * 60 * 1000`)
- **Retries:** 2 tentativas (exceto 404)
- **Parallel fetching:** Todas as métricas são buscadas em paralelo

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

**Componentes COM testes (14 arquivos, 128 testes):**

| Componente | Testes | Arquivo |
|------------|--------|---------|
| BottomNav | 5 | `BottomNav.test.tsx` |
| EmailSection | 12 | `EmailSection.test.tsx` |
| EngagementSection | 8 | `EngagementSection.test.tsx` |
| FunnelSection | 9 | `FunnelSection.test.tsx` |
| GeneralView | 5 | `GeneralView.test.tsx` |
| MetricCard | 12 | `MetricCard.test.tsx` |
| MetricChart | 7 | `MetricChart.test.tsx` |
| PeriodSelector | 10 | `PeriodSelector.test.tsx` |
| PhaseDetailsView | 7 | `PhaseDetailsView.test.tsx` |
| PhaseHeader | 9 | `funnel/PhaseHeader.test.tsx` |
| StepRow | 9 | `funnel/StepRow.test.tsx` |
| PercentageLabel | 7 | `funnel/PercentageLabel.test.tsx` |
| funnelUtils | 15 | `utils/funnelUtils.test.ts` |
| useDashboardMetrics | 13 | `hooks/useDashboardMetrics.test.tsx` |

**Componentes SEM testes (7 arquivos):**

| Componente | Motivo |
|------------|--------|
| DashboardError | Componente simples de UI |
| DashboardSkeleton | Componente simples de loading |
| HeroMetricCard | Wrapper de MetricCard |
| LoginDetailsSheet | Sheet de drill-down |
| MetricDetailView | View de detalhes |
| StepDetailsDrawer | Drawer de detalhes |
| SubscriptionDetailsSheet | Sheet de drill-down |

> **Nota:** Componentes sem testes são principalmente UI simples ou wrappers. Testes futuros devem priorizar `MetricDetailView` e `StepDetailsDrawer` por terem lógica mais complexa.

**Total: 128 testes | Cobertura: 14/21 componentes (67%)**
