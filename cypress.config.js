const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "https://front.serverest.dev",
    },
});