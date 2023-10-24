describe("Dataset 127", function () {
  beforeEach(function () {
    cy.visit("/datasets/127?type=dataset")
  });
  it("Landing page", function () {
    cy.get('.dataset-image').should('have.attr', 'src').and('include', 'https://assets.discover.pennsieve.io/')
    // Hover over author 
    cy.get(':nth-child(2) > .contributor-item').should('be.visible').trigger('mouseenter', { eventConstructor: 'MouseEvent' })

    //only one visible popover
    cy.get('.orcid-popover:visible').should('have.length', 1)

    /* Click on the DOI */
    //cy.get('.dataset-information-box > :nth-child(2) > a > u').click()
    //cy.url().should('include', '/datasets/127?type=dataset')

    //Check Get Dataset directs to files tab
    cy.get('.button-container > :nth-child(1) > span').click()
    cy.get('.nuxt-link-exact-active').should('have.text', ' Files ');
    cy.get('[style=""] > .heading2.mb-8').should('have.text', 'Download Dataset').and('be.visible')
    //Checkt Cite Dataset direccts to Cite tab
    cy.get('.button-container > .secondary > span').click()
    cy.get('.nuxt-link-exact-active').should('have.text', ' Cite ');
    cy.get('.citation-details > .heading2').should('have.text', '\n    Dataset Citation\n  ').and('be.visible')
  });
  it("Landing page author search", function () {
    cy.get(':nth-child(2) > .contributor-list > li > .el-tooltip > .tooltip-item > a > u').click();
    cy.url().should('include', '/data?type=dataset&search=')
  });
  it("Landing page doi version", function () {
    cy.get('.dataset-information-box > .active-link').click();
    cy.get('.el-col-push-1 > a > u').click();
    //the doi should resolve back to sparc.science
    cy.origin('https://sparc.science', () => {
      cy.url().should('include', '/datasets/127/version')
    })
  });
  it("Landing page project page", function () {
    cy.get('.mt-8 > a > u').click()
    cy.get('.subpage').click()
    cy.get('.heading2').should('be.visible')
    cy.url().should('include', '/projects/')
  });
  it("Abstract Tab", function () {
    //Extend test with Cypress Studio
  });
});