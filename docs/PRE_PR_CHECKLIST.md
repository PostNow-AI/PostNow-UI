# Checklist Pré-PR - PostNow UI

Este documento define o processo padronizado para garantir PRs de qualidade antes de solicitar review.

**Baseado em:** Análise de 71 PRs + Feedbacks do CTO + Documentação existente + Cursor Rules + copilot-instructions.md

---

## Índice

- [Checklist Rápido](#checklist-rápido)
- [Fase 1: Branch](#fase-1-branch)
- [Fase 2: Commits](#fase-2-commits)
- [Fase 3: Código](#fase-3-código)
- [Fase 4: Formulários e API](#fase-4-formulários-e-api)
- [Fase 5: Acessibilidade](#fase-5-acessibilidade)
- [Fase 6: Testes Locais](#fase-6-testes-locais)
- [Fase 7: Integração](#fase-7-integração)
- [Fase 8: PR](#fase-8-pr)
- [Fase 9: Pós-Push](#fase-9-pós-push)
- [Fase 10: Pós-Merge](#fase-10-pós-merge)
- [Comandos Úteis](#comandos-úteis)
- [Padrões React (Cursor Rules)](#padrões-react-cursor-rules)
- [Feedbacks Recorrentes do CTO](#feedbacks-recorrentes-do-cto)

---

## Checklist Rápido

```
┌─────────────────────────────────────────────────────────────────┐
│              PRÉ-PR CHECKLIST POSTNOW - FRONTEND                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ BRANCH                                                          │
│ [ ] Criada de main atualizado                                   │
│ [ ] Nomenclatura: feat/, fix/, hotfix/, docs/, refactor/, chore/│
│                                                                 │
│ COMMITS                                                         │
│ [ ] Conventional Commits: tipo(escopo): descrição               │
│ [ ] Commits pequenos e frequentes                               │
│                                                                 │
│ CÓDIGO                                                          │
│ [ ] Componentes < 200 linhas (separar UI de lógica)             │
│ [ ] Hooks customizados para lógica complexa                     │
│ [ ] Sem console.logs                                            │
│ [ ] Sem código comentado                                        │
│ [ ] Sem variáveis/imports não utilizados (TypeScript strict)    │
│ [ ] Textos em português                                         │
│ [ ] Tailwind classes (não CSS customizado)                      │
│ [ ] Shadcn components quando aplicável                          │
│                                                                 │
│ FORMULÁRIOS & API                                               │
│ [ ] React Hook Form + Zod para formulários                      │
│ [ ] TanStack Query para GET (useQuery)                          │
│ [ ] TanStack Query para POST/PUT/DELETE (useMutation)           │
│ [ ] Axios para chamadas HTTP                                    │
│ [ ] Validação ANTES do envio                                    │
│ [ ] Erros mostrados no campo específico                         │
│                                                                 │
│ ACESSIBILIDADE                                                  │
│ [ ] aria-label em elementos interativos                         │
│ [ ] tabIndex={0} em elementos clicáveis                         │
│ [ ] onKeyDown para navegação por teclado                        │
│ [ ] Dark mode testado                                           │
│                                                                 │
│ TESTES LOCAIS                                                   │
│ [ ] npm run lint                                                │
│ [ ] npx tsc --noEmit                                            │
│ [ ] npm run test:run                                            │
│ [ ] npm run build                                               │
│                                                                 │
│ INTEGRAÇÃO                                                      │
│ [ ] Branch atualizada com main                                  │
│ [ ] Sem conflitos de merge                                      │
│                                                                 │
│ PR                                                              │
│ [ ] Template preenchido                                         │
│ [ ] Screenshots (antes/depois) se mudança visual                │
│ [ ] PR de backend linkada (se aplicável)                        │
│ [ ] Self-review feito                                           │
│                                                                 │
│ PÓS-PUSH                                                        │
│ [ ] Vercel Preview funcionando                                  │
│ [ ] CI passou (lint, typecheck, tests, build)                   │
│ [ ] Testado na URL de preview                                   │
│ [ ] Testado em mobile/tablet/desktop                            │
│ [ ] Testado em dark mode                                        │
│                                                                 │
│ PÓS-MERGE (se release)                                          │
│ [ ] npm version patch/minor/major                               │
│ [ ] git push origin main --tags                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: Branch

### Criar branch corretamente

```bash
# Atualizar branch base
git checkout main
git pull origin main

# Criar feature branch
git checkout -b <tipo>/<descricao>
```

### Nomenclatura obrigatória

| Prefixo | Uso | Impacto na versão |
|---------|-----|-------------------|
| `feat/` | Nova funcionalidade | MINOR |
| `fix/` | Correção de bug | PATCH |
| `hotfix/` | Correção urgente em produção | PATCH |
| `docs/` | Documentação | - |
| `style/` | Alterações visuais/CSS | - |
| `refactor/` | Refatoração sem mudança de comportamento | - |
| `chore/` | Manutenção (deps, configs) | - |
| `release/` | Preparação de release | - |

### Exemplos

```bash
feat/adicionar-dark-mode
fix/corrigir-responsividade-sidebar
hotfix/tela-branca-dashboard
style/ajustar-espacamento-cards
docs/atualizar-readme
refactor/extrair-logica-auth
```

---

## Fase 2: Commits

### Formato (Conventional Commits)

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos de commit

| Tipo | Descrição | Impacto na versão |
|------|-----------|-------------------|
| `feat` | Nova funcionalidade | MINOR |
| `fix` | Correção de bug | PATCH |
| `docs` | Documentação | - |
| `style` | Alterações visuais/CSS | - |
| `refactor` | Refatoração sem mudança de comportamento | - |
| `perf` | Melhoria de performance | PATCH |
| `test` | Adicionar/corrigir testes | - |
| `chore` | Manutenção (deps, configs) | - |

### Exemplos

```bash
feat(dashboard): adicionar gráfico de engajamento
fix(auth): corrigir redirect após login
style(button): ajustar padding do botão primário
refactor(hooks): extrair lógica de useAuth
chore(deps): atualizar React para v19

# Breaking change
feat(api)!: migrar para nova estrutura de response
```

---

## Fase 3: Código

### Diretrizes obrigatórias (copilot-instructions.md)

| Regra | Descrição |
|-------|-----------|
| **DRY** | Não repetir código |
| **Early returns** | Retornos antecipados para legibilidade |
| **Tailwind CSS** | Usar classes Tailwind, evitar CSS customizado |
| **Shadcn** | Usar componentes do design system |
| **Event handlers** | Prefixo `handle` (handleClick, handleKeyDown) |
| **Acessibilidade** | tabIndex, aria-label, onKeyDown |
| **Consts** | `const fn = () =>` em vez de `function fn()` |
| **TanStack Query** | Para caching e mutations |
| **React Hook Form + Zod** | Para formulários e validação |
| **Axios** | Para chamadas API |
| **Português** | Todo texto visível ao usuário |
| **Max 200 linhas** | Separar UI de lógica |

### TypeScript Strict Mode (tsconfig.json)

O projeto usa TypeScript com configurações strict:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

**Isso significa:**
- Variáveis não utilizadas = erro
- Imports não utilizados = erro
- Parâmetros não utilizados = erro

### Padrões obrigatórios

| Evitar | Fazer |
|--------|-------|
| Componentes > 200 linhas | Separar UI de lógica em hooks |
| CSS inline ou arquivos CSS | Usar Tailwind classes |
| Lógica no componente | Extrair para hooks customizados |
| Console.logs | Remover antes do PR |
| Código comentado | Remover (Git tem histórico) |
| Texto em inglês | Usar português para UI |
| Sem acessibilidade | Adicionar tabIndex, aria-label |
| `function` keyword | Usar `const fn = () =>` |
| Ternário em className | Usar `clsx` ou `cn` utility |

### Estrutura de arquivos esperada

```
src/features/NomeFeature/
├── components/
│   ├── NomeComponente.tsx      # UI apenas (< 200 linhas)
│   └── __tests__/
│       └── NomeComponente.test.tsx
├── hooks/
│   ├── useNomeHook.ts          # Lógica extraída
│   └── __tests__/
│       └── useNomeHook.test.ts
├── services/
│   └── nomeService.ts          # Chamadas API
├── types/
│   └── index.ts                # TypeScript types
└── constants/
    └── index.ts                # Constantes e schemas Zod
```

### Padrão de Componentes

```typescript
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface NomeComponenteProps {
  prop1: string;
  prop2?: number;
  onAction: () => void;
}

export const NomeComponente = ({
  prop1,
  prop2 = 0,
  onAction,
}: NomeComponenteProps) => {
  // Early return para estados especiais
  if (!prop1) return null;

  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        onAction();
      }
    },
    [onAction]
  );

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-4",
        "hover:bg-muted transition-colors",
        "cursor-pointer rounded-lg"
      )}
      tabIndex={0}
      role="button"
      aria-label={`Ação para ${prop1}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="text-foreground">{prop1}</span>
      <span className="text-muted-foreground">{prop2}</span>
    </div>
  );
};
```

### Padrão de Hooks

```typescript
import { useState, useCallback, useMemo } from "react";

interface UseNomeHookReturn {
  data: DataType | null;
  isLoading: boolean;
  handleAction: () => void;
}

export const useNomeHook = (): UseNomeHookReturn => {
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(() => {
    setIsLoading(true);
    // lógica
    setIsLoading(false);
  }, []);

  return useMemo(
    () => ({
      data,
      isLoading,
      handleAction,
    }),
    [data, isLoading, handleAction]
  );
};
```

---

## Fase 4: Formulários e API

### React Hook Form + Zod (Obrigatório)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Definir schema Zod
const schema = z.object({
  email: z.string().email("Email inválido"),
  nome: z.string().min(2, "Nome muito curto"),
  telefone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// 2. Usar no componente
export const MeuFormulario = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // enviar dados
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("email")} placeholder="Email" />
        {errors.email && (
          <span className="text-destructive text-sm">
            {errors.email.message}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
};
```

### TanStack Query (Obrigatório)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// GET - useQuery
export const useGetDados = () => {
  return useQuery({
    queryKey: ["dados"],
    queryFn: async () => {
      const { data } = await axios.get("/api/v1/dados");
      return data;
    },
  });
};

// POST/PUT/DELETE - useMutation (OBRIGATÓRIO!)
export const useCreateDado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DadoType) => {
      const { data } = await axios.post("/api/v1/dados", payload);
      return data;
    },
    onSuccess: () => {
      // Invalidar cache para recarregar dados
      queryClient.invalidateQueries({ queryKey: ["dados"] });
    },
    onError: (error) => {
      // Tratar erro
      console.error("Erro ao criar:", error);
    },
  });
};

// Usar no componente
const MeuComponente = () => {
  const { data, isLoading } = useGetDados();
  const { mutate, isPending } = useCreateDado();

  const handleCreate = () => {
    mutate({ nome: "Novo dado" });
  };

  if (isLoading) return <Skeleton />;

  return <Button onClick={handleCreate} disabled={isPending}>Criar</Button>;
};
```

### Axios (Obrigatório para HTTP)

```typescript
// Em services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Fase 5: Acessibilidade

### Checklist de Acessibilidade (Obrigatório)

```
[ ] aria-label em elementos sem texto visível
[ ] tabIndex={0} em elementos clicáveis customizados
[ ] onKeyDown para suportar Enter e Space
[ ] role apropriado (button, link, etc)
[ ] Contraste adequado (dark mode incluso)
[ ] Focus visible em elementos interativos
```

### Exemplo Completo

```typescript
// CORRETO - Acessível
<div
  className="cursor-pointer hover:bg-muted"
  tabIndex={0}
  role="button"
  aria-label="Abrir menu de opções"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }}
>
  <MoreIcon className="h-4 w-4" />
</div>

// ERRADO - Não acessível
<div onClick={handleClick}>
  <MoreIcon />
</div>
```

### Dark Mode

O projeto usa dark mode via Tailwind. Testar ambos os modos:

```typescript
// Usar variáveis semânticas do Shadcn
className="bg-background text-foreground"
className="bg-muted text-muted-foreground"
className="border-border"

// NÃO usar cores fixas
className="bg-white text-black" // ERRADO
```

---

## Fase 6: Testes Locais

### Comandos obrigatórios

```bash
# 1. Lint (ESLint)
npm run lint

# 2. TypeScript (verificar tipos - strict mode!)
npx tsc --noEmit

# 3. Testes (Vitest)
npm run test:run

# 4. Build (verificar se compila)
npm run build
```

### Comando único

```bash
npm run lint && npx tsc --noEmit && npm run test:run && npm run build
```

### Padrão de Testes (Vitest + Testing Library)

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

describe("NomeComponente", () => {
  const defaultProps = {
    prop1: "valor",
    onAction: vi.fn(),
  };

  it("deve renderizar corretamente", () => {
    render(<NomeComponente {...defaultProps} />);

    expect(screen.getByText("valor")).toBeInTheDocument();
  });

  it("deve chamar onAction ao clicar", async () => {
    const user = userEvent.setup();
    const mockOnAction = vi.fn();

    render(<NomeComponente {...defaultProps} onAction={mockOnAction} />);

    await user.click(screen.getByRole("button"));

    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  it("deve chamar onAction ao pressionar Enter", async () => {
    const user = userEvent.setup();
    const mockOnAction = vi.fn();

    render(<NomeComponente {...defaultProps} onAction={mockOnAction} />);

    const element = screen.getByRole("button");
    element.focus();
    await user.keyboard("{Enter}");

    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  it("deve mostrar loading state", () => {
    render(<NomeComponente {...defaultProps} isLoading />);

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });
});
```

---

## Fase 7: Integração

### Verificar integração com main

```bash
# 1. Atualizar referências
git fetch origin

# 2. Ver quantos commits de diferença
git log origin/main..HEAD --oneline

# 3. Verificar se há conflitos
git merge origin/main --no-commit --no-ff

# Se houver conflitos:
git merge --abort
# Resolver conflitos ANTES de abrir PR

# 4. Ver todas as mudanças
git diff origin/main...HEAD --stat
```

---

## Fase 8: PR

### Template obrigatório

```markdown
## Tipo de mudança
- [ ] `feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `chore`

## Descrição
<!-- Descreva suas mudanças em detalhes -->

## Screenshots (se aplicável)
| Antes | Depois |
|-------|--------|
|       |        |

## Como foi testado?
- [ ] `npm run lint` passa
- [ ] `npm run build` compila
- [ ] Testes passam (`npm run test`)
- [ ] Testado manualmente no navegador
- [ ] Testado em diferentes tamanhos de tela
- [ ] Testado em dark mode

## Checklist
- [ ] Meu código segue o padrão de estilo do projeto
- [ ] Realizei self-review do meu código
- [ ] Componentes < 200 linhas
- [ ] React Hook Form + Zod para formulários
- [ ] TanStack Query (useQuery/useMutation) para API
- [ ] Acessibilidade (aria-label, tabIndex, onKeyDown)
- [ ] Textos em português

## PRs Relacionadas
<!-- Se houver PR de backend relacionada -->
- Backend: https://github.com/PostNow-AI/PostNow-REST-API/pull/XX
```

---

## Fase 9: Pós-Push

### Verificações automáticas (CI)

| Check | O que verifica | Bloqueia? |
|-------|----------------|-----------|
| Vercel Preview | Deploy funciona | Não |
| Lint | ESLint rules | **Sim** |
| TypeCheck | TypeScript strict | **Sim** |
| Tests | Vitest | **Sim** |
| Build | Vite build | **Sim** |

### Testar no Preview

1. Acessar URL de preview do Vercel
2. Testar fluxo completo manualmente
3. Testar responsividade:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)
4. Testar dark mode (toggle no header)
5. Testar acessibilidade (navegação por Tab)

---

## Fase 10: Pós-Merge

### Criar release

```bash
# 1. Atualizar main
git checkout main
git pull origin main

# 2. Incrementar versão
npm version patch -m "chore(release): v%s"   # Bug fix
npm version minor -m "chore(release): v%s"   # Nova feature
npm version major -m "chore(release): v%s"   # Breaking change

# 3. Push com tags
git push origin main --tags
```

O workflow `release.yml` cria automaticamente:
- Release no GitHub
- Changelog baseado nos commits
- Bundle size report

---

## Comandos Úteis

```bash
# === ANTES DO PR ===

# Atualizar e verificar integração
git fetch origin
git merge origin/main --no-commit --no-ff
git diff origin/main...HEAD --stat

# Todas as checagens de uma vez
npm run lint && npx tsc --noEmit && npm run test:run && npm run build

# === DURANTE DESENVOLVIMENTO ===

# Adicionar componente Shadcn
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form

# === PÓS-MERGE ===

# Release
npm version patch -m "chore(release): v%s"
git push origin main --tags
```

---

## Padrões React (Cursor Rules)

Temos regras configuradas em `.cursor/rules/` e `.github/copilot-instructions.md`:

### Principais Regras

1. **DRY Principle** - Não repetir código
2. **Early returns** - Para legibilidade
3. **Tailwind CSS only** - Evitar CSS customizado
4. **Shadcn components** - `npx shadcn@latest add <component>`
5. **Event naming** - Prefixo `handle` (handleClick, handleSubmit)
6. **Const functions** - `const fn = () =>` em vez de `function fn()`
7. **TanStack Query** - Para caching (useQuery) e mutations (useMutation)
8. **React Hook Form + Zod** - Para formulários
9. **Axios** - Para chamadas HTTP
10. **Português** - Todo texto visível ao usuário
11. **Max 200 linhas** - Por arquivo, separar UI de lógica
12. **Acessibilidade** - tabIndex, aria-label, onKeyDown

### Componentes Shadcn Disponíveis

```bash
# Instalados
Button, Card, Dialog, Form, Input, Label,
Select, Checkbox, RadioGroup, Switch, Tabs,
Accordion, Avatar, Badge, Skeleton, Toast (Sonner)

# Para adicionar novo
npx shadcn@latest add <nome>
```

---

## Feedbacks Recorrentes do CTO

### Problemas de UX (Alta Prioridade)

| Feedback | Solução |
|----------|---------|
| "Validação insuficiente" | Validar com Zod ANTES do envio |
| "Erro não redireciona pro campo" | Mostrar `errors.field.message` no campo |
| "Fluxo não testado" | Testar E2E manualmente antes do PR |
| "Não funciona em mobile" | Testar responsive em 375px, 768px, 1024px |

### Organização de PRs

| Feedback | Solução |
|----------|---------|
| "PR muito grande" | Dividir em PRs menores (< 500 linhas) |
| "Mistura features" | Uma responsabilidade por PR |
| "Falta PR de backend" | Linkar PRs relacionadas |

### Código

| Feedback | Solução |
|----------|---------|
| "Componente muito grande" | Extrair lógica para hooks (< 200 linhas) |
| "Não está acessível" | Adicionar aria-label, tabIndex, onKeyDown |
| "Texto em inglês" | Traduzir para português |

---

## Analytics (Microsoft Clarity)

O projeto usa Microsoft Clarity para analytics. Já está configurado, mas lembre-se:

- Não logar dados sensíveis
- Eventos importantes são trackeados automaticamente
- Tally forms também está integrado

---

## Sincronização com Backend

| API Version | UI Version | Compatível |
|-------------|------------|------------|
| v1.x.x | v1.x.x | Sim |
| v2.x.x | v1.x.x | Não |

**Regra:** O número MAJOR deve ser igual entre UI e API.

---

## Métricas de Qualidade

| Métrica | Valor Atual | Meta |
|---------|-------------|------|
| Taxa de aprovação na 1ª review | ~30% | >70% |
| Reviews médias por PR | 2-3 | 1-2 |
| Testes por feature | 15-57 | Mínimo 10 |

---

## Referências

- [VERSIONING.md](./VERSIONING.md) - Guia de versionamento
- [PR Template](../.github/PULL_REQUEST_TEMPLATE.md) - Template de PR
- [copilot-instructions.md](../.github/copilot-instructions.md) - Diretrizes de código
- [Cursor Rules](../.cursor/rules/) - Padrões de código
- [Conventional Commits](https://www.conventionalcommits.org/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Shadcn UI Docs](https://ui.shadcn.com/)

---

*Documento criado em Março/2026 baseado na análise de PRs, feedbacks do CTO, Cursor Rules e copilot-instructions.md.*
