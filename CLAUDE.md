# PostNow-UI - Guia para Claude

## Sobre o Projeto
- **Stack:** React 18 + TypeScript + Vite
- **Estilo:** Tailwind CSS + shadcn/ui
- **Testes:** Vitest + Testing Library
- **Lint:** ESLint com regras strict
- **Estado:** TanStack Query + React Context

## Regras de Qualidade TypeScript

### NUNCA fazer sem questionar o usuario:

1. **`@ts-nocheck` ou `@ts-ignore`**
   - Pergunta obrigatoria: "Precisa mesmo suprimir os erros de tipo? Posso corrigir os tipos reais."
   - Se o usuario insistir: documentar como divida tecnica

2. **`any` em mais de 2 lugares**
   - Sugerir tipos especificos antes de usar `any`
   - Se necessario: usar `unknown` com type guards

3. **`eslint-disable` em massa**
   - Corrigir os erros reais, nao suprimir
   - Se for regra problematica: ajustar config, nao desabilitar inline

4. **Catch vazio ou generico**
   - Sempre tratar ou logar erros
   - Nunca `catch (e) {}` ou `catch (_) {}`

### Regra de Ouro

> Antes de suprimir um erro, perguntar: "Isso RESOLVE o problema ou apenas ESCONDE?"

- Se esconde: corrigir o problema real
- Se nao tem como corrigir agora: criar issue documentando a divida tecnica

## Padroes de Codigo

### Componentes React
- Function components com TypeScript
- Props tipadas com interface (nao type)
- Hooks customizados em `/hooks`

### Imports
- Usar alias `@/` para imports absolutos
- Agrupar: externos, internos, tipos, estilos

### Testes
- Cobertura minima esperada: hooks e componentes criticos
- Mock de APIs externas obrigatorio
- Usar `data-testid` para queries de teste

### Commits
- Seguir Conventional Commits (feat, fix, docs, etc.)
- Mensagens em ingles ou portugues (consistente por PR)
- Co-author do Claude quando aplicavel

## Checklist Pre-PR

Antes de abrir PR, verificar:

- [ ] `npm run lint` passa sem erros
- [ ] `npm run test` passa (todos os testes)
- [ ] `npm run build` compila sem erros
- [ ] Nao usei `@ts-nocheck` sem justificativa
- [ ] Nao usei `any` sem necessidade
- [ ] Nao desabilitei regras de lint sem motivo

## Dividas Tecnicas Conhecidas

### @ts-nocheck em arquivos legados
- **Status:** ~40 arquivos com @ts-nocheck
- **Origem:** PR #33 (correcao de lint para CI passar)
- **Acao:** Remover gradualmente e corrigir tipos reais
- **Issue:** TODO - criar issue para tracking

## Contatos

- **CTO:** MatheusBlanco (GitHub)
- **Repositorio:** PostNow-AI/PostNow-UI
