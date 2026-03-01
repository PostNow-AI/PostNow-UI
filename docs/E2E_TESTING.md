# Testes E2E com Cypress

**Data de criação:** 2026-02-28
**Framework:** Cypress

---

## Visão Geral

Este projeto usa Cypress para testes end-to-end (E2E) do fluxo de onboarding.

## Estrutura de Arquivos

```
cypress/
├── e2e/
│   ├── onboarding-creation.cy.ts   # Testes de criação de onboarding
│   └── onboarding-edit.cy.ts       # Testes de edição de onboarding
├── fixtures/
│   ├── onboarding-step1.json       # Dados de teste Step 1
│   └── onboarding-step2.json       # Dados de teste Step 2
├── support/
│   ├── commands.ts                 # Comandos customizados
│   └── e2e.ts                      # Setup E2E
└── screenshots/                    # Capturas automáticas
```

---

## Instalação

```bash
# Instalar Cypress
npm install --save-dev cypress

# Abrir Cypress (primeira vez - configura o projeto)
npx cypress open
```

---

## Comandos

```bash
# Abrir Cypress em modo interativo
npm run cypress:open

# Executar todos os testes E2E
npm run cypress:run

# Executar testes em modo headless
npm run cypress:run:headless

# Executar testes no Chrome
npm run cypress:run:chrome
```

---

## Comandos Customizados

### `cy.login(email?, password?)`
Faz login com usuário de teste.

```typescript
cy.login(); // usa credenciais padrão
cy.login('user@test.com', 'password123');
```

### `cy.visitOnboarding(mode?)`
Navega para a página de onboarding.

```typescript
cy.visitOnboarding('create'); // modo criação
cy.visitOnboarding('edit');   // modo edição
```

### `cy.fillOnboardingStep1(data)`
Preenche campos do Step 1.

```typescript
cy.fillOnboardingStep1({
  business_name: 'Meu Negócio',
  business_phone: '(11) 98765-4321',
  // ...
});
```

### `cy.fillOnboardingStep2(data)`
Preenche campos do Step 2.

```typescript
cy.fillOnboardingStep2({
  voice_tone: 'Profissional',
  colors: ['#FF6B6B', '#4ECDC4', ...],
  visual_style_ids: [1, 2, 3],
});
```

### `cy.submitStep()`
Clica no botão de submissão do step atual.

```typescript
cy.submitStep();
```

---

## Cenários de Teste

### Onboarding - Criação

| Teste | Descrição |
|-------|-----------|
| Validação de campos obrigatórios | Verifica erros ao submeter sem preencher |
| Validação de Instagram | Testa regex `^[a-zA-Z0-9._]{1,30}$` |
| Validação de Website | Testa URL válida com protocolo |
| Completar Step 1 | Preenche e submete Step 1 |
| Completar Step 2 | Preenche e submete Step 2 |
| Fluxo completo | Do início ao fim |

### Onboarding - Edição

| Teste | Descrição |
|-------|-----------|
| Carregamento de dados | Verifica campos pré-preenchidos |
| Edição de campos | Permite alterar dados existentes |
| Validação em edição | Valida campos editados |
| Persistência | Dados não são perdidos entre navegações |

---

## Fixtures

### `onboarding-step1.json`
Dados de teste para Step 1 (informações do negócio).

### `onboarding-step2.json`
Dados de teste para Step 2 (branding).

---

## Mocks de API

Os testes usam `cy.intercept()` para mockar respostas da API:

```typescript
cy.intercept('GET', '**/onboarding/status/**', { ... }).as('getStatus');
cy.intercept('PUT', '**/onboarding/step1/**', { ... }).as('submitStep1');
cy.intercept('PUT', '**/onboarding/step2/**', { ... }).as('submitStep2');
```

---

## CI/CD

Para integrar com GitHub Actions, adicione ao workflow:

```yaml
- name: Cypress run
  uses: cypress-io/github-action@v6
  with:
    build: npm run build
    start: npm run preview
    wait-on: 'http://localhost:4173'
```

---

## Debugging

### Screenshots
Capturas automáticas são salvas em `cypress/screenshots/` quando um teste falha.

### Videos
Vídeos das execuções são salvos em `cypress/videos/`.

### Console
Use `cy.log()` para debug:

```typescript
cy.log('Verificando campo:', fieldValue);
```

---

## Best Practices

1. **Use data-testid** para seletores estáveis
2. **Evite seletores frágeis** (classes CSS que podem mudar)
3. **Mock APIs** para testes determinísticos
4. **Use fixtures** para dados de teste reutilizáveis
5. **Aguarde chamadas de API** com `cy.wait('@alias')`

---

## Próximos Passos

- [ ] Adicionar testes de acessibilidade (cypress-axe)
- [ ] Configurar Cypress Dashboard para relatórios
- [ ] Integrar com CI/CD
- [ ] Adicionar testes de responsividade (mobile, tablet)
