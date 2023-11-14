// const categories = ["dataset"]
const categories = ["dataset", "model", "simulation", "projects"]

const keywords = ["Spine", "neck"]

const singleFacet = "Human"

const multipleFacets = ["Human", "Organ"]

categories.forEach((category) => {

  describe(`Find Data in ${category}`, { testIsolation: false }, function () {
    before(function () {
      cy.visit(`/data?type=${category}`)
    })

    it('All Page Features', function () {
      cy.get('.label1 > .el-dropdown > .filter-dropdown').then(($dropdown) => {
        cy.wrap($dropdown).click()
        cy.contains('Z-A').click()
        cy.wrap($dropdown).should('contain', 'Z-A')
      })
      cy.get('[role="tooltip"]').should('not.be.visible')
      cy.get('.purple-fill').click()
      cy.get('[role="tooltip"]').should('be.visible')
      cy.get('[role="tooltip"]').should('contain', 'How do filters work?')
      cy.get(':nth-child(1) > p > .el-dropdown > .filter-dropdown').click()
      cy.get('.el-dropdown-menu > .el-dropdown-menu__item:visible').contains('20').click()
      cy.get('.el-table__row').should('have.length', 20)
    })
    keywords.forEach((keyword) => {
      it(`Keyword Search - ${keyword}`, function () {
        cy.get('.el-input__inner').should('have.attr', 'placeholder', 'Enter search criteria')
        cy.get('.el-input__inner').clear()
        cy.get('.el-input__inner').type(keyword)
        cy.get('.btn-clear-search > .svg-icon').should('be.visible')
        cy.get('.search-text').click()
        cy.url({ decode: true }).should('contain', keyword)

        if (category === "projects") {
          cy.wait(500)
        } else {
          cy.intercept('POST', '**/query?**').as('keywordSearchResult')
          cy.wait('@keywordSearchResult')
        }

        cy.get(':nth-child(1) > p').then(($p) => {
          const noResult = $p.text().includes('\n                  0 Results | Showing')
          if (noResult) {
            cy.get('.el-table__empty-text').should('exist')
          } else {
            cy.get('.el-table__empty-text').should('not.exist')
            cy.get('.table-wrap').then(($content) => {
              const keywordExist = $content.text().toLowerCase().includes(keyword.toLowerCase())
              if (keywordExist) {
                const regex = new RegExp(keyword, 'i')
                cy.get('b').contains(regex)
              } else {
                cy.get('b').should('not.exist')
              }
            })
          }
        })
        cy.get('.btn-clear-search > .svg-icon').click()
        // // There are situations that dataset cards do not show the (highlighted) keywords
        // // Just in case this happens for all the displayed dataset cards, extra tests may need to be added
        // cy.get(':nth-child(1) > .el-table_1_column_2 > .cell').contains(regex)
      })
    })
    it(`Single Faceted Browse Search - ${singleFacet}`, function () {
      // let facetCategory
      cy.get('.no-facets').should('contain', 'No filters applied')
      cy.get('.label-content-container').should('not.be.visible')
      cy.get('.expand-all-container > .el-link > .el-link--inner').click()
      cy.get('.label-content-container').should('be.visible')
      cy.get('.label-content-container').then(($label) => {
        const singleFacetExist = $label.find('span.capitalize:visible').text().toLowerCase().includes(singleFacet.toLowerCase())
        if (singleFacetExist) {
          // cy.wrap($label).contains(singleFacet).parents('.sparc-design-system-component-dropdown-multiselect').within(() => {
          //   cy.get('.label-title').then(($el) => {
          //     facetCategory = $el.text()
          //   })
          // })
          const regex = new RegExp(singleFacet, 'i')
          cy.wrap($label).contains(regex).click()
          cy.get('.el-tag__close').eq(0).click()
          cy.get('.no-facets').should('contain', 'No filters applied')
          cy.wrap($label).contains(regex).click()
          cy.get('.tags-container > .flex > .el-link > .el-link--inner').click()
          // // "No filters applied" will not appear after click "reset all" in Cypress. BUG?
          // cy.get('.no-facets').should('contain', 'No filters applied')
          cy.wrap($label).contains(regex).click()
          cy.url({ decode: true }).should('contain', 'selectedFacetIds')
          cy.get('.el-card__body > .capitalize').contains(regex)
          cy.get(':nth-child(1) > p').then(($p) => {
            const noResult = $p.text().includes('\n                  0 Results | Showing')
            if (noResult) {
              cy.get('.el-table__empty-text').should('exist')
            } else {
              cy.get('.el-table__empty-text').should('not.exist')
              cy.get('.table-wrap').then(($content) => {
                const facetFoundInCard = $content.text().includes(singleFacet)
                if (facetFoundInCard) {
                  cy.wrap($content).should('contain', singleFacet)
                } else {
                  this.skip()
                  // cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > :nth-child(1) > a').click()
                  // cy.wait(5000)
                  // cy.get('.dataset-description-info').contains(singleFacet)
                }
              })
            }
          })
        } else {
          this.skip()
        }
      })
      cy.get('.tags-container > .flex > .el-link > .el-link--inner').click()
    })
    it(`Multiple Faceted Browse Search - ${multipleFacets}`, function () {
      cy.get('.expand-all-container > .el-link > .el-link--inner').click()
      cy.get('.label-content-container').then(($label) => {
        let multipleFacetsExist = true
        multipleFacets.forEach((facet) => {
          multipleFacetsExist = multipleFacetsExist && $label.find('span.capitalize:visible').text().toLowerCase().includes(facet.toLowerCase())
        })
        if (multipleFacetsExist) {
          multipleFacets.forEach((facet) => {
            const singleRegex = new RegExp(`^${facet}$`, 'i')
            cy.wrap($label).contains(singleRegex).click()
          })
          const multipleRegex = new RegExp(multipleFacets.join('|'), 'i')
          cy.get('.el-card__body > .capitalize').contains(multipleRegex)
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
                  cy.wrap($content).contains(multipleRegex)
                } else {
                  this.skip()
                }
              })
            }
          })
        } else {
          this.skip()
        }
      })
      cy.get('.tags-container > .flex > .el-link > .el-link--inner').click()
    })
  })
})