// const categories = ["dataset"]
const categories = ["dataset", "model", "simulation", "projects"]

const keywords = ["Spine", "neck"]

const singleFacet = "Human"

categories.forEach(category => {

  describe(`Find Data in ${category}`, { testIsolation: false }, function () {
    before(function () {
      cy.visit(`/data?type=${category}`);
    });

    const searchInput = keywords.join(',')
    it(`Keyword Search - ${searchInput}`, function () {
      cy.get('.el-input__inner').type(searchInput);
      cy.get('.btn-clear-search > .svg-icon').should('be.visible')
      cy.get('.search-text').click();
      cy.url({ decode: true }).should('contain', searchInput)

      cy.intercept('POST', '**/query?**').as('keywordSearchResult')
      cy.wait('@keywordSearchResult');

      cy.get(':nth-child(1) > p').then($p => {
        const noResult = $p.text().includes('\n                  0 Results | Showing')
        if (noResult) {
          cy.get('.el-table__empty-text').should('exist')
        } else {
          cy.get('.el-table__empty-text').should('not.exist')
          const regex = new RegExp(`${keywords.join('|')}`, 'i')
          cy.get('.table-wrap').within(() => {
            cy.get('b').contains(regex)
          })
        }
      })
      cy.get('.btn-clear-search > .svg-icon').click()
      cy.get('.el-input__inner').should('have.attr', 'placeholder', 'Enter search criteria');

      // // There are situations that dataset cards do not show the (highlighted) keywords
      // // Just in case this happens for all the displayed dataset cards, extra tests may need to be added
      // cy.get(':nth-child(1) > .el-table_1_column_2 > .cell').contains(regex);
    })
    it(`Faceted Browse Search - ${singleFacet}`, function () {
      // let facetCategory
      cy.get('.no-facets').should('contain', 'No filters applied');
      cy.get('.label-content-container').should('not.be.visible');
      cy.get('.expand-all-container > .el-link > .el-link--inner').click();
      cy.get('.label-content-container').should('be.visible');
      cy.get('.label-content-container').then(($label) => {
        const facetExistInFilter = $label.find('span.capitalize').text().toLocaleLowerCase().includes(singleFacet.toLocaleLowerCase());
        if (facetExistInFilter) {
          // cy.wrap($label).contains(singleFacet).parents('.sparc-design-system-component-dropdown-multiselect').within(() => {
          //   cy.get('.label-title').then($el => {
          //     facetCategory = $el.text()
          //   })
          // })
          const regex = new RegExp(singleFacet, 'i')
          cy.wrap($label).contains(regex).click()
          cy.url({ decode: true }).should('contain', 'selectedFacetIds')
          cy.get('.el-tag__close').click();
          cy.get('.no-facets').should('contain', 'No filters applied');
          cy.wrap($label).contains(regex).click()
          cy.url({ decode: true }).should('contain', 'selectedFacetIds')
          cy.get('.tags-container > .flex > .el-link > .el-link--inner').click();
          cy.get('.no-facets').should('contain', 'No filters applied');
          cy.wrap($label).contains(regex).click()
          cy.url({ decode: true }).should('contain', 'selectedFacetIds')
          cy.get('.el-card__body').should('have.length', 1)
          cy.get('.el-card__body > .capitalize').contains(regex);
        } else {
          this.skip()
        }
      })
      cy.get(':nth-child(1) > p').then($p => {
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
              // cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > :nth-child(1) > a').click();
              // cy.wait(5000)
              // cy.get('.dataset-description-info').contains(singleFacet);
            }
          })
        }
      })
    });
  })
})