describe('API - Produtos', () => {
  let token;

  const adminUser = {
    nome: `Admin Produto ${Date.now()}`,
    email: `admin_produto_${Date.now()}@qa.com`,
    password: '123456',
    administrador: 'true',
  };

  beforeEach(() => {
    cy.apiPost('/usuarios', adminUser).then((userResponse) => {
      expect(userResponse.status).to.eq(201);
      expect(userResponse.body).to.have.property('message', 'Cadastro realizado com sucesso');

      cy.loginApi(adminUser.email, adminUser.password).then((authToken) => {
        token = authToken;
      });
    });
  });

  it('deve realizar o fluxo completo de CRUD do produto', () => {
    const productName = `Produto API ${Date.now()}`;
    const product = {
      nome: productName,
      preco: 100,
      descricao: 'Produto de teste Cypress',
      quantidade: 10,
    };

    cy.createProductApi(product, token).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      expect(createResponse.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(createResponse.body).to.have.property('_id');

      const productIdFromCreate = createResponse.body._id;

      cy.apiGet(`/produtos?nome=${encodeURIComponent(productName)}`).then((listResponse) => {
        expect(listResponse.status).to.eq(200);
        expect(listResponse.body).to.have.property('produtos');

        const productFound = listResponse.body.produtos.find((item) => item.nome === productName);
        expect(productFound).to.not.be.undefined;

        const productId = productFound._id;
        expect(productId).to.eq(productIdFromCreate);

        cy.apiGet(`/produtos/${productId}`).then((detailsResponse) => {
          expect(detailsResponse.status).to.eq(200);
          expect(detailsResponse.body).to.have.property('_id', productId);
          expect(detailsResponse.body).to.have.property('nome', productName);
          expect(detailsResponse.body).to.have.property('preco', product.preco);
          expect(detailsResponse.body).to.have.property('descricao', product.descricao);
        });

        const updatedName = `${productName}01`;

        cy.apiPut(`/produtos/${productId}`, {
          nome: updatedName,
          preco: 200,
          descricao: 'Produto editado por Cypress',
          quantidade: 7,
        }, token).then((updateResponse) => {
          expect(updateResponse.status).to.eq(200);
          expect(updateResponse.body).to.have.property('message', 'Registro alterado com sucesso');

          cy.apiDelete(`/produtos/${productId}`, token).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200);
            expect(deleteResponse.body).to.have.property('message', 'Registro excluído com sucesso');

            cy.request({
              method: 'GET',
              url: `https://serverest.dev/produtos/${productId}`,
              failOnStatusCode: false,
            }).then((deletedResponse) => {
              expect(deletedResponse.status).to.eq(400);
              expect(deletedResponse.body).to.have.property('message', 'Produto não encontrado');
            });
          });
        });
      });
    });
  });
});
