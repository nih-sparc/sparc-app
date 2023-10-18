describe('Homepage', () => {
  it('Banner', () => {
    cy.visit('')
    cy.get('h1').should('contain', 'Welcome to the SPARC Portal')
  })
  it('Navigation Bar', () => {
    cy.visit('')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').should('contain', 'Data')
  })
})
