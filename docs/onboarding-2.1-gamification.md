# Onboarding 2.1 - Documentação Completa

## Visão Geral

O Onboarding 2.1 é um fluxo de cadastro gamificado com **14 steps** organizados em **3 fases**. O objetivo é coletar informações do negócio do usuário de forma progressiva e engajante, culminando na criação de conta e assinatura.

### Características Principais
- **Micro-steps**: Cada tela coleta uma informação específica
- **Persistência local**: Dados salvos no localStorage com expiração de 24h
- **Gamificação**: Transições de fase, celebrações e preview progressivo
- **Lazy loading**: Steps carregados sob demanda para performance
- **Acessibilidade**: Suporte a screen readers e navegação por teclado
- **Tracking**: Analytics de funil para cada step

---

## Arquitetura

```
src/features/Auth/Onboarding/
├── OnboardingNew.tsx           # Componente principal (orquestrador)
├── components/
│   └── new/
│       ├── MicroStepLayout.tsx      # Layout padrão dos steps
│       ├── PhaseTransition.tsx      # Tela de transição entre fases
│       ├── ProgressBarWithPhases.tsx # Barra de progresso com checkmarks
│       ├── OnboardingPreview.tsx    # Preview do perfil sendo construído
│       ├── StepSkeleton.tsx         # Skeleton loading
│       ├── SelectableCards.tsx      # Cards de seleção única/múltipla
│       ├── SelectableChips.tsx      # Chips de seleção
│       ├── ColorPicker.tsx          # Seletor de cores
│       └── steps/                   # 17 step components
├── hooks/
│   ├── useOnboardingStorage.ts      # Persistência no localStorage
│   ├── useOnboardingTracking.ts     # Analytics de funil
│   ├── useCelebration.ts            # Confetti animations
│   ├── useOnboardingA11y.tsx        # Acessibilidade
│   ├── useOnboardingPreviewData.ts  # Dados reativos do preview
│   ├── usePreviewIdeas.ts           # Ideias de conteúdo para preview
│   ├── useABTest.ts                 # Experimentos A/B
│   └── useVisualStylePreferences.ts # Estilos visuais da API
├── utils/
│   ├── audienceUtils.ts             # Parsing/formatação de audiência
│   └── labelUtils.ts                # Mapeamento de labels (niche, voice tone)
├── services/
│   └── index.ts                     # API calls
└── constants/
    └── onboardingSchema.ts          # Zod schemas
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
| 11 | `LogoStep` | Upload de logo (opcional) | `logo`, `suggested_colors[]` |
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
  logo: string;                      // URL ou base64
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
Layout padrão para todos os steps do onboarding.

```tsx
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

### Arquivos de Teste

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `hooks/__tests__/useOnboardingStorage.test.ts` | 22 | localStorage, save/load, payloads |
| `hooks/__tests__/useOnboardingTracking.test.ts` | 18 | API calls, session management |
| `hooks/__tests__/useCelebration.test.ts` | 9 | Confetti triggers |
| `hooks/__tests__/useOnboardingPreviewData.test.ts` | 7 | Dados reativos |
| `utils/__tests__/audienceUtils.test.ts` | 27 | Parsing, formatação |
| `utils/__tests__/labelUtils.test.ts` | 13 | Label mapping |
| `components/new/__tests__/PhaseTransition.test.tsx` | 25 | Transições, interação |
| `components/new/__tests__/MicroStepLayout.test.tsx` | 28 | Layout, navegação, a11y |
| `components/new/__tests__/OnboardingPreview.test.tsx` | 16 | Preview progressivo |
| `components/new/__tests__/ProgressBarWithPhases.test.tsx` | 23 | Progresso, fases |
| `components/new/__tests__/StepSkeleton.test.tsx` | 13 | Skeleton states |
| `components/new/steps/__tests__/*.test.tsx` | ~50+ | Steps individuais |

**Total: ~200+ testes**

### Executar Testes

```bash
# Todos os testes do onboarding
npx vitest --run src/features/Auth/Onboarding

# Testes específicos
npx vitest --run src/features/Auth/Onboarding/hooks
npx vitest --run src/features/Auth/Onboarding/utils
npx vitest --run src/features/Auth/Onboarding/components/new
```

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

## Performance

### Lazy Loading
Todos os steps são carregados sob demanda:

```typescript
// index.lazy.ts
export const LazyWelcomeStep = lazy(() =>
  import("./WelcomeStep").then(m => ({ default: m.WelcomeStep }))
);
```

### Otimizações
- `memo()` em componentes pesados (MicroStepLayout, PhaseTransition)
- `useMemo()` para cálculos derivados
- `useCallback()` para handlers estáveis
- Preview só renderiza a partir do step 5
- Polling do preview só roda quando necessário

---

## Acessibilidade

- **Screen readers**: Anúncios de mudança de step
- **Foco**: Auto-foco no primeiro input ao mudar step
- **Teclado**: Navegação completa sem mouse
- **ARIA**: Labels e roles apropriados
- **Reduced motion**: Confetti respeitando preferências do sistema

---

## Dependências

```json
{
  "canvas-confetti": "^1.9.2",
  "@types/canvas-confetti": "^1.6.4"
}
```

---

## Próximos Passos

- [x] Simplificar para 3 fases (removida fase "Finalizar")
- [x] Testes completos para hooks e utils
- [x] Centralizar labels em utils
- [x] Remover código duplicado
- [ ] Ajustar tracking backend para 14 steps
- [ ] Adicionar sons opcionais às celebrações
- [ ] A/B testing das celebrações
- [ ] Métricas de conversão por step
