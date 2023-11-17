// const datasetIds = [150]
const datasetIds = [150, 155]

// const apinatomyModels = ['Human Female']
const apinatomyModels = ['Rat', 'Human Female']

const threeDSyncView = 'Human Male'

const searchInput = 'heart'

describe('Maps Viewer', { testIsolation: false }, function () {
  before(function () {
    cy.intercept('GET', '**/flatmap/**').as('flatmap')
    cy.visit('/maps?type=ac')
    cy.wait('@flatmap')
  })

  apinatomyModels.forEach((model) => {

    it(`Provenance card for ${model}`, function () {
      cy.intercept('GET', '**/flatmap/**').as('flatmap')
      if (model !== 'Rat') {
        cy.get('#flatmap-select').click()
        cy.get('.el-select-dropdown__item').should('be.visible')
        // '{ force: true }' has to be applied, otherwise flatmap will not change
        // Need to figure out the cause
        cy.get('.el-select-dropdown__item').contains(new RegExp(model, 'i')).click({ force: true })
      }
      cy.wait('@flatmap')
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
  it(`From 2D ${threeDSyncView}, open 3D map for synchronised view and Search within display`, function () {
    cy.intercept('GET', '**/get_body_scaffold_info/**').as('body_scaffold')
    cy.intercept('GET', '**/s3-resource/**').as('resource')
    cy.get('#flatmap-select').click()
    cy.get('.el-select-dropdown__item').contains(new RegExp(threeDSyncView, 'i')).click({ force: true })
    cy.get('.settings-group.open > .el-row:visible').filter(':contains(Open new map)').within(() => {
      cy.get('use').click()
    })
    cy.get('.open-map-popper:visible').contains(/Open Sync Map/i).click()
    cy.wait(['@body_scaffold', '@resource'])
    cy.get('.toolbar-flex-container').should('have.length', 2)
    cy.get('.context-card > .card-right').within(() => {
      cy.get('.title').contains(/3D human whole-body/i).should('exist')
      cy.get('p').contains(/Visualization/i).should('exist')
      cy.get('.subtitle').contains(/Scaffold Views/i).should('exist')
    })
    cy.get('.search-container').within(() => {
      cy.get('[role="combobox"]').type(searchInput)
      cy.get('.map-icon > use').click()
    })
    cy.get('.maplibregl-popup-content').contains(new RegExp(searchInput, 'i')).should('exist')
    cy.visit('/maps?type=ac')
  })

  datasetIds.forEach((datasetId) => {

    it(`Context card in sidebar for scaffold dataset ${datasetId}`, function () {
      cy.intercept('POST', '**/query?**').as('query')
      cy.intercept('GET', '**/dataset_info/**').as('dataset_info')
      cy.intercept('GET', '**/datasets/**').as('datasets')
      cy.get('.open-tab > .el-icon-arrow-left').click()
      cy.get('.search-input > .el-input__inner').clear()
      cy.get('.search-input > .el-input__inner').type(datasetId)
      cy.get('.header > .el-button > span').click()
      cy.wait('@query')
      cy.get('.dataset-results-feedback').then(($result) => {
        const noResult = $result.text() === '0 results | Showing'
        if (noResult) {
          cy.get('.error-feedback').should('exist')
          cy.get('.error-feedback').should('contain', 'No results found')
        } else {
          cy.wait(['@dataset_info', '@datasets'])
          cy.get('.dataset-card').contains(datasetId).should('exist')
          cy.get('.dataset-card').filter(`:contains(${datasetId})`).within(() => {
            cy.get('.container').contains(/Scaffold/i).click()
          })
        }
      })
      cy.contains(/View Scaffold/i).should('exist')
      // cy.contains(/View Scaffold/i).click()
      cy.get('.close-tab > .el-icon-arrow-right').click()
    })
  })
})