// const datasetIds = [150]
const datasetIds = [150, 155]

// const taxonModels = ['Human Female']
const taxonModels = ['Rat', 'Human Female']

const threeDSyncView = 'Human Male'

const searchInput = 'heart'

describe('Maps Viewer', { testIsolation: false }, function () {
  before(function () {
    cy.visit('/maps?type=ac')
  })

  taxonModels.forEach((model) => {

    it(`Provenance card for ${model}`, function () {
      cy.intercept('**/flatmap/**').as('flatmap')

      cy.wait('@flatmap', { timeout: 20000 })

      // Loading mask should not exist after the default flatmap is loaded
      cy.get('.multi-container > .el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')

      if (model !== 'Rat') {
        // Switch to the second flatmap
        cy.get('#flatmap-select').click()
        cy.get('.el-select-dropdown__item').should('be.visible')
        cy.get('.el-select-dropdown__item:visible').contains(new RegExp(model, 'i')).click({ force: true })

        // Loading mask should not exist after the new flatmap is loaded
        cy.get('.multi-container > .el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')
      }

      // Open a provenance card
      cy.get('[style="height: 100%;"] > [style="height: 100%; width: 100%; position: relative;"] > [style="height: 100%; width: 100%;"] > .maplibregl-touch-drag-pan > .maplibregl-canvas').click();

      // Check for the popover provenance card content
      cy.get('.maplibregl-popup-content > .tooltip-container > .el-main', { timeout: 30000 }).within(() => {
        cy.get('.title').should('exist')
        cy.get('.subtitle').should('exist')
        cy.get('.attribute-title').contains(/COMPONENTS/i).should('exist')
      })

      // Close the provenance card
      cy.get('.maplibregl-popup-close-button').click()
    })
  })
  it(`From 2D ${threeDSyncView}, open 3D map for synchronised view and Search within display`, function () {
    cy.intercept('**/flatmap/**').as('flatmap')
    cy.intercept('**/get_body_scaffold_info/**').as('get_body_scaffold_info')
    cy.intercept('**/s3-resource/**').as('s3-resource')

    cy.wait('@flatmap', { timeout: 20000 })

    // Loading mask should not exist after the default flatmap is loaded
    cy.get('.multi-container > .el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')

    // Switch to the human related flatmap
    cy.get('#flatmap-select').click()
    cy.get('.el-select-dropdown__item').contains(new RegExp(threeDSyncView, 'i')).click({ force: true })

    // Loading mask should not exist after the new flatmap is loaded
    cy.get('.multi-container > .el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')

    // Open the 3D view in a split viewer
    cy.get('.settings-group.open > .el-row:visible').filter(':contains(Open new map)').within(() => {
      cy.get('use').click()
    })
    cy.get('.open-map-popper:visible').contains(/Open Sync Map/i).click()

    cy.wait(['@get_body_scaffold_info', '@s3-resource'], { timeout: 20000 })

    // Check for the number of displayed viewers
    cy.get('.toolbar-flex-container', { timeout: 30000 }).should('have.length', 2)

    // Check for 3D view's content card detail
    cy.get('.context-card > .card-right').within(() => {
      cy.get('.title').contains(/3D human whole-body/i).should('exist')
      cy.get('p').contains(/Visualization/i).should('exist')
      cy.get('.subtitle').contains(/Scaffold Views/i).should('exist')
      cy.get('.view-description').contains(/Human whole-body/i).should('exist')
    })

    // Close the pathway sidebar
    cy.get('.pathway-location > .drawer-button > .el-icon-arrow-left:visible').click()

    // Search keyword in displayed viewers
    cy.get('.search-container').within(() => {
      cy.get('[role="combobox"]').type(searchInput)
      cy.get('.map-icon > use').click()
    })

    // Check for keyword(highlighted part) in displayed viewers
    cy.get('.maplibregl-popup-content').contains(new RegExp(searchInput, 'i')).should('exist')

    cy.visit('/maps?type=ac')
  })

  datasetIds.forEach((datasetId) => {

    it(`Context card in sidebar for scaffold dataset ${datasetId}`, function () {
      cy.intercept('**/query?**').as('query')
      cy.intercept('**/dataset_info/**').as('dataset_info')
      cy.intercept('**/datasets/**').as('datasets')

      // Open the sidebar
      cy.get('.open-tab > .el-icon-arrow-left').click()

      // Search dataset id
      cy.get('.search-input > .el-input__inner').clear()
      cy.get('.search-input > .el-input__inner').type(datasetId)
      cy.get('.header > .el-button > span').click()

      cy.wait('@query', { timeout: 20000 })

      cy.get('.dataset-results-feedback').then(($result) => {
        const noResult = $result.text() === '0 results | Showing'
        if (noResult) {
          // Error message should exist if no result
          cy.get('.error-feedback').should('exist')
          cy.get('.error-feedback').should('contain', 'No results found')
        } else {
          cy.wait(['@dataset_info', '@datasets'], { timeout: 20000 })

          // Check for search result and the tag 'Scaffold'
          cy.get('.dataset-card', { timeout: 30000 }).filter(`:contains(${datasetId})`).within(() => {
            cy.get('.container').contains(/Scaffold/i).should('exist')
          })

          // Close the sidebar
          cy.get('.close-tab > .el-icon-arrow-right').click()
        }
      })
    })
  })
})