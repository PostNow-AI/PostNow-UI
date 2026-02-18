# Onboarding 2.1 - Documentação Completa

## Visão Geral

O Onboarding 2.1 é um fluxo de cadastro gamificado com **14 steps** organizados em **3 fases**. O objetivo é coletar informações do negócio do usuário de forma progressiva e engajante, culminando na criação de conta e assinatura.

### Características Principais
- **Micro-steps**: Cada tela coleta uma informação específica
- **Persistência local**: Dados salvos no localStorage com expiração de 24h
- **Gamificação**: Transições de fase, celebrações e preview progressivo
- **Lazy loading**: Steps carregados sob demanda para performance
- **Acessibilidade**: Focus trap, suporte a screen readers e navegação por teclado
- **Tracking**: Analytics de funil para cada step
- **Testes**: 598 testes unitários + 15 testes E2E

### Score de Qualidade: 8.4/10

| Categoria | Score |
|-----------|-------|
| Arquitetura & Organização | 8.5/10 |
| Testes | 9/10 |
| Segurança | 8/10 |
| Performance | 8/10 |
| Acessibilidade | 8.5/10 |
| Manutenibilidade | 8/10 |
| UX/UI | 9/10 |

---

## Arquitetura

```
src/features/Auth/Onboarding/
├── OnboardingNew.tsx              # Componente principal (orquestrador)
├── __tests__/
│   └── OnboardingNew.test.tsx     # Testes do orquestrador
├── components/
│   └── new/
│       ├── MicroStepLayout.tsx        # Layout padrão dos steps
│       ├── PhaseTransition.tsx        # Tela de transição entre fases
│       ├── ProgressBarWithPhases.tsx  # Barra de progresso com checkmarks
│       ├── OnboardingPreview.tsx      # Preview do perfil sendo construído
│       ├── StepSkeleton.tsx           # Skeleton loading
│       ├── SelectableCards.tsx        # Cards de seleção única/múltipla
│       ├── SelectableChips.tsx        # Chips de seleção
│       ├── ColorPicker.tsx            # Seletor de cores
│       ├── AuthProgressIndicator.tsx  # Indicador de progresso auth
│       ├── BackButton.tsx             # Botão voltar reutilizável
│       ├── ThisOrThatCard.tsx         # Card de comparação A/B
│       ├── PaywallFlow.tsx            # Fluxo de paywall
│       ├── illustrations/             # SVGs extraídos
│       │   ├── PersonIllustrations.tsx   # Silhuetas de pessoas
│       │   ├── SceneIllustrations.tsx    # Cenas de background
│       │   └── index.ts
│       ├── steps/                     # 17 step components
│       │   ├── index.ts               # Exports síncronos
│       │   ├── index.lazy.ts          # Exports lazy
│       │   └── __tests__/             # Testes dos steps
│       └── __tests__/                 # Testes dos componentes
├── hooks/
│   ├── useOnboardingStorage.ts        # Persistência no localStorage
│   ├── useOnboardingTracking.ts       # Analytics de funil
│   ├── useOnboardingNavigation.ts     # Navegação entre steps
│   ├── useOnboardingSync.ts           # Sincronização com API
│   ├── useOnboardingCheckout.ts       # Checkout Stripe
│   ├── useCelebration.ts              # Confetti animations
│   ├── useOnboardingA11y.tsx          # Acessibilidade
│   ├── useOnboardingPreviewData.ts    # Dados reativos do preview
│   ├── usePreviewIdeas.ts             # Ideias de conteúdo para preview
│   ├── useABTest.ts                   # Experimentos A/B
│   ├── useVisualStylePreferences.ts   # Estilos visuais da API
│   └── __tests__/                     # Testes dos hooks
├── utils/
│   ├── audienceUtils.ts               # Parsing/formatação de audiência
│   ├── labelUtils.ts                  # Mapeamento de labels
│   └── __tests__/                     # Testes dos utils
├── services/
│   └── index.ts                       # API calls
└── constants/
    ├── onboardingSchema.ts            # Zod schemas
    └── personalityQuizData.ts         # Dados do quiz de personalidade
```

---

## Fluxo de Steps

### Fase 1: Negócio (Steps 1-4)
| Step | Componente | Descrição | Campo |
|------|------------|-----------|-------|
| 1 | `WelcomeStep` | Boas-vindas + opção de login | - |
| 2 | `BusinessNameStep` | Nome do negócio | `business_name` |
| 3 | `NicheStep` | Nicho de atuação | `specialization` |
| 4 | `OfferStep` | O que oferece/vende | `business_description` |

### Fase 2: Público (Steps 5-8)
| Step | Componente | Descrição | Campo |
|------|------------|-----------|-------|
| 5 | `PersonalityStep` | Personalidade da marca | `brand_personality[]` |
| 6 | `TargetAudienceStep` | Público-alvo (gênero, idade, classe) | `target_audience` (JSON) |
| 7 | `InterestsStep` | Interesses do público | `target_interests[]` |
| 8 | `LocationStep` | Localização do negócio | `business_location` |

### Fase 3: Marca (Steps 9-12)
| Step | Componente | Descrição | Campo |
|------|------------|-----------|-------|
| 9 | `VoiceToneStep` | Tom de voz | `voice_tone` |
| 10 | `VisualStyleStep` | Estilos visuais preferidos | `visual_style_ids[]` |
| 11 | `LogoStep` | Upload de logo (máx 500KB) | `logo`, `suggested_colors[]` |
| 12 | `ColorsStep` | Paleta de cores | `colors[]` |

### Finalização (Steps 13-14 + Auth)
| Step | Componente | Descrição |
|------|------------|-----------|
| 13 | `ProfileReadyStep` | Resumo do perfil criado |
| 14 | `PreviewStep` | Preview de ideias de conteúdo |
| - | `SignupStep` | Criação de conta |
| - | `LoginStep` | Login (alternativo) |
| - | `PaywallStep` | Seleção de plano e checkout |

---

## Estrutura de Dados

### OnboardingTempData (localStorage)

```typescript
interface OnboardingTempData {
  // Fase 1: Negócio
  business_name: string;
  business_phone: string;
  business_instagram_handle: string;
  business_website: string;
  specialization: string;
  business_description: string;
  business_purpose: string;
  brand_personality: string[];
  products_services: string;

  // Fase 2: Público
  target_audience: string;           // JSON stringificado
  target_interests: string[];
  business_location: string;
  main_competitors: string;
  reference_profiles: string;

  // Fase 3: Marca
  voice_tone: string;
  visual_style_ids: string[];
  colors: string[];                  // 5 cores hex
  logo: string;                      // URL ou base64 (máx 500KB)
  suggested_colors: string[];        // Cores extraídas do logo

  // Metadados
  current_step: number;
  completed_at?: string;
  expires_at: string;
}
```

### Formato de target_audience (JSON)

```json
{
  "gender": ["mulheres", "homens"],
  "ageRange": ["25-34", "35-44"],
  "incomeLevel": ["classe-a", "classe-b"]
}
```

**Valores possíveis:**
- `gender`: `mulheres`, `homens`, `todos`
- `ageRange`: `18-24`, `25-34`, `35-44`, `45-54`, `55+`, `todas`
- `incomeLevel`: `classe-a`, `classe-b`, `classe-c`, `todas`

---

## Hooks

### useOnboardingStorage
Gerencia persistência dos dados no localStorage com expiração de 24h.

```typescript
const {
  data,                    // OnboardingTempData atual
  saveData,                // Salva dados parciais (merge)
  setCurrentStep,          // Navega para step
  markAsCompleted,         // Marca onboarding como completo
  clearData,               // Limpa todos os dados
  initializeWithData,      // Inicializa com dados (modo edição)
  getStep1Payload,         // Payload formatado para API step 1
  getStep2Payload,         // Payload formatado para API step 2
  isLoaded,                // Dados carregados do localStorage
  isCompleted,             // Onboarding foi completado
} = useOnboardingStorage();
```

### useOnboardingNavigation
Gerencia navegação entre steps com validação.

```typescript
/**
 * Hook para navegação no fluxo de onboarding
 * @description Gerencia a navegação entre steps, incluindo transições de fase,
 * validação de steps e controle de direção (next/back)
 */
const {
  goToNextStep,     // Avança para próximo step
  goToPrevStep,     // Volta para step anterior
  goToStep,         // Vai para step específico
  canGoBack,        // Se pode voltar
  canGoNext,        // Se pode avançar
} = useOnboardingNavigation(currentStep, totalSteps);
```

### useOnboardingSync
Sincroniza dados do onboarding com a API.

```typescript
/**
 * Hook para sincronização de dados do onboarding com o backend
 * @description Gerencia o envio de dados em dois passos (step1 e step2),
 * incluindo retry automático e tratamento de erros
 */
const {
  syncStep1,        // Envia dados da fase 1-2
  syncStep2,        // Envia dados da fase 3
  isSyncing,        // Se está sincronizando
  syncError,        // Erro da última sincronização
} = useOnboardingSync();
```

### useOnboardingCheckout
Gerencia o fluxo de checkout com Stripe.

```typescript
/**
 * Hook para gerenciar o checkout do onboarding via Stripe
 * @description Cria sessões de checkout, valida URLs de redirect
 * e gerencia o estado de loading/erro
 */
const {
  createCheckout,   // Cria sessão de checkout
  isLoading,        // Se está criando checkout
  error,            // Erro do checkout
} = useOnboardingCheckout();
```

**Segurança:** Valida URLs de redirect com `isValidRedirectPath()` antes de redirecionar.

### useOnboardingTracking
Rastreia progresso do usuário para analytics de funil.

```typescript
const {
  trackStep,           // Rastreia visita ou conclusão
  trackStepVisit,      // Rastreia visita a um step
  trackStepComplete,   // Rastreia conclusão de um step
  clearTracking,       // Limpa tracking (após conclusão)
  getSessionId,        // ID da sessão atual
  sessionId,           // ID da sessão
} = useOnboardingTracking();
```

**Endpoint:** `POST /api/v1/creator-profile/onboarding/track/`

### useCelebration
Dispara animações de confetti em momentos de celebração.

```typescript
/**
 * Hook para disparar celebrações com confetti
 * @description Gerencia animações de confetti com diferentes intensidades,
 * respeitando preferências de reduced-motion do sistema
 */
const {
  celebrate,         // Celebra com intensidade configurável
  celebrateSubtle,   // 15 partículas (transições de fase)
  celebrateMedium,   // 30 partículas + burst
  celebrateFull,     // Celebração completa (ProfileReady)
} = useCelebration();
```

**Momentos de celebração:**
| Momento | Intensidade |
|---------|-------------|
| Step 13 (Profile Ready) | Full |

### useOnboardingA11y
Gerencia acessibilidade (screen readers, foco).

```typescript
const {
  announce,              // Anuncia texto para screen readers
  getProgressBarProps,   // Props de acessibilidade para barra
} = useOnboardingA11y(currentStep);
```

### useOnboardingPreviewData
Fornece dados reativos para o preview (polling 300ms).

```typescript
const data = useOnboardingPreviewData();
// Retorna subset de OnboardingTempData para preview
```

---

## Utils

### audienceUtils.ts
Funções para parsing e formatação de dados de audiência.

```typescript
// Parse JSON de audiência
parseAudienceJson(json: string): ParsedAudience | null

// Converte para string legível (API)
// "Mulheres, de 25-34 anos, Classe A e Classe B"
audienceJsonToString(json: string): string

// Versão resumida para display
// "Mulheres, 25-34 anos"
audienceToDisplayString(json: string): string

// Extrai apenas classe social
// "Classe A, Classe B"
audienceIncomeToString(json: string): string | null

// Formato compacto
// "Todos, 25-34, Classe A/B"
audienceToCompactString(json: string): string
```

### labelUtils.ts
Mapeamento de IDs para labels de exibição.

```typescript
// Mapeamentos
NICHE_LABELS: Record<string, string>
VOICE_TONE_LABELS: Record<string, string>

// Funções (case-insensitive)
getNicheLabel(id: string): string    // "saude" → "Saúde & Bem-estar"
getVoiceToneLabel(id: string): string // "casual" → "Casual e Amigável"
```

**Nichos disponíveis:**
| ID | Label |
|----|-------|
| saude | Saúde & Bem-estar |
| beleza | Beleza & Estética |
| educacao | Educação |
| moda | Moda & Lifestyle |
| alimentacao | Alimentação |
| servicos | Serviços |
| pet | Pet |
| outro | Outro |

**Tons de voz:**
| ID | Label |
|----|-------|
| formal | Formal e Profissional |
| casual | Casual e Amigável |
| inspirador | Inspirador e Motivacional |
| educativo | Educativo e Didático |
| divertido | Descontraído e Engraçado |
| autoridade | Autoridade no Assunto |

---

## Componentes Principais

### MicroStepLayout
Layout padrão para todos os steps do onboarding com focus trap integrado.

```tsx
/**
 * Layout padrão para micro-steps do onboarding
 * @description Fornece estrutura consistente com header, progress bar,
 * navegação e focus trap para acessibilidade
 */
interface MicroStepLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  titleRight?: ReactNode;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  isValid: boolean;
  isLoading?: boolean;
  nextLabel?: string;        // Default: "Continuar"
  showBack?: boolean;        // Default: true
  showPhases?: boolean;      // Default: true
  preview?: ReactNode;       // Preview customizado no header
  className?: string;
}
```

**Atalhos de teclado:**
- `Ctrl/Cmd + Enter`: Avançar (se válido)
- `Escape`: Voltar
- `Tab`: Cicla entre elementos focáveis (focus trap)

**Acessibilidade:**
- Focus trap mantém foco dentro do step
- Auto-foco no primeiro elemento interativo
- Anúncios para screen readers

### PhaseTransition
Tela de transição exibida ao completar cada fase.

```tsx
interface PhaseTransitionProps {
  phase: "negocio" | "publico" | "marca";
  data: OnboardingTempData;
  onComplete: () => void;
  autoAdvanceMs?: number;    // Default: 3000
}
```

**Comportamento:**
- Auto-avança após 3 segundos
- Clique/toque para avançar imediatamente
- Mostra resumo dos dados coletados na fase
- Exibe cores na fase "marca"

### ProgressBarWithPhases
Barra de progresso com marcadores de fase e checkmarks.

```tsx
interface ProgressBarWithPhasesProps {
  currentStep: number;
  totalSteps: number;
  showPhaseNames?: boolean;  // Default: true
  className?: string;
}
```

**Fases e posições:**
| Fase | Steps | Posição |
|------|-------|---------|
| Negócio | 1-4 | 28% |
| Público | 5-8 | 57% |
| Marca | 9-12 | 85% |

### Illustrations (SVGs Extraídos)
SVGs extraídos para arquivos separados para melhor manutenibilidade.

```tsx
// PersonIllustrations.tsx
export const SKIN: Record<string, string>  // Tons de pele
export const AGE_COLORS: Record<string, string>  // Cores por faixa etária
export const PersonSilhouette: FC<Props>
export const FemalePerson: FC<Props>
export const MalePerson: FC<Props>

// SceneIllustrations.tsx
export const LobbyScene: FC
export const CafeScene: FC
export const ParkScene: FC
export const StreetScene: FC
export const NeutralScene: FC
export const SceneBackground: FC<{ scene: string }>
```

---

## Segurança

### Validação de URLs de Redirect
Todas as URLs de redirect do Stripe são validadas antes do redirecionamento.

```typescript
// src/lib/auth.ts
export function isValidRedirectPath(path: string): boolean {
  const allowedPaths = [
    '/payment/success',
    '/payment/cancel',
    '/dashboard',
    '/onboarding',
  ];

  // Previne open redirect attacks
  if (path.startsWith('//') || path.includes('://')) {
    return false;
  }

  return allowedPaths.some(allowed => path.startsWith(allowed));
}
```

### Limite de Upload de Logo
Logo limitado a 500KB para prevenir DoS e melhorar performance.

```typescript
// LogoStep.tsx
const MAX_LOGO_SIZE = 500 * 1024; // 500KB

if (file.size > MAX_LOGO_SIZE) {
  setError("O arquivo deve ter no máximo 500KB");
  return;
}
```

### Cache de Validação de Email
Cache local para evitar chamadas repetidas à API de validação.

```typescript
// SignupStep.tsx
const emailValidationCache = useRef<Map<string, {
  available: boolean;
  message: string
}>>(new Map());
```

---

## API Integration

### Endpoints

```typescript
// Step 1: Dados do negócio
POST /api/v1/creator-profile/onboarding/step-1/
Body: OnboardingStep1Data

// Step 2: Dados de branding
POST /api/v1/creator-profile/onboarding/step-2/
Body: OnboardingStep2Data

// Tracking de funil
POST /api/v1/creator-profile/onboarding/track/
Body: { session_id, step_number, completed }

// Estilos visuais
GET /api/v1/creator-profile/visual-style-preferences/

// Validação de email
POST /api/v1/auth/check-email/
Body: { email }

// Checkout Stripe
POST /api/v1/subscriptions/create-checkout-session/
Body: { price_id, success_url, cancel_url }
```

### Payloads

```typescript
interface OnboardingStep1Data {
  business_name: string;
  business_phone?: string;
  business_website?: string;
  business_instagram_handle?: string;
  specialization: string;
  business_description: string;
  business_purpose?: string;
  brand_personality: string;        // Comma-separated
  products_services?: string;
  business_location?: string;
  target_audience: string;          // Formatted string
  target_interests: string;         // Comma-separated
  main_competitors?: string;
  reference_profiles?: string;
}

interface OnboardingStep2Data {
  voice_tone: string;
  logo?: string;
  color_1: string;
  color_2: string;
  color_3: string;
  color_4: string;
  color_5: string;
  visual_style_ids?: string[];
}
```

---

## Testes

### Resumo de Cobertura

| Métrica | Valor |
|---------|-------|
| **Testes Unitários** | 598 passando |
| **Testes E2E** | 15 passando |
| **Cobertura Geral** | 58.78% |
| **Cobertura Components/new** | 60.89% |

### Componentes com 100% de Cobertura
- AuthProgressIndicator
- BackButton
- StepSkeleton

### Arquivos de Teste Unitário

| Categoria | Arquivos | Testes |
|-----------|----------|--------|
| Hooks | 6 | ~85 |
| Utils | 2 | 40 |
| Components/new | 7 | ~150 |
| Steps | 16 | ~200 |
| OnboardingNew | 1 | 15 |
| **Total** | **37** | **598** |

### Testes E2E (Playwright)

```
e2e/onboarding.spec.ts - 15 testes
├── Welcome Step (3 testes)
│   ├── deve renderizar a tela de boas-vindas
│   ├── deve ter botão de login para usuários existentes
│   └── deve navegar para o próximo step ao clicar em começar
├── Business Name Step (3 testes)
│   ├── deve validar campo obrigatório
│   ├── deve habilitar botão após preencher nome
│   └── deve permitir voltar ao step anterior
├── Niche Step (1 teste)
│   └── deve navegar corretamente entre steps
├── Target Audience Step (1 teste)
│   └── deve permitir seleção múltipla de gênero
├── Logo Step (1 teste)
│   └── deve mostrar limite de tamanho do arquivo
├── Persistência de Dados (1 teste)
│   └── deve manter dados ao recarregar a página
├── Acessibilidade (2 testes)
│   ├── deve ter focus trap funcionando
│   └── deve suportar navegação por teclado (Escape para voltar)
├── Transições de Fase (1 teste)
│   └── deve mostrar animação ao completar fase do negócio
└── Fluxo de Autenticação (2 testes)
    ├── deve mostrar tela de login ao clicar no botão
    └── deve permitir voltar do login para o welcome
```

### Executar Testes

```bash
# Testes unitários - todos
npm test

# Testes unitários - apenas onboarding
npm test -- src/features/Auth/Onboarding

# Testes unitários com cobertura
npm test -- --coverage

# Testes E2E
npm run test:e2e

# Testes E2E com UI
npm run test:e2e:ui

# Relatório E2E
npm run test:e2e:report
```

---

## Acessibilidade

### Focus Trap
Implementado no MicroStepLayout para manter foco dentro do step atual.

```typescript
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'a[href]',
].join(',');
```

### Navegação por Teclado
- `Tab` / `Shift+Tab`: Navega entre elementos focáveis
- `Escape`: Volta para step anterior
- `Ctrl/Cmd + Enter`: Avança para próximo step
- `Enter`: Ativa botão focado

### Screen Readers
- Anúncios de mudança de step via `aria-live`
- Labels descritivos em todos os inputs
- Roles apropriados em componentes interativos

### Reduced Motion
- Confetti respeita `prefers-reduced-motion`
- Animações simplificadas quando preferido

---

## Performance

### Lazy Loading
Todos os steps são carregados sob demanda:

```typescript
// index.lazy.ts
export const LazyWelcomeStep = lazy(() =>
  import("./WelcomeStep").then(m => ({ default: m.WelcomeStep }))
);

export const LazyBusinessNameStep = lazy(() =>
  import("./BusinessNameStep").then(m => ({ default: m.BusinessNameStep }))
);
// ... 15 mais steps
```

### Otimizações Implementadas
- `memo()` em componentes pesados (MicroStepLayout, PhaseTransition)
- `useMemo()` para cálculos derivados
- `useCallback()` para handlers estáveis
- Preview só renderiza a partir do step 5
- Polling do preview só roda quando necessário
- SVGs extraídos (redução de 70% no TargetAudienceStep)
- Cache de validação de email
- Limite de 500KB para upload de logo

### Métricas de Arquivos

| Arquivo | Linhas | Nota |
|---------|--------|------|
| OnboardingNew.tsx | 688 | Orquestrador principal |
| TargetAudienceStep.tsx | 367 | Reduzido de 1240 (70%) |
| MicroStepLayout.tsx | 297 | Com focus trap |

---

## Modo Edição

O componente suporta modo de edição para usuários existentes:

```tsx
<OnboardingNew
  mode="edit"
  initialData={existingProfile}
  onComplete={() => navigate("/dashboard")}
  onCancel={() => navigate("/dashboard")}
/>
```

**Diferenças no modo edição:**
- Pula step 1 (Welcome)
- Inicia no step 2
- Botão "Salvar alterações" no step 13
- Não passa por autenticação/paywall
- `onCancel` é chamado ao voltar do step 2

---

## Dependências

```json
{
  "canvas-confetti": "^1.9.4",
  "@types/canvas-confetti": "^1.9.0",
  "@playwright/test": "^1.58.2"
}
```

---

## Configuração

### Playwright (playwright.config.ts)

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Vitest (vitest.config.ts)

```typescript
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["**/node_modules/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      include: ["src/features/Auth/Onboarding/**/*.{ts,tsx}"],
    },
  },
});
```

---

## Changelog

### v2.1.0 (Atual)
- [x] 598 testes unitários implementados
- [x] 15 testes E2E com Playwright
- [x] SVGs extraídos para arquivos separados
- [x] Focus trap implementado
- [x] Cache de validação de email
- [x] Validação de URLs de redirect Stripe
- [x] Limite de 500KB para logo
- [x] JSDoc nos hooks principais
- [x] Simplificado para 3 fases

### Próximos Passos
- [ ] Aumentar cobertura de testes para 80%+
- [ ] Adicionar testes de acessibilidade automatizados (axe-core)
- [ ] Resolver warnings de `act()` no LocationStep
- [ ] A/B testing das celebrações
- [ ] Métricas de conversão por step
- [ ] Dividir OnboardingNew.tsx em componentes menores
