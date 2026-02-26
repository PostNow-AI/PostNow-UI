# Guia de Versionamento - PostNow

Este documento define as convenções de versionamento, branching e releases para os repositórios da PostNow.

## Índice

- [Semantic Versioning](#semantic-versioning)
- [Estratégia de Branching](#estratégia-de-branching)
- [Convenção de Commits](#convenção-de-commits)
- [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
- [Releases](#releases)
- [Exemplos Práticos](#exemplos-práticos)

---

## Semantic Versioning

Utilizamos [Semantic Versioning 2.0.0](https://semver.org/) no formato `MAJOR.MINOR.PATCH`:

```
v1.2.3
│ │ └── PATCH: correções de bugs (backward compatible)
│ └──── MINOR: novas funcionalidades (backward compatible)
└────── MAJOR: mudanças que quebram compatibilidade (breaking changes)
```

### Quando incrementar cada número

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| **MAJOR** | Breaking changes, redesign completo | Mudar framework, nova arquitetura |
| **MINOR** | Nova funcionalidade | Nova página, novo componente |
| **PATCH** | Bug fixes, ajustes visuais | Corrigir layout, fix em interação |

### Sufixos de pré-release

```
1.0.0-alpha.1    # Desenvolvimento inicial
1.0.0-beta.1     # Testes internos
1.0.0-rc.1       # Release candidate (quase pronto)
1.0.0            # Versão estável
```

---

## Estratégia de Branching

Utilizamos um fluxo **main/devel** com feature branches:

```
main (produção)
  │
  └── devel (desenvolvimento)
        │
        ├── feat/nova-funcionalidade
        ├── fix/corrigir-bug
        ├── refactor/melhorar-codigo
        └── hotfix/correcao-urgente (vai direto para main)
```

### Branches

| Branch | Propósito | Merge para |
|--------|-----------|------------|
| `main` | Produção (sempre deployável) | - |
| `devel` | Desenvolvimento e integração | `main` (quando estável) |
| `feat/*` | Novas funcionalidades | `devel` |
| `fix/*` | Correções de bugs | `devel` |
| `refactor/*` | Refatorações | `devel` |
| `hotfix/*` | Correções urgentes em produção | `main` (e depois `devel`) |

### Nomenclatura de branches

```bash
# Features
feat/adicionar-dark-mode
feat/insta-api
feat/radar

# Fixes
fix/corrigir-responsividade
fix/onboarding-data-persistence

# Outros
Dashboard-2.0
onboarding-2.1
POC/Rogerio

# Hotfixes (urgente, vai direto para main)
hotfix/corrigir-tela-branca
```

---

## Convenção de Commits

Utilizamos **Gitmoji + Conventional Commits**:

```
<tipo>: <emoji> <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos de commit com Gitmoji

| Tipo | Emoji | Código | Descrição | Versão |
|------|-------|--------|-----------|--------|
| `feat` | ✨ | `:sparkles:` | Nova funcionalidade | MINOR |
| `fix` | 🐛 | `:bug:` | Correção de bug | PATCH |
| `docs` | 📝 | `:memo:` | Documentação | - |
| `style` | 🎨 | `:art:` | Formatação/estrutura de código | - |
| `refactor` | ♻️ | `:recycle:` | Refatoração | - |
| `perf` | ⚡ | `:zap:` | Melhoria de performance | PATCH |
| `test` | ✅ | `:white_check_mark:` | Testes | - |
| `chore` | 🔧 | `:wrench:` | Configurações | - |
| `ci` | 👷 | `:construction_worker:` | CI/CD | - |
| `build` | 📦 | `:package:` | Build/dependências | - |
| `revert` | ⏪ | `:rewind:` | Reverter mudanças | - |
| `wip` | 🚧 | `:construction:` | Trabalho em progresso | - |
| `remove` | 🔥 | `:fire:` | Remover código/arquivos | - |

### Exemplos de commits (padrão da equipe)

```bash
# Feature
feat: :sparkles: Adiciona componente de dark mode

# Bug fix
fix: :bug: Strips html from text

# Refatoração
refactor: :art: Formats code for proper format

# Remover código
refactor: :fire: Removes unused files

# Fix de design
fix: :bug: Fixes credit page design
```

### Breaking Changes

Para breaking changes, adicione `!` após o tipo:

```bash
feat!: :sparkles: Remove suporte para navegadores antigos

BREAKING CHANGE: IE11 não é mais suportado
```

---

## Workflow de Desenvolvimento

### 1. Criar branch a partir de devel

```bash
git checkout devel
git pull origin devel
git checkout -b feat/minha-feature
```

### 2. Desenvolver e commitar

```bash
# Commits pequenos e frequentes
git add .
git commit -m "feat: :sparkles: Implementa funcionalidade X"
```

### 3. Abrir Pull Request para devel

```bash
git push origin feat/minha-feature
# Abrir PR: feat/minha-feature → devel
```

### 4. Code Review

- Mínimo 1 aprovação obrigatória
- CI deve passar (lint, typecheck, test, build)
- Resolver conflitos se houver

### 5. Merge para devel

- Squash merge para manter histórico limpo
- Feature integrada em devel

### 6. Release para main

Quando devel estiver estável:

```bash
git checkout main
git merge devel
npm version minor  # ou major/patch
git push origin main --tags
```

---

## Releases

### Fluxo de Release

```
feat/X ──┐
feat/Y ──┼──► devel ──► main ──► tag v1.x.0 ──► Release automática
fix/Z  ──┘
```

### Criando uma release

1. **Garantir que devel está estável**
2. **Merge devel → main**:
```bash
git checkout main
git pull origin main
git merge devel
```

3. **Atualizar versão e criar tag**:
```bash
npm version minor  # Atualiza package.json e cria tag
# ou
npm run release:minor
```

4. **Push**:
```bash
git push origin main --tags
```

5. **Release automática**: O workflow cria a release no GitHub automaticamente.

### Hotfix (correção urgente)

```bash
# 1. Branch a partir de main
git checkout main
git checkout -b hotfix/corrigir-bug-critico

# 2. Fix
git commit -m "fix: :bug: Corrige bug crítico em produção"

# 3. PR direto para main
git push origin hotfix/corrigir-bug-critico
# Abrir PR: hotfix/corrigir-bug-critico → main

# 4. Após merge, criar tag
git checkout main
git pull
npm version patch
git push origin main --tags

# 5. Sincronizar hotfix com devel
git checkout devel
git merge main
git push origin devel
```

---

## Exemplos Práticos

### Cenário 1: Nova feature de UI

```bash
# 1. Criar branch a partir de devel
git checkout devel
git pull origin devel
git checkout -b feat/adicionar-tema-escuro

# 2. Desenvolver e commitar
git commit -m "feat: :sparkles: Adiciona toggle de tema"
git commit -m "feat: :sparkles: Implementa CSS variables para dark mode"
git commit -m "test: :white_check_mark: Adiciona testes do ThemeProvider"

# 3. Push e PR para devel
git push origin feat/adicionar-tema-escuro
# Abrir PR: feat/adicionar-tema-escuro → devel

# 4. Após review e merge, feature está em devel
```

### Cenário 2: Bug fix visual

```bash
# 1. Branch a partir de devel
git checkout devel
git checkout -b fix/responsividade-sidebar

# 2. Fix
git commit -m "fix: :bug: Corrige overflow em telas pequenas"

# 3. PR para devel
git push origin fix/responsividade-sidebar
# Abrir PR: fix/responsividade-sidebar → devel
```

### Cenário 3: Hotfix urgente

```bash
# 1. Branch direto de main (não de devel!)
git checkout main
git checkout -b hotfix/tela-branca

# 2. Fix urgente
git commit -m "fix: :bug: Corrige erro que causava tela branca"

# 3. PR direto para main (bypass devel)
git push origin hotfix/tela-branca
# Abrir PR: hotfix/tela-branca → main

# 4. Após merge, atualizar versão
npm version patch
git push origin main --tags

# 5. Sincronizar com devel
git checkout devel
git merge main
git push origin devel
```

---

## Scripts de Release

O `package.json` inclui scripts para facilitar releases:

```bash
npm run release:patch   # 1.0.0 → 1.0.1 (bug fixes)
npm run release:minor   # 1.0.0 → 1.1.0 (novas features)
npm run release:major   # 1.0.0 → 2.0.0 (breaking changes)
```

---

## Sincronização com PostNow-REST-API

| API Version | UI Version | Compatível |
|-------------|------------|------------|
| v1.x.x | v1.x.x | ✅ Sim |
| v2.x.x | v1.x.x | ❌ Não |
| v2.x.x | v2.x.x | ✅ Sim |

**Regra**: O número MAJOR deve ser igual para garantir compatibilidade.

---

## Checklist de Release

- [ ] Todas as features/fixes em devel estão testadas
- [ ] CI passando (lint, typecheck, test, build)
- [ ] Merge devel → main feito
- [ ] Versão atualizada no package.json
- [ ] Tag criada
- [ ] Release automática gerada no GitHub
- [ ] Deploy em produção verificado (Vercel)
- [ ] devel sincronizado com main (se houve hotfix)
- [ ] Comunicar equipe sobre a release

---

## Branch Protection

### main
- ✅ PR obrigatório
- ✅ 1 aprovação mínima
- ✅ Dismiss stale reviews
- ✅ CI obrigatório (validate)
- ❌ Force push bloqueado

### devel
- ✅ PR obrigatório
- ✅ 1 aprovação mínima

---

## Referências

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Gitmoji](https://gitmoji.dev/)
- [npm version](https://docs.npmjs.com/cli/v8/commands/npm-version)
