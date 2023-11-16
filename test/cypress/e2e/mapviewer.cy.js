// const datasetIds = [150]
const datasetIds = [150, 155]

// const apinatomyModels = ['Human Female']
const apinatomyModels = ['Rat', 'Human Female']

const threeDSyncView = 'Human Male'

describe('Maps Viewer', { testIsolation: false }, function () {
  before(function () {
    cy.visit('/maps?type=ac')
    cy.intercept('**/flatmap/**').as('flatmap')
    cy.wait('@flatmap')
  })

  apinatomyModels.forEach((model) => {

    it(`Provenance card for ${model}`, function () {
      if (model !== 'Rat') {
        cy.get('#flatmap-select').click()
        cy.get('.el-select-dropdown__item').should('be.visible')
        cy.get('.el-select-dropdown__item').contains(new RegExp(model, 'i')).click({ force: true })
      }
      // There will have more than one matched result, only when 'numTestsKeptInMemory' is 0
      // Unable to DEBUG as 'numTestsKeptInMemory' is 0, logs won't show in the console
      cy.get('.maplibregl-touch-drag-pan.maplibregl-touch-zoom-rotate > .maplibregl-canvas:visible').click();
      cy.get('.maplibregl-popup-content:visible').within(() => {
        cy.get('.title').should('exist')
        cy.get('.subtitle').should('exist')
        cy.contains(/COMPONENTS/i).should('exist')
      })
      cy.get('.maplibregl-popup-close-button').click()
    })
  })
  it(`From 2D ${threeDSyncView}, open 3D map for synchronised view`, function () {
    cy.get('#flatmap-select').click()
    cy.get('.el-select-dropdown__item').should('be.visible')
    cy.get('.el-select-dropdown__item').contains(new RegExp(threeDSyncView, 'i')).click({ force: true })
    cy.get('.settings-group.open > .el-row:visible').filter(':contains(Open new map)').within(() => {
      cy.get('use').click()
    })
    cy.get('.open-map-popper:visible').contains(/Open Sync Map/i).click()
    cy.get('.toolbar-flex-container').should('have.length', 2)
    cy.get('.context-card > .card-right').within(()=>{
      cy.get('.title').contains(/3D human whole-body/i).should('exist')
      cy.get('p').contains(/Visualization/i).should('exist')
      cy.get('.subtitle').contains(/Scaffold Views/i).should('exist')
    })
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
    })
  })
})