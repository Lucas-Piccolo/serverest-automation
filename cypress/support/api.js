const API_BASE_URL = 'https://serverest.dev';

const api = {
  get(path) {
    return cy.request({ method: 'GET', url: `${API_BASE_URL}${path}` });
  },
  post(path, body) {
    return cy.request({ method: 'POST', url: `${API_BASE_URL}${path}`, body, failOnStatusCode: false });
  },
  put(path, body, token) {
    return cy.request({
      method: 'PUT',
      url: `${API_BASE_URL}${path}`,
      body,
      headers: token ? { Authorization: token } : {},
      failOnStatusCode: false,
    });
  },
  del(path, token) {
    return cy.request({
      method: 'DELETE',
      url: `${API_BASE_URL}${path}`,
      headers: token ? { Authorization: token } : {},
      failOnStatusCode: false,
    });
  },
};

Cypress.Commands.add('apiGet', (path) => api.get(path));
Cypress.Commands.add('apiPost', (path, body) => api.post(path, body));
Cypress.Commands.add('apiPut', (path, body, token) => api.put(path, body, token));
Cypress.Commands.add('apiDelete', (path, token) => api.del(path, token));

Cypress.Commands.add('loginApi', (email, password) => {
  return cy.apiPost('/login', { email, password }).then((response) => {
    expect(response.status).to.be.oneOf([200, 201]);
    return response.body.authorization;
  });
});

Cypress.Commands.add('createUserApi', (user) => {
  return cy.apiPost('/usuarios', user).then((response) => {
    expect(response.status).to.be.oneOf([200, 201]);
    return response.body._id || response.body;
  });
});

Cypress.Commands.add('createProductApi', (product, token) => {
  return cy.request({
    method: 'POST',
    url: `${API_BASE_URL}/produtos`,
    headers: token ? { Authorization: token } : {},
    body: product,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('createCartApi', (cart, token) => {
  return cy.request({
    method: 'POST',
    url: `${API_BASE_URL}/carrinhos`,
    headers: token ? { Authorization: token } : {},
    body: cart,
    failOnStatusCode: false,
  });
});
