const DataUtils = require('../../support/data-utils');

describe('API - Usuários', () => {
  it('deve realizar o fluxo completo de CRUD do usuário', () => {
    // Cria um usuário para validar a criação e os próximos passos do fluxo.
    const userData = DataUtils.apiUser('Usuário API');
    const { nome: name, email, password } = userData;
    const user = {
      nome: name,
      email,
      password,
      administrador: 'false',
    };

    cy.apiPost('/usuarios', user).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      expect(createResponse.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(createResponse.body).to.have.property('_id');
    });

    // Busca o usuário criado por nome para obter o ID que será usado nas próximas validações.
    cy.apiGet(`/usuarios?nome=${encodeURIComponent(name)}`).then((listResponse) => {
      expect(listResponse.status).to.eq(200);
      expect(listResponse.body).to.have.property('usuarios');
      expect(listResponse.body.usuarios.length).to.be.greaterThan(0);

      const userFound = listResponse.body.usuarios.find((item) => item.nome === name);
      expect(userFound).to.not.be.undefined;

      const userId = userFound._id;

      // Consulta os detalhes do usuário para validar que o registro está correto.
      cy.apiGet(`/usuarios/${userId}`).then((detailsResponse) => {
        expect(detailsResponse.status).to.eq(200);
        expect(detailsResponse.body).to.have.property('_id', userId);
        expect(detailsResponse.body).to.have.property('nome', name);
        expect(detailsResponse.body).to.have.property('email', email);
      });

      // Atualiza o nome do usuário para validar a edição do registro.
      const updatedName = DataUtils.updatedUserName(name);

      cy.apiPut(`/usuarios/${userId}`, {
        nome: updatedName,
        email,
        password,
        administrador: 'false',
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body).to.have.property('message', 'Registro alterado com sucesso');
      });

      // Remove o usuário e valida que a exclusão foi concluída com sucesso.
      cy.apiDelete(`/usuarios/${userId}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body).to.have.property('message', 'Registro excluído com sucesso');
      });

      // Confirma que o usuário deletado não aparece mais na busca por nome.
      cy.apiGet(`/usuarios?nome=${encodeURIComponent(updatedName)}`).then((deletedSearchResponse) => {
        expect(deletedSearchResponse.status).to.eq(200);
        expect(deletedSearchResponse.body).to.have.property('usuarios');
        expect(deletedSearchResponse.body.usuarios).to.have.length(0);
      });
    });
  });
});
