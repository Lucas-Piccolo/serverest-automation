describe('Fluxo de Login', () => {
  it('deve realizar login com usuário válido', () => {
    const nome = `Usuário Login ${Date.now()}`;
    const email = `login_${Date.now()}@qa.com`;
    const senha = '123456';

    cy.visit('/cadastrarusuarios');
    cy.intercept('POST', '**/usuarios').as('createUser');

    cy.get('input[placeholder="Digite seu nome"]').type(nome);
    cy.get('input[placeholder="Digite seu email"]').type(email);
    cy.get('input[placeholder="Digite sua senha"]').type(senha);
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.contains('button', 'Cadastrar').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);

    cy.visit('/login');
    cy.get('input[placeholder="Digite seu email"]').type(email);
    cy.get('input[placeholder="Digite sua senha"]').type(senha);
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/home');
    cy.contains('h1', 'Bem Vindo').should('be.visible');
  });

  it('deve exibir erro ao tentar login com credenciais inválidas', () => {
    cy.visit('/login');
    cy.get('input[placeholder="Digite seu email"]').type('invalido@qa.com');
    cy.get('input[placeholder="Digite sua senha"]').type('senhaErrada');
    cy.contains('button', 'Entrar').click();

    cy.contains('Email e/ou senha inválidos').should('be.visible');
  });
});
