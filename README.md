# ServeRest Automation

Este projeto contém testes automatizados com Cypress para a API e fluxos do ServeRest.

## Requisitos

Antes de executar os testes, certifique-se de ter instalado na máquina:

- Node.js 18 ou superior
- npm
- Git

## 1) Clonar o projeto

```bash
git clone https://github.com/Lucas-Piccolo/serverest-automation.git
cd serverest-automation
```

## 2) Instalar dependências

No diretório do projeto, execute:

```bash
npm install
```

## 3) Verificar a instalação

Para confirmar que tudo foi instalado corretamente:

```bash
npx cypress --version
```

## 4) Executar os testes

### Rodar todos os testes

```bash
npx cypress run
```

### Rodar um arquivo específico

```bash
npx cypress run --spec cypress/e2e/01-login.cy.js
```

### Rodar apenas os testes de API

```bash
npx cypress run --spec "cypress/e2e/api/*.cy.js"
```

### Abrir a interface do Cypress

```bash
npx cypress open
```

## 5) Executar em navegador específico

Você pode rodar em Chrome ou Edge, se estiver instalado:

```bash
npx cypress run --browser chrome
```

ou

```bash
npx cypress run --browser edge
```

## 6) Estrutura principal

- `cypress/e2e/` — testes de interface
- `cypress/e2e/api/` — testes de API
- `cypress/support/` — comandos e helpers compartilhados
- `cypress/fixtures/` — dados fixos

## 7) Dicas

- Sempre rode `npm install` antes da primeira execução.
- Para visualizar e depurar cenários, use `npx cypress open`.
- Para rodar em modo headless em CI, preferencialmente use `npx cypress run`.

## 8) Observações

Os testes consumem a API pública do ServeRest, então a internet deve estar disponível durante a execução.
