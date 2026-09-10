describe('Fluxo de Cadastro', () => {
  beforeEach(() => {
    cy.visit('/cadastrarusuarios');
  });

  it('deve cadastrar um novo usuário com sucesso', () => {
    const nome = `Teste Cypress ${Date.now()}`;
    const email = `cypress_${Date.now()}@qa.com`;
    const senha = '123456';

    cy.intercept('POST', '**/usuarios').as('createUser');

    cy.get('input[placeholder="Digite seu nome"]').type(nome);
    cy.get('input[placeholder="Digite seu email"]').type(email);
    cy.get('input[placeholder="Digite sua senha"]').type(senha);
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.contains('button', 'Cadastrar').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);
    cy.url().should('include', '/home');
    cy.contains('h1', 'Bem Vindo').should('be.visible');
  });

  it('deve impedir cadastro com email duplicado', () => {
    cy.get('input[placeholder="Digite seu nome"]').type('Usuário duplicado');
    cy.get('input[placeholder="Digite seu email"]').type('fulano@qa.com');
    cy.get('input[placeholder="Digite sua senha"]').type('123456');
    cy.contains('button', 'Cadastrar').click();

    cy.contains('Este email já está sendo usado').should('be.visible');
  });
});
