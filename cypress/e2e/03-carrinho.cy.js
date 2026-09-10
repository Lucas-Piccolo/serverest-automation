describe('Fluxo de compra', () => {
  beforeEach(() => {
    // Cria um usuário para realizar login e acessar o fluxo autenticado de compra.
    const nome = `Carrinho Usuario ${Date.now()}`;
    const email = `carrinho_${Date.now()}@qa.com`;
    const senha = '123456';

    cy.cadastroUsuario(nome, email, senha, false);

    // Realiza o login antes de interagir com os produtos.
    cy.visit('/login');
    cy.get('input[placeholder="Digite seu email"]').type(email);
    cy.get('input[placeholder="Digite sua senha"]').type(senha);
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/home');
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
