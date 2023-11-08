describe('Homepage', () => {
  beforeEach(function () {
    cy.visit('')
  });
  it('Banner', () => {
    cy.get('h1').should('contain', 'Welcome to the SPARC Portal')
  })
  it('Navigation Bar', () => {
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').should('contain', 'Data')
  })
})
