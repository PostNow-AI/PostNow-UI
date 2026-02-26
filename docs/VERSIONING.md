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

| Tipo | Descrição | Exemplo para UI |
|------|-----------|-----------------|
| **MAJOR** | Breaking changes, redesign completo | Nova arquitetura de componentes, mudança de framework |
| **MINOR** | Nova funcionalidade | Nova página, novo componente, nova feature |
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

Utilizamos **GitHub Flow** adaptado para deploy contínuo:

```
main (produção)
  │
  ├── feature/nova-funcionalidade
  ├── fix/corrigir-bug
  ├── hotfix/correcao-urgente
  └── release/v1.2.0
```

### Branches

| Branch | Propósito | Merge para |
|--------|-----------|------------|
| `main` | Produção (sempre deployável) | - |
| `feature/*` | Novas funcionalidades | `main` |
| `fix/*` | Correções de bugs | `main` |
| `hotfix/*` | Correções urgentes em produção | `main` |
| `release/*` | Preparação de release | `main` |

### Nomenclatura de branches

```bash
# Features
feature/adicionar-dark-mode
feature/PN-123-nova-dashboard    # Com ticket

# Fixes
fix/corrigir-responsividade-mobile
fix/PN-456-botao-nao-funciona

# Hotfixes (urgente)
hotfix/corrigir-tela-branca

# Releases
release/v1.2.0
```

---

## Convenção de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

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
| `style` | Formatação, CSS (não afeta lógica) | - |
| `refactor` | Refatoração sem mudança de comportamento | - |
| `perf` | Melhoria de performance | PATCH |
| `test` | Adicionar/corrigir testes | - |
| `chore` | Manutenção (deps, configs) | - |
| `ci` | Mudanças em CI/CD | - |

### Breaking Changes

Para breaking changes, adicione `!` após o tipo:

```bash
feat!: remover suporte para navegadores antigos

BREAKING CHANGE: IE11 não é mais suportado
```

### Exemplos de commits

```bash
# Feature simples
feat(dashboard): adicionar gráfico de engajamento

# Fix com escopo
fix(auth): corrigir redirect após login

# Estilo/UI
style(button): ajustar padding do botão primário

# Refatoração
refactor(hooks): extrair lógica de useAuth

# Dependências
chore(deps): atualizar React para v19
```

---

## Workflow de Desenvolvimento

### 1. Criar branch a partir de main

```bash
git checkout main
git pull origin main
git checkout -b feature/minha-feature
```

### 2. Desenvolver e commitar

```bash
# Commits pequenos e frequentes
git add .
git commit -m "feat(componente): implementar funcionalidade X"
```

### 3. Abrir Pull Request

```bash
git push origin feature/minha-feature
# Abrir PR no GitHub
```

### 4. Code Review

- Mínimo 1 aprovação
- CI deve passar
- Resolver conflitos se houver

### 5. Merge e Deploy

- Squash merge para manter histórico limpo
- Deploy automático via Vercel

---

## Releases

### Atualizando a versão

Use os comandos do npm para atualizar a versão no `package.json`:

```bash
# Para bug fixes (1.0.0 -> 1.0.1)
npm version patch

# Para novas features (1.0.0 -> 1.1.0)
npm version minor

# Para breaking changes (1.0.0 -> 2.0.0)
npm version major

# Para pré-releases
npm version prerelease --preid=beta  # 1.0.0 -> 1.0.1-beta.0
```

### Criando uma release

1. **Atualizar versão**:
```bash
npm version minor -m "chore(release): v%s"
```

2. **Push com tags**:
```bash
git push origin main --tags
```

3. **Criar Release no GitHub**:
   - Ir em Releases > Draft new release
   - Selecionar a tag
   - Gerar release notes automaticamente
   - Publicar

---

## Exemplos Práticos

### Cenário 1: Nova feature de UI

```bash
# 1. Criar branch
git checkout -b feature/adicionar-tema-escuro

# 2. Desenvolver e commitar
git commit -m "feat(theme): adicionar toggle de tema"
git commit -m "feat(theme): implementar CSS variables para dark mode"
git commit -m "style(theme): ajustar cores do dark mode"
git commit -m "test(theme): adicionar testes do ThemeProvider"

# 3. Push e PR
git push origin feature/adicionar-tema-escuro
# Abrir PR: "feat: adicionar suporte a tema escuro"

# 4. Após merge, atualizar versão
git checkout main
git pull
npm version minor -m "chore(release): v%s - Dark Mode"
git push origin main --tags
```

### Cenário 2: Bug fix visual

```bash
# 1. Criar branch
git checkout -b fix/responsividade-sidebar

# 2. Fix
git commit -m "fix(sidebar): corrigir overflow em telas pequenas"

# 3. PR e merge
git push origin fix/responsividade-sidebar

# 4. Patch release
git checkout main
git pull
npm version patch -m "chore(release): v%s"
git push origin main --tags
```

### Cenário 3: Hotfix urgente

```bash
# 1. Criar branch direto de main
git checkout main
git checkout -b hotfix/tela-branca-dashboard

# 2. Fix rápido
git commit -m "fix(dashboard): corrigir erro que causava tela branca"

# 3. PR prioritário
git push origin hotfix/tela-branca-dashboard
# Abrir PR com label "hotfix", merge rápido

# 4. Patch imediato
git checkout main
git pull
npm version patch -m "chore(release): v%s - Hotfix"
git push origin main --tags
```

---

## Sincronização com PostNow-REST-API

Para manter compatibilidade entre UI e API:

| API Version | UI Version | Compatível |
|-------------|------------|------------|
| v1.x.x | v1.x.x | Sim |
| v2.x.x | v1.x.x | Não |
| v2.x.x | v2.x.x | Sim |

**Regra**: O número MAJOR deve ser igual entre UI e API para garantir compatibilidade.

### Variáveis de ambiente

Considere adicionar a versão da API esperada:

```env
VITE_API_VERSION=v1
VITE_APP_VERSION=$npm_package_version
```

---

## Checklist de Release

- [ ] Todos os PRs da release foram merged
- [ ] `npm run build` passa sem erros
- [ ] `npm run test` passa
- [ ] Versão atualizada no package.json
- [ ] Tag criada com `npm version`
- [ ] Release notes geradas no GitHub
- [ ] Deploy em produção verificado (Vercel)
- [ ] Testar funcionalidades principais em produção
- [ ] Comunicar equipe sobre a release

---

## Scripts úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "release:patch": "npm version patch -m 'chore(release): v%s'",
    "release:minor": "npm version minor -m 'chore(release): v%s'",
    "release:major": "npm version major -m 'chore(release): v%s'"
  }
}
```

---

## Referências

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [npm version](https://docs.npmjs.com/cli/v8/commands/npm-version)
