const categories = ["dataset"]
// const categories = ["dataset", "model", "simulation", "projects"]

const keywords = ["Spine", "neck"]

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
      cy.url({ decode: true }).should('include', searchInput)

      cy.intercept('POST', '**/query?**').as('keywordSearchResult')
      cy.wait('@keywordSearchResult');

      cy.get(':nth-child(1) > p').then($p => {
        const noResult = $p.text().includes('\n                  0 Results | Showing')
        if (noResult) {
          this.skip()
        } else {
          const regex = new RegExp(`${keywords.join('|')}`, 'i')
          cy.get('.table-wrap').within(() => {
            cy.get('b').contains(regex)
          })
        }
      })
      cy.get('.btn-clear-search > .svg-icon').click()
      cy.get('.el-input__inner').should('have.attr', 'placeholder', 'Enter search criteria');
    })

    /*
    There are situations that dataset cards do not show the (highlighted) keywords
    Just in case this happens for all the displayed dataset cards, extra tests may need to be added
    cy.get(':nth-child(1) > .el-table_1_column_2 > .cell').contains(regex);
     */
  })
})