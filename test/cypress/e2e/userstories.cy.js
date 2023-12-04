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

        cy.findGalleryCard('Segmentation');

        cy.get('.el-card > .el-card__body > :nth-child(1) > .details > :nth-child(1) > b').should('contain', 'Segmentation');
        cy.get('.el-card > .el-card__body > :nth-child(1) > .details > .el-button > span').should('contain', ' View Segmentation');

        cy.goBackToBrowser('dataset');
      })
    })
  })
})