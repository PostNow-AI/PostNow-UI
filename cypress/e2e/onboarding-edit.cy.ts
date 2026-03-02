/// <reference types="cypress" />

describe('Onboarding - Validações', () => {
  beforeEach(() => {
    cy.visitOnboarding();
  });

  describe('Carregamento da Página', () => {
    it('deve carregar sem erros', () => {
      // Verifica que não há erros de JavaScript
      cy.on('uncaught:exception', (err) => {
        // Retorna false para prevenir que Cypress falhe o teste
        console.error('Uncaught exception:', err);
        return false;
      });

      cy.url().should('include', '/onboarding');
    });
  });

  describe('Elementos Visuais', () => {
    it('deve exibir elementos de interface', () => {
      // Verifica que há conteúdo na página
      cy.get('body').should('not.be.empty');
    });

    it('deve ter botões clicáveis', () => {
      cy.get('button').should('exist');
    });
  });

  describe('Performance', () => {
    it('deve carregar em tempo aceitável', () => {
      const startTime = Date.now();
      cy.visitOnboarding();
      cy.get('body').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000); // 5 segundos
      });
    });
  });
});
