const datasetIds = [150, 155]

// const apinatomyModels = ['Rat']
const apinatomyModels = ['Rat', 'Human Female']

describe('Maps viewer', { testIsolation: false }, function () {
  before(function () {
    cy.visit('/maps?type=ac')
  })

  apinatomyModels.forEach((model) => {

    it.only(`Provenance card for ${model}`, function () {
      cy.intercept('**/flatmap/**').as('flatmap')
      cy.wait('@flatmap')
      if (model !== 'Rat') {
        cy.get('#flatmap-select').click()
        cy.get('.el-select-dropdown__item').should('be.visible')
        cy.get('.el-select-dropdown__item:visible').filter(`:contains(${model})`).click()
      }
      // When 'numTestsKeptInMemory' is 0, there will have more than one result
      cy.get('.maplibregl-touch-drag-pan.maplibregl-touch-zoom-rotate > .maplibregl-canvas').click({ multiple: true });
      cy.get('.maplibregl-popup-content').should('be.visible')
      cy.get('.maplibregl-popup-content').within(() => {
        cy.get('.title').should('exist')
        cy.get('.subtitle').should('exist')
        cy.contains(/COMPONENTS/i).should('exist')
      })
      cy.get('.maplibregl-popup-close-button').click()
    })
  })
  it('From 2D human, open 3D map for synchronised view (split screen)', function () {
    cy.get('.open-tab > .el-icon-arrow-left').click();
    cy.get('.close-tab > .el-icon-arrow-right').click();
  })
  it('Search within display', function () {
    cy.get('.open-tab > .el-icon-arrow-left').click();
    cy.get('.close-tab > .el-icon-arrow-right').click();
  })

  datasetIds.forEach((datasetId) => {

    it(`Context card in sidebar for scaffold dataset ${datasetId}`, function () {
      cy.get('.open-tab > .el-icon-arrow-left').click()
      cy.get('.search-input > .el-input__inner').clear()
      cy.get('.search-input > .el-input__inner').type(datasetId)
      cy.get('.header > .el-button > span').click()
      cy.wait(500)
      cy.get('.dataset-results-feedback').then(($result) => {
        const noResult = $result.text() === '0 results | Showing'
        if (noResult) {
          cy.get('.error-feedback').should('exist')
          cy.get('.error-feedback').should('contain', 'No results found')
        } else {
          cy.get('.dataset-card').contains(datasetId).should('exist')
          cy.get('.dataset-card').filter(`:contains(${datasetId})`).within(() => {
            cy.wait(5000)
            cy.get('.container').contains(/Scaffold/i).click()
          })
        }
      })
      cy.contains(/View Scaffold/i).click()
      cy.get('.close-tab > .el-icon-arrow-right').click();
    })
  })
})