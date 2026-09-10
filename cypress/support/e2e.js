require('./commands');
require('./api');

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});