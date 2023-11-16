// const categories = ['dataset']
const categories = ['dataset', 'model', 'simulation', 'projects']

const keywords = ['Spine', 'neck']

const singleFacet = 'Male'

const multipleFacets = ['Human', 'Organ']

categories.forEach((category) => {

  describe(`Find Data in ${category}`, { testIsolation: false }, function () {
    before(function () {
      cy.visit(`/data?type=${category}`)
    })

    it('All Page Features', function () {
      // Sort dropdown function testing
      // Test whether the sort function can be triggered and text can be shown
      cy.get('.label1 > .el-dropdown > .filter-dropdown').then(($dropdown) => {
        cy.wrap($dropdown).click()
        cy.contains('Z-A').click()
        cy.wrap($dropdown).should('contain', 'Z-A')
      })
      // Tooltips showup testing
      // Test whether content will be displayed
      cy.get('[role="tooltip"]').should('not.be.visible')
      cy.get('.purple-fill').click()
      cy.get('[role="tooltip"]').should('be.visible')
      cy.get('[role="tooltip"] > .el-popover__title').should('contain', 'How do filters work?')
      cy.get('.label-header > :nth-child(1) > .label-title').then(($label) => {
        const tooltipExist = $label.text().includes('Availability')
        if (tooltipExist) {
          cy.get('.el-tooltip').click()
          cy.get('[role="tooltip"]:visible').should('contain', 'SPARC')
        }
      })
      // Dataset show testing
      // Test whether the number of displayed datasets can be changed
      cy.get(':nth-child(1) > p > .el-dropdown > .filter-dropdown').click()
      cy.get('.el-dropdown-menu > .el-dropdown-menu__item:visible').contains('20').click()
      cy.get('.el-table__row').should('have.length', 20)
    })
    keywords.forEach((keyword) => {
      it(`Keyword Search - ${keyword}`, function () {
        cy.get('.el-input__inner').should('have.attr', 'placeholder', 'Enter search criteria')
        cy.get('.el-input__inner').clear().type(keyword)
        cy.get('.btn-clear-search > .svg-icon').should('be.visible')
        cy.get('.search-text').click()
        cy.url({ decode: true }).should('contain', keyword)
        cy.wait(500)
        cy.get(':nth-child(1) > p').then(($p) => {
          const noResult = $p.text().includes('\n                  0 Results | Showing')
          if (noResult) {
            cy.get('.el-table__empty-text').should('exist')
          } else {
            cy.get('.el-table__empty-text').should('not.exist')
            cy.get('.table-wrap').then(($table) => {
              const keywordExist = $table.text().toLowerCase().includes(keyword.toLowerCase())
              if (keywordExist) {
                cy.get('b').contains(new RegExp(keyword, 'i')).should('exist')
              } else {
                cy.get('b').should('not.exist')
              }
            })
          }
        })
        cy.get('.btn-clear-search > .svg-icon').click()
        // *** There are situations that dataset cards do not show the (highlighted) keywords
        // *** Just in case this happens for all the displayed dataset cards, extra tests may need to be added
        // cy.get('')
      })
    })
    it(`Single Faceted Browse Search - ${singleFacet}`, function () {
      // let facetCategory
      cy.get('.no-facets').should('contain', 'No filters applied')
      // Expand all
      cy.get('.expand-all-container > .el-link > .el-link--inner').click()
      cy.get('.label-content-container').should('be.visible')
      cy.get('.label-content-container').should('have.length.above', 0)
      if (category !== 'projects') {
        // *** This action is used to expand all parent facets in ANATOMICAL STRUCTURE
        // *** Avoid error when using child facets as test facets
        // *** Need to think of a solution to open the specific parent facet, instead of open all
        cy.get('.el-tree-node__expand-icon.el-icon-caret-right:visible').not('.is-leaf').click({ multiple: true })
      }
      cy.get('.label-content-container').then(($label) => {
        const singleFacetExist = $label.find('span.capitalize:visible').text().toLowerCase().includes(singleFacet.toLowerCase())
        if (singleFacetExist) {
          // cy.wrap($label).contains(singleFacet).parents('.sparc-design-system-component-dropdown-multiselect').within(() => {
          //   cy.get('.label-title').then(($el) => {
          //     facetCategory = $el.text()
          //   })
          // })
          const regex = new RegExp(`(^| )${singleFacet}`, 'i')
          cy.wrap($label).contains(regex).click()
          cy.url({ decode: true }).should('contain', 'selectedFacetIds')
          cy.get('.el-card__body > .capitalize').contains(regex).should('have.length', 1)
          cy.get(':nth-child(1) > p').then(($p) => {
            const noResult = $p.text().includes('\n                  0 Results | Showing')
            if (noResult) {
              cy.get('.el-table__empty-text').should('exist')
            } else {
              cy.get('.el-table__empty-text').should('not.exist')
              cy.get('.table-wrap').then(($table) => {
                const facetFoundInCard = $table.text().includes(singleFacet)
                if (facetFoundInCard) {
                  cy.wrap($table).should('contain', singleFacet)
                } else {
                  cy.wrap($table).should('not.contain', singleFacet)
                  // cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > :nth-child(1) > a').click()
                  // cy.wait(5000)
                  // cy.get('.dataset-description-info').contains(singleFacet)
                }
              })
            }
          })
          // Uncheck
          cy.get('.el-card__body > .capitalize').contains(regex).should('have.length', 1)
          cy.wrap($label).contains(regex).click()
          cy.get('.no-facets').should('contain', 'No filters applied')
          // Close tag
          cy.wrap($label).contains(regex).click()
          cy.get('.el-card__body > .capitalize').contains(regex).should('have.length', 1)
          cy.get('.el-tag__close').eq(0).click()
          cy.get('.no-facets').should('contain', 'No filters applied')
          // Reset all
          cy.wrap($label).contains(regex).click()
          cy.get('.tags-container > .flex > .el-link > .el-link--inner').click()
          // *** 'No filters applied' sometimes will not appear after click 'reset all' in Cypress. BUG or Cypress issue?
          // cy.get('.no-facets').should('contain', 'No filters applied')
          // *** There is a bug with reset all function.
          // cy.get('.el-card__body > .capitalize').should('not.exist')
        } else {
          this.skip()
        }
      })
    })
    it(`Multiple Faceted Browse Search - ${multipleFacets}`, function () {
      cy.get('.expand-all-container > .el-link > .el-link--inner').click()
      if (category !== 'projects') {
        cy.get('.el-tree-node__expand-icon.el-icon-caret-right:visible').not('.is-leaf').click({ multiple: true })
      }
      cy.get('.label-content-container').then(($label) => {
        let multipleFacetsExist = true
        multipleFacets.forEach((facet) => {
          multipleFacetsExist = multipleFacetsExist && $label.find('span.capitalize:visible').text().toLowerCase().includes(facet.toLowerCase())
        })
        if (multipleFacetsExist) {
          multipleFacets.forEach((facet) => {
            cy.wrap($label).contains(new RegExp(`^${facet}`, 'i')).click()
          })
          const multipleRegex = new RegExp(multipleFacets.join('|'), 'i')
          cy.get('.el-card__body > .capitalize:visible').should('have.length.above', 1)
          cy.get('.el-card__body > .capitalize:visible').contains(multipleRegex).should('exist')
          cy.get(':nth-child(1) > p').then(($p) => {
            const noResult = $p.text().includes('\n                  0 Results | Showing')
            if (noResult) {
              cy.get('.el-table__empty-text').should('exist')
            } else {
              cy.get('.el-table__empty-text').should('not.exist')
              cy.get('.table-wrap').then(($content) => {
                let facetsExistInCard = true
                multipleFacets.forEach((facet) => {
                  facetsExistInCard = facetsExistInCard || $content.text().toLowerCase().includes(facet.toLowerCase())
                })
                if (facetsExistInCard) {
                  cy.wrap($content).contains(multipleRegex).should('exist')
                } else {
                  cy.wrap($content).contains(multipleRegex).should('not.exist')
                }
              })
            }
          })
          multipleFacets.forEach((facet) => {
            cy.get('.el-card__body > .capitalize').contains(new RegExp(` ${facet} `, 'i')).within(() => {
              cy.get('.el-tag__close').click()
            })
          })
        } else {
          this.skip()
        }
      })
    })
  })
})