const DataUtils = require('../support/data-utils');

describe('Fluxo de Login', () => {
  it('deve realizar login com usuário válido', () => {
    // Cria um usuário antes do login para garantir que as credenciais sejam válidas.
    const user = DataUtils.webUser('Usuário Login', true);

    cy.cadastroUsuario(user.nome, user.email, user.senha, user.isAdmin);
    cy.login(user.email, user.senha);

  });

  it('deve exibir erro ao tentar login com credenciais inválidas', () => {
    // Tenta autenticar com credenciais inválidas para validar a mensagem de erro.
    const invalidUser = DataUtils.invalidLogin();

    cy.visit('/login');
    cy.get('input[placeholder="Digite seu email"]').type(invalidUser.email);
    cy.get('input[placeholder="Digite sua senha"]').type(invalidUser.password);
    cy.contains('button', 'Entrar').click();

    cy.contains('Email e/ou senha inválidos').should('be.visible');
  });
});
