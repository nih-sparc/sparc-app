// The position of selected datasets
const searchInput = 'segmentation'
const datasetIndex = [1, 2]

describe('User stories', function () {
  describe('Should find segmentation data in the gallery', { testIsolation: false }, function () {
    it(`Search for ${searchInput}`, function () {
      cy.intercept('**/query?**').as('query');
      cy.visit('');

      // Navigate to 'Data&Models' page
      cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').click();

      // Search for segmentation related dataset
      cy.get('.el-input__inner').type(searchInput);
      cy.get('.search-text').click();
      cy.wait('@query', { timeout: 20000 });
    })

    datasetIndex.forEach((index) => {
      it(`Access dataset ${index}`, function () {
        cy.get('.el-table__row', { timeout: 30000 }).eq(index - 1).as('dataset');

        // Enter the dataset
        cy.get('@dataset').find('.cell > :nth-child(1) > a').last().click();

        // Enter the 'Gallery' tab
        cy.get(':nth-child(5) > .style1').click();
        cy.get('.gallery-container > .description-info > p > strong', { timeout: 30000 }).should('have.text', 'Data collection:');

        // Check for segmentation
        cy.findGalleryCard('Segmentation');
        cy.get('.el-card > .el-card__body > :nth-child(1) > .details > :nth-child(1) > b').should('contain', 'Segmentation');
        cy.get('.el-card > .el-card__body > :nth-child(1) > .details > .el-button > span').should('contain', ' View Segmentation');

        cy.goBackToBrowser('dataset');
      })
    })
  })
  describe('Should find scaffold in the gallery', { testIsolation: false }, function () {
    it('Go to Anatomical Models', function () {
      cy.visit('');
      // Navigate to 'Data&Models' page
      cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').click();

      // Go to 'Anatomical Models'
      cy.get(':nth-child(2) > .search-tabs__button').click();
      cy.wait(1500)
      cy.get(':nth-child(2) > .search-tabs__button').should('have.class', 'active');
    })

    datasetIndex.forEach((index) => {
      it(`Access dataset ${index}`, function () {
        cy.get('.el-table__row', { timeout: 30000 }).eq(index - 1).as('dataset');

        // Enter the dataset
        cy.get('@dataset').find('.cell > :nth-child(1) > a').last().click();

        // Enter the 'Gallery' tab
        cy.get(':nth-child(5) > .style1').click();
        cy.get('.gallery-container > .description-info > p > strong', { timeout: 30000 }).should('have.text', 'Data collection:');

        // Check for scaffold
        cy.findGalleryCard('Scaffold');
        cy.get('.el-card > .el-card__body > :nth-child(1) > .details > :nth-child(1) > b').contains('Scaffold').should('exist');
        cy.get('.el-card > .el-card__body > :nth-child(1) > .details > .el-button > span').contains('View Scaffold').should('exist').as('scaffold');

        // cy.get('@scaffold').first().click()
        // Alternative solution

        cy.url().then(($url) => {
          const datasetId = $url.substring($url.lastIndexOf("/") + 1, $url.indexOf("?"));
          cy.get('.dataset-information-box > :nth-child(1)').then(($version) => {
            cy.intercept('**/query?**').as('query')
            cy.intercept('**/dataset_info/**').as('dataset_info')
            cy.intercept('**/datasets/**').as('datasets')

            const version = $version.text().match(/[0-9]+/);
            cy.visit(`/maps?type=scaffold&dataset_id=${datasetId}&dataset_version=${version}`);

            cy.wait('@query', { timeout: 20000 })

            // Search dataset id
            cy.get('.search-input > .el-input__inner').clear()
            cy.get('.search-input > .el-input__inner').type(datasetId);
            cy.get('.header > .el-button').click();

            cy.wait(['@dataset_info', '@datasets'], { timeout: 20000 })

            // Check for search result and the tag 'Scaffold'
            cy.get('.dataset-card-container > .dataset-card', { timeout: 30000 }).contains(datasetId).should('exist')
            cy.get('.dataset-card-container > .dataset-card:visible').filter(`:contains(${datasetId})`).within(() => {
              cy.get('.badges-container > .container', { timeout: 30000 }).contains(/Scaffold/i).click()
            })

            // Check for button text
            cy.get('.dataset-card-container > .dataset-card:visible', { timeout: 30000 }).contains(/View Scaffold/i).click()

            // Loading mask should not exist after the scaffold is loaded
            cy.get('.multi-container > .el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')

            // Check for context card
            cy.get('.context-card').should('be.visible')
            cy.get('.context-image').should('have.attr', 'src').and('contain', datasetId)
            cy.get('[style="margin-right: 8px;"] > .title').should('have.class', 'title')
          })
        })
        cy.goBackToBrowser('model');
      })
    })
  })
})