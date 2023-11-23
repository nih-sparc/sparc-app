describe('Homepage', { testIsolation: false }, function () {
  before(function () {
    cy.visit('')
  })

  it('Navigation Bar', function () {
    // Check for navigation bar
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').contains(/Data & Models/i).should('exist')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(2) > a').contains(/Tools & Resources/i).should('exist')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(3) > a').contains(/Maps/i).should('exist')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(4) > a').contains(/News & Events/i).should('exist')
    cy.get(':nth-child(1) > :nth-child(5) > a').contains(/About/i).should('exist')
    cy.get(':nth-child(1) > :nth-child(6) > a').contains(/Submit to SPARC/i).should('exist')
  })
  it('Banner', function () {
    // Check for banner
    cy.get('h1').contains(/SPARC/).should('exist')
    cy.get('.btn-link > .el-button > span').contains(/Submit to SPARC/i).should('exist')
  })
  it('Body - Find Data by Category', function () {
    // Check for content title
    cy.get('.featured-data > h2').contains(/Find Data by Category/i).should('exist')

    // Check for the number of categories
    cy.get('.data-wrap > a:visible').should('have.length', 6)

    // Show more categories
    cy.get('.featured-data > .el-button').should('have.text', '\n    View more\n  ')
    cy.get('.featured-data > .el-button > span').click()

    // Check for the number of categories after showing more
    cy.get('.data-wrap > a:visible').should('have.length.above', 6)

    // Show less categories
    cy.get('.featured-data > .el-button > span').should('have.text', '\n    View less\n  ')
    cy.get('.featured-data > .el-button > span').click()

    // Check for the number of categories after showing less
    cy.get('.data-wrap > a:visible').should('have.length', 6)
  })
  it('Body - What Can I Do With SPARC?', function () {
    // Check for the number of features
    cy.get('.feature-container').should('have.length', 4)

    // Check for feature card
    cy.get(':nth-child(1) > .feature-container').within(() => {
      cy.get('.icon').should('exist')
      cy.get('.heading2').should('exist')
      cy.get('.body1').should('exist')
      cy.get('.button-link > .el-button > span').should('exist')
    })
  })
  it('Body - Resources & Datasets', function () {
    // Check for content title
    cy.get(':nth-child(6) > .section-container > .heading2').contains(/Resources & Datasets/i).should('exist')

    // Check for card description
    cy.get('.row > :nth-child(1) > .mb-16').should('have.text', 'Here is a resource you might be interested in:')
    cy.get('.row > :nth-child(2) > .mb-16').should('have.text', 'Featured Datasets')

    // Check for card content
    cy.get(':nth-child(1) > .card-container > .el-row').within(() => {
      cy.get('.el-col-6 > .image-container').should('exist')
      cy.get('.el-col-18 > .dataset-name').should('exist')
      cy.get('.el-col-18 > .dataset-description').should('exist')
      cy.get('.el-col-18 > .button-link > .el-button').should('exist')
    })

    // Check for card 'view all' link
    cy.get(':nth-child(6) > .section-container > .row').contains(/View All/i).should('exist')
  })
  it('Body - News & Upcoming Events', function () {
    // Check for content title
    cy.get('.featured-datasets > .heading2').contains(/News & Upcoming Events/i).should('exist')

    // Check for card image
    cy.get('.sparc-card__image').should('exist')

    // Check for card title
    cy.get('h3 > a').should('exist')

    // Check for card subtitle
    cy.get('.markdown-text > p').should('exist')
    cy.get(':nth-child(2) > .el-button').contains(/Learn More/i).should('exist')

    // Check for card 'view all' link
    cy.get('.sparc-card__content-wrap__content > .view-all-link').should('exist')
  })
  it('Body - Stay Connected', function () {
    // Check for content title
    cy.get('.subheader').should('have.text', 'Stay Connected')

    // Check for content
    cy.get('.newsletter-wrap > .heading2').should('have.text', 'Sign up for the SPARC Newsletter')
    cy.get('.office-hours-column > .heading2').should('have.text', 'Open Office Hours')
  })
  it('Footer', function () {
    cy.get('.footer__links > :nth-child(1) > :nth-child(1) > h3').should('have.text', 'Learn More')
    cy.get(':nth-child(1) > :nth-child(2) > h3').should('have.text', 'Policies')
    cy.get(':nth-child(2) > :nth-child(1) > h3').should('have.text', 'Help Us Improve')
    cy.get(':nth-child(2) > :nth-child(2) > h3').should('have.text', 'Stay Up-to-Date')
    cy.get('.footer__info--logo > .nuxt-link-exact-active > .logo').should('have.attr', 'src', '/_nuxt/img/logo-sparc-wave-primary.291d1ca.svg')
    cy.get('.footer__info--blurb > p').contains(/The NIH Common/i).should('exist')
  })
})
