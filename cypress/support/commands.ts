/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login com usuário de teste
       */
      login(email?: string, password?: string): Chainable<void>;

      /**
       * Visitar página de onboarding
       */
      visitOnboarding(mode?: 'create' | 'edit'): Chainable<void>;

      /**
       * Preencher Step 1 do onboarding
       */
      fillOnboardingStep1(data: OnboardingStep1Data): Chainable<void>;

      /**
       * Preencher Step 2 do onboarding
       */
      fillOnboardingStep2(data: OnboardingStep2Data): Chainable<void>;

      /**
       * Submeter step atual
       */
      submitStep(): Chainable<void>;
    }
  }
}

interface OnboardingStep1Data {
  business_name?: string;
  business_phone?: string;
  business_instagram_handle?: string;
  business_website?: string;
  specialization?: string;
  business_description?: string;
  business_purpose?: string;
  brand_personality?: string;
  products_services?: string;
  target_audience?: string;
  business_location?: string;
  target_interests?: string;
  main_competitors?: string;
}

interface OnboardingStep2Data {
  voice_tone?: string;
  colors?: string[];
  visual_style_ids?: number[];
}

// Login command
Cypress.Commands.add('login', (email = 'test@example.com', password = 'testpassword') => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

// Visit onboarding
Cypress.Commands.add('visitOnboarding', (mode = 'create') => {
  if (mode === 'edit') {
    cy.visit('/onboarding?mode=edit');
  } else {
    cy.visit('/onboarding');
  }
  cy.get('[data-testid="onboarding-container"]', { timeout: 10000 }).should('be.visible');
});

// Fill Step 1
Cypress.Commands.add('fillOnboardingStep1', (data: OnboardingStep1Data) => {
  if (data.business_name) {
    cy.get('input[name="business_name"]').clear().type(data.business_name);
  }
  if (data.business_phone) {
    cy.get('input[name="business_phone"]').clear().type(data.business_phone);
  }
  if (data.business_instagram_handle) {
    cy.get('input[name="business_instagram_handle"]').clear().type(data.business_instagram_handle);
  }
  if (data.business_website) {
    cy.get('input[name="business_website"]').clear().type(data.business_website);
  }
  if (data.specialization) {
    cy.get('input[name="specialization"]').clear().type(data.specialization);
  }
  if (data.business_description) {
    cy.get('textarea[name="business_description"]').clear().type(data.business_description);
  }
  if (data.business_purpose) {
    cy.get('textarea[name="business_purpose"]').clear().type(data.business_purpose);
  }
  if (data.brand_personality) {
    cy.get('input[name="brand_personality"]').clear().type(data.brand_personality);
  }
  if (data.products_services) {
    cy.get('textarea[name="products_services"]').clear().type(data.products_services);
  }
  if (data.target_audience) {
    cy.get('input[name="target_audience"]').clear().type(data.target_audience);
  }
  if (data.business_location) {
    cy.get('input[name="business_location"]').clear().type(data.business_location);
  }
  if (data.target_interests) {
    cy.get('input[name="target_interests"]').clear().type(data.target_interests);
  }
  if (data.main_competitors) {
    cy.get('input[name="main_competitors"]').clear().type(data.main_competitors);
  }
});

// Fill Step 2
Cypress.Commands.add('fillOnboardingStep2', (data: OnboardingStep2Data) => {
  if (data.voice_tone) {
    cy.get('input[name="voice_tone"]').clear().type(data.voice_tone);
  }
  if (data.colors && data.colors.length > 0) {
    data.colors.forEach((color, index) => {
      cy.get(`[data-testid="color-picker-${index}"]`).click();
      cy.get('input[type="color"]').invoke('val', color).trigger('change');
    });
  }
  if (data.visual_style_ids && data.visual_style_ids.length > 0) {
    data.visual_style_ids.forEach((id) => {
      cy.get(`[data-testid="visual-style-${id}"]`).click();
    });
  }
});

// Submit step
Cypress.Commands.add('submitStep', () => {
  cy.get('button').contains(/continuar|próximo|salvar/i).click();
});

export {};
