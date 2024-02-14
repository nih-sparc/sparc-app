const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  defaultCommandTimeout: 5000,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 0,
  e2e: {
    baseUrl: process.env.ROOT_URL ? process.env.ROOT_URL : 'http://localhost:3000',
    experimentalStudio: true,
    projectId: process.env.CYPRESS_PROJECT_ID,
    specPattern: "test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "test/cypress/support/e2e.js",
    viewportWidth: 1600,
    viewportHeight: 900,
    //Prevent huge amount of time on reloading page
    testIsolation: true,
    // pageLoadTimeout: 1024*1024*1024,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  fixturesFolder: "test/cypress/fixtures",
  screenshotsFolder: "test/cypress/screenshots",
  videosFolder: "test/cypress/videos",
  downloadsFolder: "test/cypress/downloads",
});
