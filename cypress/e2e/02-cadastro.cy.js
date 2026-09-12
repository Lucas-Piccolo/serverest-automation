const DataUtils = require('../support/data-utils');

describe('Fluxo de Cadastro', () => {
  beforeEach(() => {
    // Abre a tela de cadastro antes de cada cenário.
    cy.visit('/cadastrarusuarios');
  });

  it('deve cadastrar um novo usuário com sucesso', () => {
    // Preenche os dados e realiza o cadastro de um novo usuário.
    const user = DataUtils.webUser('Teste Cypress');

    cy.cadastroUsuario(user.nome, user.email, user.senha, user.isAdmin);
  });

  it('deve impedir cadastro com email duplicado', () => {
    const duplicateUser = DataUtils.duplicateUser();

    // Tenta cadastrar um usuário com email já existente para validar a regra de negócio.
    cy.get('input[placeholder="Digite seu nome"]').type(duplicateUser.nome);
    cy.get('input[placeholder="Digite seu email"]').type(duplicateUser.email);
    cy.get('input[placeholder="Digite sua senha"]').type(duplicateUser.senha);
    cy.contains('button', 'Cadastrar').click();

    cy.contains('Este email já está sendo usado').should('be.visible');
  });
});
