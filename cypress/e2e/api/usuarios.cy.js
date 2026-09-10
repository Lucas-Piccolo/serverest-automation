describe('API - Usuários', () => {
  it('deve realizar o fluxo completo de CRUD do usuário', () => {
    const name = `Usuário API ${Date.now()}`;
    const email = `usuario_api_${Date.now()}@qa.com`;
    const password = '123456';
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

    cy.apiGet(`/usuarios?nome=${encodeURIComponent(name)}`).then((listResponse) => {
      expect(listResponse.status).to.eq(200);
      expect(listResponse.body).to.have.property('usuarios');
      expect(listResponse.body.usuarios.length).to.be.greaterThan(0);

      const userFound = listResponse.body.usuarios.find((item) => item.nome === name);
      expect(userFound).to.not.be.undefined;

      const userId = userFound._id;

      cy.apiGet(`/usuarios/${userId}`).then((detailsResponse) => {
        expect(detailsResponse.status).to.eq(200);
        expect(detailsResponse.body).to.have.property('_id', userId);
        expect(detailsResponse.body).to.have.property('nome', name);
        expect(detailsResponse.body).to.have.property('email', email);
      });

      const updatedName = `${name}01`;

      cy.apiPut(`/usuarios/${userId}`, {
        nome: updatedName,
        email,
        password,
        administrador: 'false',
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body).to.have.property('message', 'Registro alterado com sucesso');
      });

      cy.apiDelete(`/usuarios/${userId}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body).to.have.property('message', 'Registro excluído com sucesso');
      });

      cy.apiGet(`/usuarios?nome=${encodeURIComponent(updatedName)}`).then((deletedSearchResponse) => {
        expect(deletedSearchResponse.status).to.eq(200);
        expect(deletedSearchResponse.body).to.have.property('usuarios');
        expect(deletedSearchResponse.body.usuarios).to.have.length(0);
      });
    });
  });
});
