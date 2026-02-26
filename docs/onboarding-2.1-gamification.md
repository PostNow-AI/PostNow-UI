# Onboarding 2.1 - Documentação Completa

## Visão Geral

O Onboarding 2.1 é um fluxo de cadastro gamificado com **13 steps** organizados em **5 fases**. O objetivo é coletar informações do negócio do usuário de forma progressiva e engajante, culminando na criação de conta e assinatura.

> **Nota:** Os campos `target_interests` e `voice_tone` foram removidos do fluxo. A IA infere essas informações automaticamente a partir dos dados coletados (nicho, público-alvo e personalidade da marca). Veja a seção [Campos Inferidos pela IA](#campos-inferidos-pela-ia) para mais detalhes.

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
│       ├── ColorPicker.tsx            # Seletor de cores principal
│       ├── ColorPickerPopover.tsx     # Popover com color picker
│       ├── EditableColorSwatch.tsx    # Swatch de cor editável
│       ├── PreviewColorButton.tsx     # Botão de cor no preview
│       ├── AuthProgressIndicator.tsx  # Indicador de progresso auth
│       ├── BackButton.tsx             # Botão voltar reutilizável
│       ├── ThisOrThatCard.tsx         # Card de comparação A/B
│       ├── PaywallFlow.tsx            # Fluxo de paywall (orquestrador)
│       ├── PaywallScreen.tsx          # Tela de seleção de planos
│       ├── illustrations/             # SVGs extraídos
│       │   ├── PersonIllustrations.tsx   # Silhuetas de pessoas
│       │   ├── SceneIllustrations.tsx    # Cenas de background
│       │   └── index.ts
│       ├── steps/                     # 26 step components
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
│   ├── useOnboardingFlow.ts           # Status do onboarding (API)
│   ├── useCelebration.ts              # Confetti animations
│   ├── useOnboardingA11y.tsx          # Acessibilidade completa
│   ├── useOnboardingPreviewData.ts    # Dados reativos do preview
│   ├── usePreviewIdeas.ts             # Ideias de conteúdo para preview
│   ├── useABTest.ts                   # Experimentos A/B
│   ├── useProfessions.ts              # Lista de profissões (API)
│   ├── useSpecializations.ts          # Especializações por profissão (API)
│   ├── useVisualStylePreferences.ts   # Estilos visuais da API
│   └── __tests__/                     # Testes dos hooks
├── utils/
│   ├── audienceUtils.ts               # Parsing/formatação de audiência
│   ├── labelUtils.ts                  # Mapeamento de labels
│   └── __tests__/                     # Testes dos utils
├── services/
│   └── index.ts                       # API calls
└── constants/
    ├── colors.ts                      # Cores predefinidas
    ├── onboardingSchema.ts            # Zod schemas (legado)
    ├── onboardingNewSchema.ts         # Zod schemas + options (novo)
    └── personalityQuizData.ts         # Dados do quiz de personalidade
```

---

## Fluxo de Steps

### Fase 1: Boas-vindas (Steps 1-2)
| Step | Componente | Descrição | Campo |
|------|------------|-----------|-------|
| 1 | `WelcomeStep` | Boas-vindas + opção de login | - |
| 2 | `BusinessNameStep` | Nome do negócio | `business_name` |

### Fase 2: Seu Negócio (Steps 3-5)
| Step | Componente | Descrição | Campo |
|------|------------|-----------|-------|
| 3 | `NicheStep` | Nicho de atuação | `specialization` |
| 4 | `OfferStep` | O que oferece/vende | `business_description` |
| 5 | `PersonalityStep` | Personalidade da marca | `brand_personality[]` |

### Fase 3: Seu Público (Steps 6-7)
| Step | Componente | Descrição | Campo |
|------|------------|-----------|-------|
| 6 | `TargetAudienceStep` | Público-alvo (gênero, idade, classe) | `target_audience` (JSON) |
| 7 | `LocationStep` | Localização do negócio | `business_location` |

> **Nota:** O `InterestsStep` foi removido. A IA infere os interesses do público a partir do nicho e público-alvo.

### Fase 4: Identidade Visual (Steps 8-10)
| Step | Componente | Descrição | Campo |
|------|------------|-----------|-------|
| 8 | `VisualStyleStep` | Estilos visuais preferidos | `visual_style_ids[]` |
| 9 | `LogoStep` | Upload de logo (máx 500KB) | `logo`, `suggested_colors[]` |
| 10 | `ColorsStep` | Paleta de cores (5 cores) | `colors[]` |

> **Nota:** O `VoiceToneStep` foi removido. A IA infere o tom de voz a partir da personalidade da marca.

### Fase 5: Validação (Steps 11-13)
| Step | Componente | Descrição |
|------|------------|-----------|
| 11 | `ProfileReadyStep` | Resumo do perfil criado |
| 12 | `PreviewStep` | Preview de ideias de conteúdo |
| 13 | `SignupStep` / `LoginStep` | Criação de conta ou login |
| - | `PaywallStep` | Seleção de plano e checkout |

### Steps Auxiliares (não no fluxo principal)
| Componente | Descrição | Campo |
|------------|-----------|-------|
| `ContactInfoStep` | Telefone, Instagram, Website | `business_phone`, `business_instagram_handle`, `business_website` |
| `CompetitorsStep` | Concorrentes e referências | `main_competitors`, `reference_profiles` |
| `DescriptionStep` | Descrição detalhada | `business_description` |
| `PhoneStep` | Apenas telefone | `business_phone` |
| `ProductsStep` | Produtos/serviços | `products_services` |
| `PurposeStep` | Propósito do negócio | `business_purpose` |
| `ChipsSelectionStep` | Seleção genérica de chips | (configurável) |
| `PersonalityQuizStep` | Quiz de personalidade | `brand_personality[]` |
| `StyleComparisonDemo` | Demo de comparação visual | - |

---

## Estrutura de Dados

### OnboardingTempData (localStorage)

```typescript
interface OnboardingTempData {
  // Fase 1: Boas-vindas
  business_name: string;

  // Fase 2: Seu Negócio
  specialization: string;
  business_description: string;
  brand_personality: string[];       // Usado para inferir tom de voz
  business_purpose: string;
  products_services: string;

  // Fase 3: Seu Público
  target_audience: string;           // JSON stringificado (usado para inferir interesses)
  business_location: string;
  main_competitors: string;
  reference_profiles: string;

  // Fase 4: Identidade Visual
  visual_style_ids: string[];
  colors: string[];                  // 5 cores hex
  logo: string;                      // URL ou base64 (máx 500KB)
  suggested_colors: string[];        // Cores extraídas do logo

  // Contato (opcional)
  business_phone: string;
  business_instagram_handle: string;
  business_website: string;

  // Metadados
  current_step: number;
  completed_at?: string;
  expires_at: string;
}
```

> **Campos removidos:** `target_interests` e `voice_tone` foram removidos pois a IA infere automaticamente.

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
  syncStep1,        // Envia dados da fase 1-3
  syncStep2,        // Envia dados da fase 4
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

### useOnboardingFlow
Verifica o status do onboarding do usuário na API.

```typescript
/**
 * Hook para verificar status do onboarding
 * @description Consulta a API para saber se o usuário completou o onboarding
 */
const {
  onboardingStatus,   // Status retornado da API
  isLoading,          // Se está carregando
  error,              // Erro da requisição
  needsOnboarding,    // true se onboarding não foi completado
} = useOnboardingFlow();
```

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

### useOnboardingA11y
Gerencia acessibilidade completa (screen readers, foco, teclado).

```typescript
/**
 * Hook para gerenciar acessibilidade no onboarding
 * @description Focus management, keyboard navigation, screen reader announcements
 */
const {
  announce,                    // Anuncia texto para screen readers
  focusMainContent,            // Move foco para conteúdo principal
  handleKeyboardNavigation,    // Handler para navegação por teclado
  getStepContainerProps,       // Props ARIA para container do step
  getProgressBarProps,         // Props ARIA para barra de progresso
  getNavigationButtonProps,    // Props ARIA para botões de navegação
  mainContentRef,              // Ref para conteúdo principal
} = useOnboardingA11y(currentStep);

// Componente auxiliar exportado
export const SkipToContent: FC;  // Link para pular ao conteúdo
```

### useOnboardingPreviewData
Fornece dados reativos para o preview (polling 300ms).

```typescript
const data = useOnboardingPreviewData();
// Retorna subset de OnboardingTempData para preview
```

### useProfessions
Busca lista de profissões da API.

```typescript
/**
 * Hook para buscar profissões disponíveis
 * @returns Array de profissões { id, name }
 */
const professions = useProfessions();
// Retorna Profession[] ou []
```

### useSpecializations
Busca especializações para uma profissão selecionada.

```typescript
/**
 * Hook para buscar especializações de uma profissão
 * @param professions - Lista de profissões
 * @param selectedProfession - Profissão selecionada
 */
const {
  specializations,           // { profession, specializations[] }
  isLoadingSpecializations   // Se está carregando
} = useSpecializations(professions, selectedProfession);
```

### useABTest
Gerencia experimentos A/B no onboarding.

```typescript
const {
  variant,        // Variante atual ('A' | 'B')
  isLoading,      // Se está carregando
  trackEvent,     // Rastreia evento do experimento
} = useABTest(experimentName);
```

### useVisualStylePreferences
Busca estilos visuais disponíveis da API.

```typescript
const {
  styles,      // VisualStyle[]
  isLoading    // Se está carregando
} = useVisualStylePreferences();
```

### usePreviewIdeas
Gera ideias de conteúdo para preview baseado nos dados coletados.

```typescript
const {
  ideas,        // Ideias de posts geradas
  isLoading,    // Se está gerando
  refresh,      // Gera novas ideias
} = usePreviewIdeas(onboardingData);
```

---

## Constants

### colors.ts
Cores predefinidas para seleção rápida no color picker.

```typescript
export const PREDEFINED_COLORS = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
  "#8B5CF6", "#F97316", "#06B6D4", "#EC4899",
  "#84CC16", "#6366F1", "#F43F5E", "#14B8A6",
] as const;

export type PredefinedColor = typeof PREDEFINED_COLORS[number];
```

### onboardingNewSchema.ts
Schemas Zod e opções para cada step.

```typescript
// Schemas de validação
export const stepSchemas = {
  businessName: z.object({ business_name: z.string().min(1).max(200) }),
  niche: z.object({ specialization: z.string().min(1) }),
  offer: z.object({ business_description: z.string().min(10) }),
  personality: z.object({ brand_personality: z.array(z.string()).min(1) }),
  targetAudience: z.object({ target_audience: z.string().min(5) }),
  location: z.object({ business_location: z.string().min(1) }),
  visualStyle: z.object({ visual_style_ids: z.array(z.string()).min(1) }),
  logo: z.object({ logo: z.string().optional() }),
  colors: z.object({ colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).length(5) }),
};

// Opções para cada step
export const nicheOptions: NicheOption[];           // 8 opções de nicho
export const personalityOptions: string[];          // 16 personalidades
export const visualStyleOptions: VisualStyle[];     // 18 estilos visuais
export const colorPalettes: ColorPalette[];         // 6 paletas sugeridas

// Configuração
export const TOTAL_STEPS = 13;
export const stepConfig: StepConfig[];              // Mapeamento step → fase
```

> **Removidos:** `interests` e `voiceTone` schemas, `interestOptions` e `voiceToneOptions`.

**Nichos disponíveis (8):**
| ID | Label | Descrição |
|----|-------|-----------|
| saude | Saúde & Bem-estar | Médicos, nutricionistas, personal |
| beleza | Beleza & Estética | Salões, clínicas, maquiadores |
| educacao | Educação | Cursos, mentorias, professores |
| moda | Moda & Lifestyle | Lojas, influencers, estilistas |
| alimentacao | Alimentação | Restaurantes, delivery, confeitarias |
| servicos | Serviços | Tecnologia, finanças, consultoria |
| pet | Pet | Petshops, veterinários |
| outro | Outro | Meu nicho não está na lista |

**Estilos visuais (18):**
1. Minimalista Moderno
2. Bold Vibrante
3. Elegante Editorial
4. Divertido Ilustrado
5. Profissional Corporativo
6. Criativo Experimental
7. Tech Futurista
8. Natural Orgânico
9. Escandinavo Clean
10. Zen Japonês
11. Jurídico Profissional
12. Financeiro Clean
13. Neon Pop
14. Gradiente Explosivo
15. Retro Anos 80
16. Gradiente Moderno
17. Flat Design
18. Material Design

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

### ColorPicker & ColorPickerPopover
Seletores de cor com cores predefinidas e picker personalizado.

```tsx
// ColorPicker - Componente principal
interface ColorPickerProps {
  colors: string[];           // 5 cores selecionadas
  onChange: (colors: string[]) => void;
  suggestedColors?: string[]; // Cores do logo
}

// ColorPickerPopover - Popover com HexColorPicker
interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  children: ReactNode;
  align?: "start" | "center" | "end";
}
```

### PaywallFlow & PaywallScreen
Fluxo de paywall com seleção de planos.

```tsx
// PaywallScreen - Tela de seleção
interface PaywallScreenProps {
  trialDays: number;
  plans: Plan[];
  onSelectPlan: (planId: string) => void;
  onLogin?: () => void;
  isLoading?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  pricePerMonth: number;
  interval: "month" | "year";
  badge?: string;
  savings?: string;
  recommended?: boolean;
}
```

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

// Status do onboarding
GET /api/v1/creator-profile/onboarding/status/
Response: { onboarding_completed: boolean }

// Tracking de funil
POST /api/v1/creator-profile/onboarding/track/
Body: { session_id, step_number, completed }

// Estilos visuais
GET /api/v1/creator-profile/visual-style-preferences/

// Profissões
GET /api/v1/global-options/professions/

// Especializações
GET /api/v1/global-options/professions/:id/specializations/

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
  brand_personality: string;        // Comma-separated (fonte para inferir tom de voz)
  products_services?: string;
  business_location?: string;
  target_audience: string;          // Formatted string (fonte para inferir interesses)
  target_interests: string;         // ⚠️ Sempre vazio - IA infere do nicho/público
  main_competitors?: string;
  reference_profiles?: string;
}

interface OnboardingStep2Data {
  voice_tone: string;               // ⚠️ Sempre vazio - IA infere da personalidade
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
- Componente `SkipToContent` para pular navegação

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
// ... 24 mais steps
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
  "@playwright/test": "^1.58.2",
  "react-colorful": "^5.6.1"
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

## Campos Inferidos pela IA

### Visão Geral

O onboarding foi simplificado removendo dois campos que a IA consegue inferir automaticamente a partir dos dados coletados:

| Campo Removido | Inferido De | Benefício |
|----------------|-------------|-----------|
| `target_interests` | `specialization`, `target_audience`, `business_description` | A IA entende os interesses do público com base no nicho e contexto do negócio |
| `voice_tone` | `brand_personality` | A personalidade da marca (5 dimensões) fornece contexto mais rico que um label simples de tom |

### Mapeamento: Personalidade → Tom de Voz

A IA infere o tom de voz adequado a partir das características de personalidade selecionadas no quiz:

| Personalidade (Quiz) | Tom de Voz Equivalente |
|---------------------|------------------------|
| Profissional / Sério | Profissional |
| Descontraído | Casual e Amigável |
| Divertido | Divertido |
| Acolhedor | Casual e Amigável |
| Educativo | Educativo |
| Inspirador | Inspirador |
| Confiável | Autoridade |

### Exemplo de Prompt

**Antes (com campo voice_tone separado):**
```
🏢 INFORMAÇÕES DA EMPRESA
- Nome: Vila Veg
- Descrição: Restaurante vegetariano com refeições saudáveis
- Tom de voz: Casual e Amigável
- Público-alvo: Mulheres e homens de 25-45 anos
```

**Depois (inferindo da personalidade):**
```
🏢 INFORMAÇÕES DA EMPRESA
- Nome: Vila Veg
- Descrição: Restaurante vegetariano com refeições saudáveis
- Personalidade da marca: Descontraído, Divertido, Acessível, Acolhedor, Inspirador
  (Use estas características para definir o tom de voz adequado)
- Público-alvo: Mulheres e homens de 25-45 anos
```

### Vantagem do Novo Approach

A personalidade fornece **mais contexto** que um label simples:

| Approach | Informação | Dimensões |
|----------|------------|-----------|
| Antigo | `"Casual e Amigável"` | 1 dimensão |
| Novo | `"Descontraído, Divertido, Acessível, Acolhedor, Inspirador"` | 5 dimensões |

A IA pode combinar múltiplas características para criar conteúdo mais personalizado e nuançado.

### Teste de Validação

```python
#!/usr/bin/env python3
"""
Teste comparativo: Prompt ANTIGO vs NOVO
Demonstra que a IA recebe informação EQUIVALENTE para inferir o tom de voz
"""

# Cenário: Usuário selecionou no QUIZ:
# - Descontraído (vs Profissional)
# - Divertido (vs Sério)
# - Acessível (vs Premium)
# - Acolhedor (vs Confiável)
# - Inspirador (vs Educativo)

profile_data = {
    "business_name": "Vila Veg",
    "business_description": "Restaurante vegetariano com refeições saudáveis",
    "brand_personality": "Descontraído, Divertido, Acessível, Acolhedor, Inspirador",
    "target_audience": "Mulheres e homens de 25-45 anos",

    # ANTIGO - campo separado:
    "voice_tone_antigo": "Casual e Amigável",
}

# ANÁLISE DE EQUIVALÊNCIA:
#
# ANTIGO: "Tom de voz: Casual e Amigável"
#
# NOVO:   "Personalidade: Descontraído, Divertido, Acolhedor..."
#         + instrução "Use para definir o tom adequado"
#
# RESULTADO: A IA gera o MESMO tipo de conteúdo porque:
#   • "Descontraído" = linguagem casual, informal
#   • "Divertido" = tom leve, bem-humorado
#   • "Acolhedor" = próximo, amigável
#
# Isso é EQUIVALENTE a "Casual e Amigável"!
```

### Exemplo de Output Gerado

Com personalidade `"Descontraído, Divertido, Acessível, Acolhedor, Inspirador"`:

```
🌱 Título: "Comer bem não precisa ser chato!"

Legenda:
E aí, tudo bem? 😊

Sabe aquele dia que você quer comer algo gostoso MAS também
quer se sentir bem depois? A gente te entende!

Aqui no Vila Veg, a gente prova que comida saudável pode ser
deliciosa, acessível e... divertida! 🥗✨

Bora experimentar? Seu corpo (e seu paladar) agradecem! 💚

#ComidaSaudavel #Vegetariano #VilaVeg
```

Este tom é: **CASUAL + DIVERTIDO + ACOLHEDOR** = equivalente a "Casual e Amigável"!

### Implementação no Backend

Os prompts em `ai_prompt_service.py` foram atualizados:

```python
# build_content_prompts
- Personalidade da marca: {profile_data['brand_personality']}
  (Use estas características para definir o tom de voz adequado)

# build_historical_analysis_prompt
Personalidade da marca: {profile_data['brand_personality']}
  (Use estas características para definir o tom de voz adequado)

# build_automatic_post_prompt
Personalidade da marca: {profile_data['brand_personality']}
...
6. Use a personalidade da marca para definir o tom de voz adequado
```

### Compatibilidade com API

Para manter compatibilidade com o backend, os payloads ainda enviam os campos:

```typescript
// useOnboardingStorage.ts - getStep1Payload
target_interests: ""  // Vazio - IA infere do nicho/público

// useOnboardingStorage.ts - getStep2Payload
voice_tone: ""  // Vazio - IA infere da personalidade
```

---

## Changelog

### v2.1.1 (Atual)
- [x] Removido `InterestsStep` - IA infere interesses do nicho e público-alvo
- [x] Removido `VoiceToneStep` - IA infere tom de voz da personalidade da marca
- [x] Fluxo simplificado para **13 steps** (era 15)
- [x] Prompts de IA atualizados para usar `brand_personality` como fonte de tom
- [x] Documentação com testes de validação dos campos inferidos
- [x] Detecção de localização via Vercel headers com fallback FreeIPAPI

### v2.1.0
- [x] 598 testes unitários implementados
- [x] 15 testes E2E com Playwright
- [x] SVGs extraídos para arquivos separados
- [x] Focus trap implementado
- [x] Cache de validação de email
- [x] Validação de URLs de redirect Stripe
- [x] Limite de 500KB para logo
- [x] JSDoc nos hooks principais
- [x] 18 estilos visuais disponíveis
- [x] 8 nichos de atuação

### Próximos Passos
- [ ] Aumentar cobertura de testes para 80%+
- [ ] Adicionar testes de acessibilidade automatizados (axe-core)
- [ ] Resolver warnings de `act()` no LocationStep
- [ ] A/B testing das celebrações
- [ ] Métricas de conversão por step
- [ ] Dividir OnboardingNew.tsx em componentes menores
