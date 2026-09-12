const fixedUser = require('../fixtures/user.json');

class DataUtils {
  static uniqueId(prefix) {
    const normalizedPrefix = prefix.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();

    return `${normalizedPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  static userData(prefix, isAdmin = false) {
    const identifier = this.uniqueId(prefix);

    return {
      nome: `${prefix} ${identifier}`,
      email: `${identifier}@qa.com`,
      password: '123456',
      administrador: String(isAdmin),
    };
  }

  static webUser(prefix, isAdmin = false) {
    const user = this.userData(prefix, isAdmin);

    return {
      ...user,
      senha: user.password,
      isAdmin,
    };
  }

  static apiUser(prefix, isAdmin = false) {
    return this.userData(prefix, isAdmin);
  }

  static invalidLogin() {
    return {
      email: 'invalido@qa.com',
      password: 'senhaErrada',
    };
  }

  static duplicateUser() {
    return {
      nome: fixedUser.name,
      email: fixedUser.email,
      password: fixedUser.password,
      senha: fixedUser.password,
      isAdmin: fixedUser.isAdmin,
    };
  }

  static updatedUserName(name) {
    return `${name}01`;
  }

  static product(prefix = 'Produto API') {
    return {
      nome: `${prefix} ${this.uniqueId('produto')}`,
      preco: 100,
      descricao: 'Produto de teste Cypress',
      quantidade: 10,
    };
  }

  static cartProduct() {
    return {
      nome: `Produto Carrinho ${this.uniqueId('produto')}`,
      preco: 150,
      descricao: 'Produto para carrinho',
      quantidade: 10,
    };
  }

  static updatedProduct(productName) {
    return {
      nome: `${productName}01`,
      preco: 200,
      descricao: 'Produto editado por Cypress',
      quantidade: 7,
    };
  }

  static cartPayload(productId) {
    return {
      produtos: [{ idProduto: productId, quantidade: 1 }],
    };
  }
}

module.exports = DataUtils;