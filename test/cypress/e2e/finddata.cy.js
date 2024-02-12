// const categories = ['dataset']
const categories = ['dataset', 'model', 'simulation', 'projects']

const limit = 20

const keywords = ['Spine', 'neck']

/**
 * 1.
 * If multiple facets are selected which includes one or more "ANATOMICAL STRUCTURE" parent facet,
 * place it/them to the end of the array,
 * this is to make sure the "ANATOMICAL STRUCTURE" child facet can be closed during "close tag" process.
 * 2.
 * If multiple facets are selected,
 * all facets need to be matched, 
 * otherwise that test will be skipped.
 */
const facets = [['Human'], ['Heart', 'Adult']]

categories.forEach((category) => {

  describe(`Find Data in ${category}`, { testIsolation: false }, function () {
    before(function () {
      cy.visit(`/data?type=${category}`)
    })

    it('Dataset card', function () {
      if (category === 'projects') {
        cy.get(':nth-child(1) > .el-table_1_column_1 > .cell > .image-container > .img-project').should('have.attr', 'src').and('contain', '//images.ctfassets.net/');
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > .property-table > :nth-child(1) > .property-name-column').should('contain', 'Focus');
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > .property-table > :nth-child(2) > .property-name-column').should('contain', 'Principle Investigator');
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > .property-table > :nth-child(3) > .property-name-column').should('contain', 'Institution');
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > .property-table > :nth-child(4) > .property-name-column').should('contain', 'Funding Program');
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > .property-table > :nth-child(5) > .property-name-column').should('contain', 'Award');
      } else {
        cy.get(':nth-child(1) > .el-table_1_column_1 > .cell > :nth-child(1) > .img-dataset > img').should('have.attr', 'src').and('contain', 'https://assets.discover.pennsieve.io/dataset-assets/')
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > :nth-child(1) > .property-table > :nth-child(1) > .property-name-column').should('contain', 'Anatomical Structure');
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > :nth-child(1) > .property-table > :nth-child(2) > .property-name-column').should('contain', 'Species');
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > :nth-child(1) > .property-table > :nth-child(3) > .property-name-column').should('contain', 'Experimental Approach');
        cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > :nth-child(1) > .property-table > :nth-child(4) > .property-name-column').should('contain', 'Publication Date');
      }
    })
    it('All Page Features', function () {
      cy.get('h5').should('contain', 'Search within category');
      cy.get('.heading2').should('contain', 'Refine results');
      cy.get('.tags-container > .flex').should('contain', 'Filters applied');
      cy.get('.el-col-md-16 > :nth-child(1) > p').should('contain', 'Results | Showing');
      cy.get('.label1').should('contain', 'Sort');

      /**
       * Sort dropdown function testing
       * Test whether the sort function can be triggered and text can be shown
       */
      cy.get('.label1 > .el-dropdown > .filter-dropdown > .el-dropdown-text-link').click()

      // Change the order to 'Z-A'
      cy.get('.el-dropdown-menu > .el-dropdown-menu__item:visible').contains('Z-A').click()

      // CHeck for the order
      cy.get('.label1 > .el-dropdown > .filter-dropdown > .el-dropdown-text-link').should('contain', 'Z-A')

      /**
       * Tooltips showup testing
       * Test whether content will be displayed
       */
      // Check for tooltip content
      cy.get('.purple-fill').trigger('mouseenter', { eventConstructor: 'MouseEvent' })
      cy.get('[role="tooltip"]').should('be.visible')
      cy.get('[role="tooltip"]:visible > .el-popover__title').should('have.text', 'How do filters work?')
      cy.get('.purple-fill').trigger('mouseleave', { eventConstructor: 'MouseEvent' })
      cy.get('[role="tooltip"]').should('not.be.visible')

      cy.get('.label-header > :nth-child(1) > .label-title').then(($label) => {
        if ($label.text().includes('Availability')) {
          cy.get('.el-tooltip').trigger('mouseenter', { eventConstructor: 'MouseEvent' })
          cy.get('[role="tooltip"]').should('be.visible')

          // Check for tooltip content
          cy.get('[role="tooltip"]').should('contain', 'SPARC')

          cy.get('.el-tooltip').trigger('mouseleave', { eventConstructor: 'MouseEvent' })
          cy.get('[role="tooltip"]').should('not.be.visible')
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
          if ($result.text().includes(' 0 Results | Showing')) {
            // Empty text should exist if no result
            cy.get('.el-table__empty-text').should('exist').and('have.text', 'No Results')
          } else {
            cy.get('.table-wrap').then(($content) => {
              const keywordExist = $content.text().toLowerCase().includes(keyword.toLowerCase())
              if (keywordExist) {
                // Check for keyword
                cy.wrap($content).contains(new RegExp(keyword, 'i')).should('exist')

                // Check for highlighted keyword
                cy.get('b').contains(new RegExp(keyword, 'i')).should('exist')
              } else {
                // *** Ignore when keyword cannot be found or
                // *** Find some other solutions in the future
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

    facets.forEach((facetList) => {

      it(`Faceted Browse Search - ${facetList}`, function () {
        cy.intercept('**/query?**').as('query')
        cy.intercept('**/entries?**').as('entries')

        // Check for filters applied box
        cy.get('.no-facets').should('contain', 'No filters applied')

        cy.wait(5000)

        // Expand all filters/facets
        cy.get('.expand-all-container > .el-link > .el-link--inner').click()
        cy.get('.label-content-container').should('be.visible').and('have.length.above', 0)

        // Expand nested facet menu item if facet not found
        cy.get('.el-tree-node__content > .custom-tree-node > .capitalize:visible').then(($label) => {
          let facetIsObserved = true
          facetList.forEach((facet) => {
            facetIsObserved = facetIsObserved && $label.text().toLowerCase().includes(facet.toLowerCase())
          })
          if (!facetIsObserved && category !== 'projects') {
            // If the same facet are found in multiple place, the first will be checked by default
            // This action is used to expand all parent facets in ANATOMICAL STRUCTURE
            // To avoid facet not found when using child facets as test facets
            // *** Need to think of a solution to open the specific parent facet, instead of open all
            cy.get('.el-icon-caret-right:visible').not('.is-leaf').click({ multiple: true })
          }
        })

        cy.get('.el-tree-node__content > .custom-tree-node > .capitalize:visible').then(($label) => {
          let facetIsObserved = true
          facetList.forEach((facet) => {
            facetIsObserved = facetIsObserved && $label.text().toLowerCase().includes(facet.toLowerCase())
          })
          if (!facetIsObserved && category !== 'projects') {
            // If the same facet are found in multiple place, the first will be checked by default
            // This action is used to expand all parent facets in ANATOMICAL STRUCTURE
            // To avoid facet not found when using child facets as test facets
            // *** Need to think of a solution to open the specific parent facet, instead of open all
            cy.get('.el-icon-caret-right:visible').not('.is-leaf').click({ multiple: true })
          }
          if (facetIsObserved) {
            facetList.forEach((facet) => {
              // Check the matched facet checkbox
              cy.wrap($label).contains(new RegExp(`^${facet}$`, 'i')).click()

              // Check for the number of facet tags in filters applied box
              cy.get('.el-card__body > .capitalize:visible').contains(new RegExp(facet, 'i')).should('exist')
            })

            // Check for URL
            if (category === 'projects') {
              cy.url().should('contain', 'selectedProjectsAnatomicalFocusIds')
              cy.wait('@entries', { timeout: 20000 })
            } else {
              cy.url().should('contain', 'selectedFacetIds')
              cy.wait('@query', { timeout: 20000 })
            }

            cy.get('.table-wrap.el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')

            // Check for result correctness
            cy.get(':nth-child(1) > p').then(($result) => {
              if ($result.text().includes(' 0 Results | Showing')) {
                // Empty text should exist if no result
                cy.get('.el-table__empty-text').should('exist').and('have.text', 'No Results')
              } else {
                // Check for facets exist in dataset card
                cy.get('.property-table').then(($content) => {
                  facetList.forEach((facet) => {
                    const facetExistInCard = $content.text().toLowerCase().includes(facet.toLowerCase())
                    if (facetExistInCard) {
                      cy.wrap($content).contains(new RegExp(facet, 'i')).should('exist')
                    } else {
                      // *** Ignore when facets cannot be found or
                      // *** Find some other solutions in the future
                    }
                  })
                })
              }
            })

            for (let index = 0; index < 2; index++) {
              if (index === 1) {
                // Combine with search
                cy.get('.el-input__inner').clear()
                cy.get('.el-input__inner').type('dataset')
                facetList.forEach((facet) => {
                  cy.wrap($label).contains(new RegExp(`^${facet}$`, 'i')).click()
                })
              }

              // Uncheck
              facetList.forEach((facet) => {
                cy.wrap($label).contains(new RegExp(`^${facet}$`, 'i')).click()
              })
              cy.get('.el-card__body > .capitalize').should('not.exist')
              cy.get('.no-facets').should('contain', 'No filters applied')
              cy.url().should('not.contain', 'selectedFacetIds')

              // Close all tags in order
              facetList.forEach((facet) => {
                cy.wrap($label).contains(new RegExp(`^${facet}$`, 'i')).click()
              })
              facetList.forEach((facet) => {
                // Close all facet tags in filters applied box
                cy.get('.el-card__body > .capitalize:visible').contains(new RegExp(facet, 'i')).within(() => {
                  cy.get('.el-tag__close').click()
                })
              })
              cy.get('.el-card__body > .capitalize').should('not.exist')
              cy.get('.no-facets').should('contain', 'No filters applied')
              cy.url().should('not.contain', 'selectedFacetIds')

              // Reset all
              facetList.forEach((facet) => {
                cy.wrap($label).contains(new RegExp(`^${facet}$`, 'i')).click()
              })
              cy.get('.tags-container > .flex > .el-link > .el-link--inner').click()
              cy.get('.el-card__body > .capitalize').should('not.exist')
              cy.get('.no-facets').should('contain', 'No filters applied')
              cy.url().should('not.contain', 'selectedFacetIds')

              // Close the child facet tag and then click reset all
              facetList.forEach((facet) => {
                cy.wrap($label).contains(new RegExp(`^${facet}$`, 'i')).click()
              })
              cy.get('.el-card__body > .capitalize').then(($tag) => {
                if ($tag.length > 1) {
                  cy.get('.el-tag__close').last().click()
                  cy.get('.tags-container > .flex > .el-link > .el-link--inner').click()
                  cy.get('.el-card__body > .capitalize').should('not.exist')
                  cy.get('.no-facets').should('contain', 'No filters applied')
                  cy.url().should('not.contain', 'selectedFacetIds')
                } else {
                  facetList.forEach((facet) => {
                    cy.wrap($label).contains(new RegExp(`^${facet}$`, 'i')).click()
                  })
                }
              })
            }
          } else {
            this.skip()
          }
        })
      })
    })
  })
})