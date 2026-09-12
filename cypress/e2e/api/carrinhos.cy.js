const DataUtils = require('../../support/data-utils');

describe('API - Carrinhos', () => {
  const createAdminUserAndToken = () => {
    // Cria um usuário admin para poder realizar as ações do carrinho com autenticação.
    const adminUser = DataUtils.apiUser('Carrinho Admin', true);

    return cy.apiPost('/usuarios', adminUser).then((userResponse) => {
      expect(userResponse.status).to.eq(201);
      expect(userResponse.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(userResponse.body).to.have.property('_id');

      const userId = userResponse.body._id;

      // Realiza o login para obter o token usado nas rotas autenticadas.
      return cy.loginApi(adminUser.email, adminUser.password).then((token) => ({
        userId,
        token,
      }));
    });
  };

  const createProduct = (token) => {
    // Cria um novo produto para associar ao carrinho no payload da rota de carrinhos.
    const product = DataUtils.cartProduct();

    return cy.createProductApi(product, token).then((productResponse) => {
      expect(productResponse.status).to.eq(201);
      expect(productResponse.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(productResponse.body).to.have.property('_id');

      return productResponse.body._id;
    });
  };

  const createCart = (token, productId) => {
    // Cria um novo carrinho com o produto gerado e quantidade 1.
    const payload = DataUtils.cartPayload(productId);

    return cy.createCartApi(payload, token).then((cartResponse) => {
      expect(cartResponse.status).to.eq(201);
      expect(cartResponse.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(cartResponse.body).to.have.property('_id');

      return cartResponse.body._id;
    });
  };

  const getCartByUserId = (userId) => {
    // Consulta os carrinhos e localiza o ID do carrinho gerado para este usuário.
    return cy.apiGet('/carrinhos').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('carrinhos');

      const carts = response.body.carrinhos || [];
      const cartFound = carts.find((item) => item.idUsuario === userId || item.usuarioId === userId);
      expect(cartFound, 'Carrinho do usuário não encontrado na listagem').to.not.be.undefined;

      return cartFound._id;
    });
  };

  const validateDeletedCart = (cartId) => {
    // Valida que o carrinho foi removido e não pode mais ser consultado por ID.
    cy.request({
      method: 'GET',
      url: `${Cypress.config('apiBaseUrl')}/carrinhos/${cartId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.match(/(não encontrado|Nenhum registro encontrado)/i);
    });
  };

  it('Cenário 1 - deve concluir carrinho com usuário admin e validar remoção', () => {
    createAdminUserAndToken().then(({ userId, token }) => {
      createProduct(token).then((productId) => {
        createCart(token, productId).then((createdCartId) => {
          getCartByUserId(userId).then((cartIdFromList) => {
            expect(cartIdFromList).to.eq(createdCartId);

            // Consulta o carrinho e conclui a compra com o token do usuário admin.
            cy.apiDelete('/carrinhos/concluir-compra', token).then((deleteResponse) => {
              expect(deleteResponse.status).to.eq(200);
              expect(deleteResponse.body).to.have.property('message', 'Registro excluído com sucesso');

              validateDeletedCart(createdCartId);
            });
          });
        });
      });
    });
  });

  it('Cenário 2 - deve cancelar carrinho com usuário admin e validar remoção', () => {
    createAdminUserAndToken().then(({ userId, token }) => {
      createProduct(token).then((productId) => {
        createCart(token, productId).then((createdCartId) => {
          getCartByUserId(userId).then((cartIdFromList) => {
            expect(cartIdFromList).to.eq(createdCartId);

            // Consulta o carrinho e cancela a compra com o token do usuário admin.
            cy.apiDelete('/carrinhos/cancelar-compra', token).then((deleteResponse) => {
              expect(deleteResponse.status).to.eq(200);
              expect(deleteResponse.body).to.have.property('message');
              expect(deleteResponse.body.message).to.include('Registro excluído com sucesso');

              validateDeletedCart(createdCartId);
            });
          });
        });
      });
    });
  });
});
