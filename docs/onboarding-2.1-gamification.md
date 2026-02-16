# Onboarding 2.1 - Gamificação

## Visão Geral

Esta versão adiciona elementos de gamificação ao fluxo de onboarding para melhorar o engajamento e a experiência do usuário.

## Funcionalidades Implementadas

### 1. Micro-celebrações (Confetti)

Celebrações visuais sutis que aparecem quando o usuário completa marcos importantes.

**Momentos de celebração:**
| Step | Fase Completa | Intensidade |
|------|---------------|-------------|
| 4 | Negócio | Sutil (15 partículas) |
| 8 | Público | Sutil (15 partículas) |
| 12 | Marca | Médio (30 partículas + burst) |
| 13 | Profile Ready | Médio (30 partículas + burst) |

**Arquivo:** `src/features/Auth/Onboarding/hooks/useCelebration.ts`

**Uso:**
```tsx
const { celebrate, celebrateSubtle, celebrateMedium, celebrateFull } = useCelebration();

// Celebração por intensidade
celebrate({ intensity: "subtle" });
celebrate({ intensity: "medium" });
celebrate({ intensity: "full" });

// Ou diretamente
celebrateSubtle();
celebrateMedium();
celebrateFull();
```

### 2. Barra de Progresso com Fases

Substitui a barra de progresso simples por uma com indicadores de fase e checkmarks animados.

**Fases:**
1. **Negócio** (Steps 1-4)
2. **Público** (Steps 5-8)
3. **Marca** (Steps 9-12)
4. **Finalizar** (Steps 13-14)

**Arquivo:** `src/features/Auth/Onboarding/components/new/ProgressBarWithPhases.tsx`

**Props:**
```tsx
interface ProgressBarWithPhasesProps {
  currentStep: number;
  totalSteps: number;
  showPhaseNames?: boolean; // Mostra nomes das fases
  className?: string;
}
```

**Hook auxiliar:**
```tsx
const { phaseName, phaseIndex, isLastStepOfPhase, isFirstStepOfPhase, totalPhases } = usePhaseInfo(currentStep);
```

### 3. Preview Progressivo

Componente que mostra um mini-preview do perfil sendo construído conforme o usuário avança.

**Comportamento:**
- **Aparece:** A partir do step 4
- **Expande:** A partir do step 12 (mostra cores e tom de voz)
- **Completo:** Step 13 (destaque visual)

**Arquivo:** `src/features/Auth/Onboarding/components/new/OnboardingPreview.tsx`

**Props:**
```tsx
interface OnboardingPreviewProps {
  data: {
    business_name?: string;
    specialization?: string;
    business_description?: string;
    voice_tone?: string;
    colors?: string[];
    logo?: string;
  };
  currentStep: number;
  className?: string;
}
```

## Arquivos Modificados

### Novos Arquivos
- `src/features/Auth/Onboarding/hooks/useCelebration.ts`
- `src/features/Auth/Onboarding/components/new/OnboardingPreview.tsx`
- `src/features/Auth/Onboarding/components/new/ProgressBarWithPhases.tsx`

### Arquivos Atualizados
- `src/features/Auth/Onboarding/components/new/MicroStepLayout.tsx`
  - Adicionado suporte para `showPhases` e `preview` props
  - Integrado `ProgressBarWithPhases`
- `src/features/Auth/Onboarding/components/new/index.ts`
  - Exportados novos componentes
- `src/features/Auth/Onboarding/OnboardingNew.tsx`
  - Integrado `useCelebration`
  - Adicionada lógica de celebração ao completar fases

## Testes

### Arquivos de Teste
- `src/features/Auth/Onboarding/hooks/__tests__/useCelebration.test.ts` (9 testes)
- `src/features/Auth/Onboarding/components/new/__tests__/OnboardingPreview.test.tsx` (16 testes)
- `src/features/Auth/Onboarding/components/new/__tests__/ProgressBarWithPhases.test.tsx` (18 testes)

### Executar Testes
```bash
npx vitest --run src/features/Auth/Onboarding/hooks/__tests__/useCelebration.test.ts \
  src/features/Auth/Onboarding/components/new/__tests__/OnboardingPreview.test.tsx \
  src/features/Auth/Onboarding/components/new/__tests__/ProgressBarWithPhases.test.tsx
```

## Dependências Adicionadas

```bash
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

## Acessibilidade

- Confetti respeita `prefers-reduced-motion` (desabilitado automaticamente)
- Animações são sutis e não intrusivas
- Checkmarks usam ícones semânticos

## Performance

- Confetti usa canvas-confetti (leve, ~3KB gzip)
- Animações usam framer-motion (já existente no projeto)
- Preview é renderizado condicionalmente

## Próximos Passos

1. [ ] Integrar OnboardingPreview em steps específicos
2. [ ] Ajustar tracking backend para 14 steps
3. [ ] Adicionar sons opcionais às celebrações
4. [ ] A/B testing das celebrações
