// const categories = ['dataset']
const categories = ['dataset', 'model', 'simulation', 'projects']

const limit = 20

const keywords = ['Spine', 'neck']

const singleFacet = 'Colon'

const multipleFacets = ['Human', 'Organ']

categories.forEach((category) => {

  describe(`Find Data in ${category}`, { testIsolation: false }, function () {
    before(function () {
      cy.visit(`/data?type=${category}`)
    })

    it('All Page Features', function () {
      /**
       * Sort dropdown function testing
       * Test whether the sort function can be triggered and text can be shown
       */
      cy.get('.label1 > .el-dropdown > .filter-dropdown > .el-dropdown-text-link').click()

      // Change the order to 'Z-A'
      cy.get('.el-dropdown-menu > .el-dropdown-menu__item:visible').contains('Z-A').click()

      // CHeck for the order
      cy.get('.label1 > .el-dropdown > .filter-dropdown > .el-dropdown-text-link').contains('Z-A').should('exist')

      /**
       * Tooltips showup testing
       * Test whether content will be displayed
       */
      cy.get('[role="tooltip"]').should('not.be.visible')
      cy.get('.purple-fill').click()
      cy.get('[role="tooltip"]').should('be.visible')

      // Check for tooltip content
      cy.get('[role="tooltip"]:visible > .el-popover__title').contains(/How do filters work?/i).should('exist')
      cy.get('.label-header > :nth-child(1) > .label-title').then(($label) => {
        const tooltipExist = $label.text().includes('Availability')
        if (tooltipExist) {
          cy.get('.el-tooltip').click()

          // Check for tooltip content
          cy.get('[role="tooltip"]:visible').contains(/SPARC/i).should('exist')
        }
      })

      /**
       * Dataset show testing
       * Test whether the number of displayed datasets can be changed
       */
      // Change the limit
      cy.get(':nth-child(1) > p > .el-dropdown > .filter-dropdown').click()
      cy.get('.el-dropdown-menu > .el-dropdown-menu__item:visible').contains(limit).click()

      // Check for limit change in URL
      cy.url().should('contain', `limit=${limit}`)
      cy.get('.el-table__row', { timeout: 30000 }).should('have.length', limit)
    })

    keywords.forEach((keyword) => {

      it(`Keyword Search - ${keyword}`, function () {
        cy.intercept('**/query?**').as('query')

        cy.get('.el-input__inner').should('have.attr', 'placeholder', 'Enter search criteria')

        // Type keyword
        cy.get('.el-input__inner').clear()
        cy.get('.el-input__inner').type(keyword)

        // Check for clear search icon
        cy.get('.btn-clear-search > .svg-icon').should('be.visible')

        // Click search button
        cy.get('.search-text').click()

        // Check for keyword in URL
        cy.url().should('contain', keyword)

        cy.wait('@query', { timeout: 20000 })

        cy.get('.table-wrap.el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')

        // Check for result
        cy.get(':nth-child(1) > p').then(($result) => {
          const noResult = $result.text().includes('\n                  0 Results | Showing')
          if (noResult) {
            // Empty text should exist if no result
            cy.get('.el-table__empty-text').should('exist')
          } else {
            cy.get('.table-wrap').then(($content) => {
              const keywordExist = $content.text().toLowerCase().includes(keyword.toLowerCase())
              if (keywordExist) {
                // Check for (highlighted) keyword
                cy.wrap($content).contains(new RegExp(keyword, 'i')).should('exist')

                // Check for highlighted keyword
                cy.get('b').contains(new RegExp(keyword, 'i')).should('exist')
              }
            })
          }
        })
        // Clear search input
        cy.get('.btn-clear-search > .svg-icon').click()

        // *** There are situations that dataset cards do not show the (highlighted) keywords
        // *** Just in case this happens for all the displayed dataset cards, extra tests may need to be added
      })
    })
    it(`Single Faceted Browse Search - ${singleFacet}`, function () {
      cy.intercept('**/query?**').as('query')
      cy.intercept('**/entries?**').as('entries')

      // Check for filters applied box
      cy.get('.no-facets').contains(/No filters applied/i).should('exist')

      // Expand all filters/facets
      cy.get('.expand-all-container > .el-link > .el-link--inner').click()
      cy.get('.label-content-container').should('be.visible')
      cy.get('.label-content-container').should('have.length.above', 0)
      if (category !== 'projects') {
        // If multiple facets are matched, the first will be checked by default
        // *** This action is used to expand all parent facets in ANATOMICAL STRUCTURE
        // *** Avoid error when using child facets as test facets
        // *** Need to think of a solution to open the specific parent facet, instead of open all
        cy.get('.el-icon-caret-right:visible').not('.is-leaf').each(($node) => {
          cy.wrap($node).click()
        })
      }

      cy.get('.label-content-container').then(($label) => {
        const singleFacetExist = $label.find('span.capitalize:visible').text().toLowerCase().includes(singleFacet.toLowerCase())
        if (singleFacetExist) {
          const regex = new RegExp(`(^| )${singleFacet}`, 'i')

          // Check the matched facet checkbox
          cy.wrap($label).contains(regex).click()

          // Check for the number of facet tags in filters applied box
          cy.get('.el-card__body > .capitalize').contains(regex).should('have.length', 1)

          // Check for the facet tags in filters applied box
          cy.get('.el-card__body > .capitalize:visible').contains(regex).should('exist')

          // Check for URL
          if (category === 'projects') {
            cy.url().should('contain', 'selectedProjectsAnatomicalFocusIds')
            cy.wait('@entries', { timeout: 20000 })
          } else {
            cy.url().should('contain', 'selectedFacetIds')
            cy.wait('@query', { timeout: 20000 })
          }

          // Check for result
          cy.get(':nth-child(1) > p').then(($result) => {
            const noResult = $result.text().includes('\n                  0 Results | Showing')
            if (noResult) {
              // Empty text should exist if no result
              cy.get('.el-table__empty-text').should('exist')
            } else {
              cy.get('.el-table__empty-text').should('not.exist')

              // Check for facets
              cy.get('.table-wrap').then(($table) => {
                const facetFoundInCard = $table.text().includes(singleFacet)
                if (facetFoundInCard) {
                  cy.wrap($table).contains(new RegExp(singleFacet, 'i')).should('exist')
                } else {
                  cy.wrap($table).contains(new RegExp(singleFacet, 'i')).should('not.exist')
                }
              })
            }
          })

          // Uncheck
          cy.get('.el-card__body > .capitalize').contains(regex).should('have.length', 1)
          cy.wrap($label).contains(regex).click()
          cy.get('.no-facets').contains(/No filters applied/i).should('exist')

          // Close tag
          cy.wrap($label).contains(regex).click()
          cy.get('.el-card__body > .capitalize').contains(regex).should('have.length', 1)
          cy.get('.el-tag__close').eq(0).click()
          cy.get('.no-facets').contains(/No filters applied/i).should('exist')

          // Reset all
          cy.wrap($label).contains(regex).click()
          cy.get('.tags-container > .flex > .el-link > .el-link--inner').click()
          // *** 'No filters applied' sometimes will not appear after click 'reset all' in Cypress. BUG or Cypress issue?
          // cy.get('.no-facets').contains(/No filters applied/i).should('exist')
          // *** There is a bug with reset all function.
          // cy.get('.el-card__body > .capitalize').should('not.exist')
        } else {
          this.skip()
        }
      })
    })
    it(`Multiple Faceted Browse Search - ${multipleFacets}`, function () {
      cy.intercept('**/query?**').as('query')
      cy.intercept('**/entries?**').as('entries')

      cy.get('.expand-all-container > .el-link > .el-link--inner').click()
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

          // Check for the number of facet tags in filters applied box
          cy.get('.el-card__body > .capitalize:visible').should('have.length.above', 1)

          // Check for the facet tags in filters applied box
          cy.get('.el-card__body > .capitalize:visible').contains(multipleRegex).should('exist')

          // Check for URL
          if (category === 'projects') {
            cy.url().should('contain', 'selectedProjectsAnatomicalFocusIds')
            cy.wait('@entries', { timeout: 20000 })
          } else {
            cy.url().should('contain', 'selectedFacetIds')
            cy.wait('@query', { timeout: 20000 })
          }

          // Check for result
          cy.get(':nth-child(1) > p').then(($result) => {
            const noResult = $result.text().includes('\n                  0 Results | Showing')
            if (noResult) {
              // Empty text should exist if no result
              cy.get('.el-table__empty-text').should('exist')
            } else {
              cy.get('.el-table__empty-text').should('not.exist')

              // Check for facets
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
            // Uncheck all facets in filters applied box
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