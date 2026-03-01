/// <reference types="cypress" />

describe('Onboarding - Fluxo de Criação', () => {
  beforeEach(() => {
    // Mock das chamadas de API
    cy.intercept('GET', '**/onboarding/status/**', {
      statusCode: 200,
      body: {
        onboarding_completed: false,
        step_1_completed: false,
        step_2_completed: false,
      },
    }).as('getOnboardingStatus');

    cy.intercept('PUT', '**/onboarding/step1/**', {
      statusCode: 200,
      body: {
        message: 'Step 1 completed successfully',
        step_1_completed: true,
      },
    }).as('submitStep1');

    cy.intercept('PUT', '**/onboarding/step2/**', {
      statusCode: 200,
      body: {
        message: 'Step 2 completed successfully',
        step_2_completed: true,
        onboarding_completed: true,
      },
    }).as('submitStep2');
  });

  describe('Step 1 - Business Info', () => {
    beforeEach(() => {
      cy.fixture('onboarding-step1.json').as('step1Data');
    });

    it('deve validar campos obrigatórios', () => {
      cy.visitOnboarding('create');

      // Tentar submeter sem preencher campos obrigatórios
      cy.submitStep();

      // Verificar mensagens de erro
      cy.get('[data-testid="error-message"]').should('be.visible');
    });

    it('deve validar formato do Instagram', function () {
      cy.visitOnboarding('create');

      // Instagram inválido (caracteres especiais)
      cy.get('input[name="business_instagram_handle"]').type('invalid@handle!');
      cy.get('input[name="business_instagram_handle"]').blur();

      cy.contains('Use apenas letras, números, _ e .').should('be.visible');

      // Instagram válido
      cy.get('input[name="business_instagram_handle"]').clear().type('valid_handle.123');
      cy.get('input[name="business_instagram_handle"]').blur();

      cy.contains('Use apenas letras, números, _ e .').should('not.exist');
    });

    it('deve validar formato do Website', function () {
      cy.visitOnboarding('create');

      // URL inválida
      cy.get('input[name="business_website"]').type('not-a-valid-url');
      cy.get('input[name="business_website"]').blur();

      cy.contains('URL inválida').should('be.visible');

      // URL válida
      cy.get('input[name="business_website"]').clear().type('https://www.example.com');
      cy.get('input[name="business_website"]').blur();

      cy.contains('URL inválida').should('not.exist');
    });

    it('deve completar Step 1 com sucesso', function () {
      cy.visitOnboarding('create');

      cy.fillOnboardingStep1(this.step1Data);
      cy.submitStep();

      cy.wait('@submitStep1').its('response.statusCode').should('eq', 200);
    });
  });

  describe('Step 2 - Branding', () => {
    beforeEach(() => {
      cy.fixture('onboarding-step2.json').as('step2Data');

      // Simular que Step 1 já foi completado
      cy.intercept('GET', '**/onboarding/status/**', {
        statusCode: 200,
        body: {
          onboarding_completed: false,
          step_1_completed: true,
          step_2_completed: false,
        },
      }).as('getOnboardingStatus');
    });

    it('deve permitir selecionar tom de voz', function () {
      cy.visitOnboarding('create');

      cy.get('input[name="voice_tone"]').type(this.step2Data.voice_tone);
      cy.get('input[name="voice_tone"]').should('have.value', this.step2Data.voice_tone);
    });

    it('deve permitir selecionar cores da marca', function () {
      cy.visitOnboarding('create');

      // Verificar que existem 5 color pickers
      cy.get('[data-testid^="color-picker-"]').should('have.length', 5);
    });

    it('deve permitir selecionar estilos visuais', function () {
      cy.visitOnboarding('create');

      // Verificar que existem opções de estilos visuais
      cy.get('[data-testid^="visual-style-"]').should('exist');
    });

    it('deve completar Step 2 com sucesso', function () {
      cy.visitOnboarding('create');

      cy.fillOnboardingStep2(this.step2Data);
      cy.submitStep();

      cy.wait('@submitStep2').its('response.statusCode').should('eq', 200);
    });
  });

  describe('Fluxo Completo', () => {
    beforeEach(() => {
      cy.fixture('onboarding-step1.json').as('step1Data');
      cy.fixture('onboarding-step2.json').as('step2Data');
    });

    it('deve completar onboarding do início ao fim', function () {
      cy.visitOnboarding('create');

      // Step 1
      cy.fillOnboardingStep1(this.step1Data);
      cy.submitStep();
      cy.wait('@submitStep1');

      // Step 2
      cy.fillOnboardingStep2(this.step2Data);
      cy.submitStep();
      cy.wait('@submitStep2');

      // Verificar que onboarding foi completado
      cy.url().should('not.include', '/onboarding');
    });
  });
});
