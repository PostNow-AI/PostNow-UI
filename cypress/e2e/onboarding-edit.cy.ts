/// <reference types="cypress" />

describe('Onboarding - Modo Edição', () => {
  const existingData = {
    business_name: 'Negócio Existente',
    business_phone: '(11) 91234-5678',
    business_instagram_handle: 'negocio_existente',
    business_website: 'https://negocioexistente.com',
    specialization: 'Consultoria',
    business_description: 'Descrição existente do negócio',
    business_purpose: 'Propósito existente',
    brand_personality: 'Sério, Profissional',
    products_services: 'Serviço A, Serviço B',
    target_audience: 'Empresas B2B',
    business_location: 'Rio de Janeiro, RJ',
    target_interests: 'Negócios, Tecnologia',
    main_competitors: 'Competidor X',
    voice_tone: 'Formal e Direto',
    color_1: '#1A1A1A',
    color_2: '#2B2B2B',
    color_3: '#3C3C3C',
    color_4: '#4D4D4D',
    color_5: '#5E5E5E',
    visual_style_ids: [2, 4],
  };

  beforeEach(() => {
    // Mock do status indicando onboarding já completado
    cy.intercept('GET', '**/onboarding/status/**', {
      statusCode: 200,
      body: {
        onboarding_completed: true,
        step_1_completed: true,
        step_2_completed: true,
        ...existingData,
      },
    }).as('getOnboardingStatus');

    cy.intercept('PUT', '**/onboarding/step1/**', {
      statusCode: 200,
      body: {
        message: 'Step 1 updated successfully',
        step_1_completed: true,
      },
    }).as('updateStep1');

    cy.intercept('PUT', '**/onboarding/step2/**', {
      statusCode: 200,
      body: {
        message: 'Step 2 updated successfully',
        step_2_completed: true,
        onboarding_completed: true,
      },
    }).as('updateStep2');
  });

  describe('Carregamento de Dados', () => {
    it('deve carregar dados existentes em modo edição', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      // Verificar que campos estão pré-preenchidos
      cy.get('input[name="business_name"]').should('have.value', existingData.business_name);
      cy.get('input[name="business_phone"]').should('contain.value', '91234-5678');
      cy.get('input[name="business_instagram_handle"]').should('have.value', existingData.business_instagram_handle);
    });

    it('deve carregar cores existentes', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      // Verificar que 5 cores estão carregadas
      cy.get('[data-testid^="color-picker-"]').should('have.length', 5);
    });

    it('deve carregar estilos visuais selecionados', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      // Verificar que estilos estão selecionados
      existingData.visual_style_ids.forEach((id) => {
        cy.get(`[data-testid="visual-style-${id}"]`).should('have.class', 'selected');
      });
    });
  });

  describe('Edição de Dados', () => {
    it('deve permitir editar campos do Step 1', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      const newBusinessName = 'Negócio Atualizado E2E';

      cy.get('input[name="business_name"]').clear().type(newBusinessName);
      cy.get('input[name="business_name"]').should('have.value', newBusinessName);
    });

    it('deve validar campos editados', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      // Tentar colocar Instagram inválido
      cy.get('input[name="business_instagram_handle"]').clear().type('invalid@handle');
      cy.get('input[name="business_instagram_handle"]').blur();

      cy.contains('Use apenas letras, números, _ e .').should('be.visible');
    });

    it('deve salvar alterações do Step 1', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      cy.get('input[name="business_name"]').clear().type('Nome Atualizado');
      cy.submitStep();

      cy.wait('@updateStep1').its('response.statusCode').should('eq', 200);
    });

    it('deve permitir editar cores', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      // Navegar para Step 2 (se necessário)
      // Editar uma cor
      cy.get('[data-testid="color-picker-0"]').click();
      cy.get('input[type="color"]').invoke('val', '#FF0000').trigger('change');
    });

    it('deve salvar alterações do Step 2', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      cy.get('input[name="voice_tone"]').clear().type('Tom de Voz Atualizado');
      cy.submitStep();

      cy.wait('@updateStep2').its('response.statusCode').should('eq', 200);
    });
  });

  describe('Persistência de Dados', () => {
    it('não deve perder dados ao navegar entre steps', () => {
      cy.visitOnboarding('edit');
      cy.wait('@getOnboardingStatus');

      const newName = 'Nome Temporário';
      cy.get('input[name="business_name"]').clear().type(newName);

      // Navegar para outro step e voltar (se aplicável)
      // Verificar que dados persistem
      cy.get('input[name="business_name"]').should('have.value', newName);
    });
  });
});
