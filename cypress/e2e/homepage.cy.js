describe('Homepage', () => {
  it('Banner', () => {
    cy.visit('')
    cy.get('h1').should('contain', 'Welcome to the SPARC Portal')
  })
})
