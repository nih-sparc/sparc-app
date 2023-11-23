describe('Homepage', { testIsolation: false }, function () {
  beforeEach(function () {
    cy.visit('')
  });
  it('Banner', function () {
    cy.get('h1').contains(/SPARC/).should('exist')
    cy.get('.btn-link > .el-button > span').contains(/Submit to SPARC/i).should('exist')
  })
  it('Navigation Bar', function () {
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').contains(/Data & Models/i).should('exist')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(2) > a').contains(/Tools & Resources/i).should('exist')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(3) > a').contains(/Maps/i).should('exist')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(4) > a').contains(/News & Events/i).should('exist')
    cy.get(':nth-child(1) > :nth-child(5) > a').contains(/About/i).should('exist')
    cy.get(':nth-child(1) > :nth-child(6) > a').contains(/Submit to SPARC/i).should('exist')
  })
})
