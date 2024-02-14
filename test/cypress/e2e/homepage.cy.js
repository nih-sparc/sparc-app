describe('Homepage', { testIsolation: false }, function () {
  before(function () {
    cy.visit('')
  })

  it('Navigation Bar', function () {
    // Check for navigation bar
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').should('contain', 'Data & Models').and('have.attr', 'href', '/data?type=dataset')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(2) > a').should('contain', 'Tools & Resources').and('have.attr', 'href', '/resources')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(3) > a').should('contain', 'Maps').and('have.attr', 'href', '/maps')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(4) > a').should('contain', 'News & Events').and('have.attr', 'href', '/news-and-events')
    cy.get(':nth-child(1) > :nth-child(5) > a').should('contain', 'About').and('have.attr', 'href', '/about')
    cy.get(':nth-child(1) > :nth-child(6) > a').should('contain', 'Submit to SPARC').and('have.attr', 'href', '/share-data')
  })
  it('Page hero', function () {
    // Check for banner
    cy.get('h1').should('contain', 'SPARC')
    cy.get('[class="page-hero-img"]').should('exist')

    // Check for button function
    cy.get('.btn-link > .el-button').should('contain', 'Submit to SPARC')
    cy.get('.btn-link > .el-button').click()
    cy.url().should('contain', 'share-data')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(6) > a').should('have.class', 'active')
    cy.go('back')
  })
  it('Featured data', function () {
    // Check for content title
    cy.get('.featured-data > h2').should('have.text', 'Find Data by Category')

    cy.get('.data-wrap > a:visible').as('category')

    cy.get('@category').first().click()
    cy.url().should('contain', 'selectedFacetIds')
    cy.visit('')

    // Check for the number of categories
    cy.get('@category').should('have.length', 6)

    // Show more categories
    cy.get('.featured-data > .el-button').should('have.text', '\n    View more\n  ')
    cy.get('.featured-data > .el-button > span').click()

    // Check for the number of categories after showing more
    cy.get('@category').should('have.length.above', 6)

    // Show less categories
    cy.get('.featured-data > .el-button > span').should('have.text', '\n    View less\n  ')
    cy.get('.featured-data > .el-button > span').click()

    // Check for the number of categories after showing less
    cy.get('@category').should('have.length', 6)
  })
  it('Portal features', function () {
    // Check for the number of features
    cy.get('.feature-container').should('have.length', 4)

    // Check for feature card
    cy.get(':nth-child(1) > .feature-container').within(() => {
      cy.get('.icon').should('exist')
      cy.get('.heading2').should('exist')
      cy.get('.body1').should('exist')
      cy.get('.button-link > .el-button > span').should('exist')
    })

    // Check for button function
    cy.get(':nth-child(1) > .feature-container > .button-link > .el-button').click()
    cy.url().should('contain', 'data?type=dataset')
    cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').should('have.class', 'active')
    cy.go('back')
  })
  it('Projects and datasets', function () {
    // Check for content title
    cy.get(':nth-child(6) > .section-container > .heading2').should('contain', 'Resources & Datasets')

    // Check for card description
    cy.get('.row > :nth-child(1) > .mb-16').should('contain', 'you might be interested in:')
    cy.get('.row > :nth-child(2) > .mb-16').should('have.text', 'Featured Datasets')

    // Check for card content
    cy.get(':nth-child(1) > .card-container > .el-row').within(() => {
      cy.get('.el-col-6 > .image-container').should('exist')
      cy.get('.el-col-18 > .dataset-name').should('exist')
      cy.get('.el-col-18 > .dataset-description').should('exist')
      cy.get('.el-col-18 > .button-link > .el-button').should('exist')
    })

    // Check for card 'view all' link
    cy.get('.row > :nth-child(1) > .view-all-link').should('contain', 'View All')
    cy.get(':nth-child(2) > .view-all-link').should('contain', 'View All Datasets')

    // Check for button redirect to dataset
    cy.get(':nth-child(2) > .card-container > .el-row > .el-col-18 > .dataset-name').then(($link)=>{
      const title = $link.text().replace('\n', '').trim()
      cy.get(':nth-child(2) > .card-container > .el-row > .el-col-18 > .button-link > .el-button').click()
      cy.contains(title).should('exist')
    })
    cy.visit('')
  })
  it('Homepage news', function () {
    // Check for content title
    cy.get('.featured-datasets > .heading2').should('contain', 'News & Upcoming Events')

    // Check for card image
    cy.get('.sparc-card__image').should('exist')

    // Check for card title
    cy.get('h3 > a').should('exist')

    // Check for card subtitle
    cy.get('.markdown-text > p').should('exist')
    cy.get(':nth-child(2) > .el-button').should('contain', 'Learn More')

    // Check for card 'view all' link
    cy.get('.sparc-card__content-wrap__content > .view-all-link').should('exist')
  })
  it('Stay connected', function () {
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
    cy.get('.footer__info--logo > .nuxt-link-exact-active > .logo').should('have.attr', 'src').and('contain', 'logo-sparc-wave-primary')
    cy.get('.footer__info--blurb > p').should('contain', 'The NIH Common')
  })
})
