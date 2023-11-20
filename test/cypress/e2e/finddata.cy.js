describe('Find Data page', () => {
  it('Go to dataset', () => {
    cy.visit('')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').click()
    cy.url().should('include', '/data?type=dataset')
    cy.get(':nth-child(1) > .el-table_1_column_2 > .cell > :nth-child(1) > a').click()
    cy.url().should('include', '/datasets/')
  })
})
