/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Visitar página de onboarding
       */
      visitOnboarding(): Chainable<void>;

      /**
       * Avançar para o próximo step
       */
      clickNext(): Chainable<void>;

      /**
       * Voltar para o step anterior
       */
      clickBack(): Chainable<void>;
    }
  }
}

// Visit onboarding - aguarda a página carregar
Cypress.Commands.add('visitOnboarding', () => {
  cy.visit('/onboarding');
  // Aguarda qualquer elemento da página carregar
  cy.get('body').should('be.visible');
  // Aguarda um pouco para a aplicação React renderizar
  cy.wait(1000);
});

// Click next button
Cypress.Commands.add('clickNext', () => {
  cy.get('button').contains(/continuar|próximo|next|avançar/i).click();
});

// Click back button
Cypress.Commands.add('clickBack', () => {
  cy.get('button').contains(/voltar|back|anterior/i).click();
});

export {};
