const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  defaultCommandTimeout: 5000,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 1,
  e2e: {
    baseUrl: process.env.ROOT_URL ? process.env.ROOT_URL : 'http://localhost:3000',
    experimentalStudio: true,
    projectId: process.env.CYPRESS_PROJECT_ID,
    viewportWidth: 1600,
    viewportHeight: 900,
    // pageLoadTimeout: 1024*1024*1024,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
