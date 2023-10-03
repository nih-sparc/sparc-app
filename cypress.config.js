const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  defaultCommandTimeout: 5000,
  e2e: {
    baseUrl: process.env.ROOT_URL ? process.env.ROOT_URL : 'http://localhost:3000',
    projectId: "iobp4a",
    viewportWidth: 1600,
    viewportHeight: 900,
    // pageLoadTimeout: 1024*1024*1024,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
