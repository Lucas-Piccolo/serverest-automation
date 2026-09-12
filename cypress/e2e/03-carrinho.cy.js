const DataUtils = require('../support/data-utils');

describe('Fluxo de compra', () => {
  beforeEach(() => {
    // Cria um usuário para realizar login e acessar o fluxo autenticado de compra.
    const user = DataUtils.webUser('Carrinho Usuario');

    cy.cadastroUsuario(user.nome, user.email, user.senha, user.isAdmin);
    cy.login(user.email, user.senha);
  });

  it('deve adicionar um produto da lista ao carrinho e validar a tela de carrinho', () => {
    // Adiciona o primeiro produto da lista ao carrinho.
    cy.get('button').contains('Adicionar a lista').first().click();
    cy.url().should('include', '/minhaListaDeProdutos');

    cy.contains('button', 'Adicionar no carrinho').click();

    // Valida que o produto foi adicionado e que a tela do carrinho foi exibida.
    cy.url().should('include', '/carrinho');
    cy.get('h1').should('contain.text', 'Em construção aguarde');
  });
});
