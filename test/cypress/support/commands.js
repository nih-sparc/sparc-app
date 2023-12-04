/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  if (err.message.includes('Avoided redundant navigation to current location'))
    return false
  if (err.message.includes('Maximum iterations reached.'))
    return false
  if (err.message.includes('ResizeObserver loop limit exceeded'))
    return false
  // // For legacy dataset
  // if (err.message.includes('ObjectID does not exist'))
  //   return false
  return true
})

Cypress.Commands.add('findGalleryCard', (text) => {
  const clickNextPageButton = () => {
    cy.get('.el-card > .el-card__body').then(($card) => {
      if (!$card.text().includes(text)) {
        cy.get('.btn-next').then(($button) => {
          if ($button.is(":disabled")) {
            return
          } else {
            cy.wrap($button).click()
            clickNextPageButton()
          }
        })
      }
    })
  }
  clickNextPageButton()
})

Cypress.Commands.add('goBackToBrowser', (category) => {
  const goBack = () => {
    cy.url().then(($url) => {
      if (!$url.includes(`data?type=${category}`)) {
        cy.go('back')
        goBack()
      }
    })
  }
  goBack()
})