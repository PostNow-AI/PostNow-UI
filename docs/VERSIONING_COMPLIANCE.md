# Relatório de Conformidade de Versionamento

**Data:** 01/03/2026
**Versão:** v1.1.0

---

## Status de Conformidade

| Aspecto | Status |
|---------|--------|
| Entregas Atuais (PRs) | Conforme |
| Conventional Commits | Conforme |
| Branch Naming | Conforme |
| Documentação | Conforme |

---

## Versão Atual

- **Versão:** v1.1.0 (MINOR)
- **Tipo:** Features + Bug Fixes
- **Mudanças:**
  - Cypress E2E tests
  - Melhorias de validação
  - Correções de bugs no onboarding

---

## Padrões Implementados

### 1. Branch Naming Convention

Padrão obrigatório para novos branches:

```
feature/*  - Novas funcionalidades
fix/*      - Correções de bugs
docs/*     - Documentação
refactor/* - Refatoração de código
test/*     - Testes
chore/*    - Manutenção
hotfix/*   - Correções urgentes
```

**Nota:** `feat/*` está deprecado. Use `feature/*`.

### 2. Conventional Commits

Formato obrigatório para commits:

```
type(scope): description
type(scope): :emoji: description
type: description
```

Tipos válidos:
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação
- `refactor` - Refatoração
- `perf` - Performance
- `test` - Testes
- `build` - Build
- `ci` - CI/CD
- `chore` - Manutenção
- `revert` - Reverter commit

### 3. Gitmoji (Opcional)

Emojis comuns:
- `:sparkles:` - Nova feature
- `:bug:` - Bug fix
- `:memo:` - Documentação
- `:recycle:` - Refactoring
- `:white_check_mark:` - Testes
- `:bookmark:` - Release

---

## Ferramentas Instaladas

### Scripts

| Script | Descrição |
|--------|-----------|
| `scripts/release.sh` | Cria releases automatizados |
| `scripts/commit-msg` | Hook de validação de commits |
| `scripts/install-hooks.sh` | Instala git hooks |
| `npm run release:minor` | npm version minor |
| `npm run release:patch` | npm version patch |

### GitHub Actions

| Workflow | Descrição |
|----------|-----------|
| `branch-validation.yml` | Valida nomes de branches em PRs |

---

## Próximos Passos

1. [ ] Instalar hooks localmente: `./scripts/install-hooks.sh`
2. [ ] Ativar branch protection em `main`
3. [ ] Arquivar branches antigos não conformes
4. [ ] Após merge dos PRs, criar tag: `npm run release:minor`

---

## Histórico de Releases

| Versão | Data | Tipo | Descrição |
|--------|------|------|-----------|
| v1.1.0 | 2026-03-01 | MINOR | Features + Bugfixes onboarding |
| v1.0.0 | - | MAJOR | Release inicial |
