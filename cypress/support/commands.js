Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[placeholder="Digite seu email"]').clear().type(email);
    cy.get('input[placeholder="Digite sua senha"]').clear().type(password);
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/home');
  });
});

Cypress.Commands.add('cadastroUsuario', (nome, email, senha, isAdmin = false) => {
  cy.visit('/cadastrarusuarios');
  cy.get('input[placeholder="Digite seu nome"]').clear().type(nome);
  cy.get('input[placeholder="Digite seu email"]').clear().type(email);
  cy.get('input[placeholder="Digite sua senha"]').clear().type(senha);

  if (isAdmin) {
    cy.get('input[type="checkbox"]').check({ force: true });
  }

  cy.contains('button', 'Cadastrar').click();
});