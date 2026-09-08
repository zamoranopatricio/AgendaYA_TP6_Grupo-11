const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5500', // Ajustá si tu Live Server usa otro puerto o ruta
    setupNodeEvents(on, config) { },
  },
});