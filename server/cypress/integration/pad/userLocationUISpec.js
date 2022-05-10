describe("User Location UI Spec", () => {

    beforeEach(() => {
        cy.visit("http://localhost:3000")
    });

    it("check initial UI state", _ => {
        cy.get('#current-location-button').should('exist');
        cy.get('#location-name-text-field').should('exist');
        cy.get('#continue-container').should('exist');
        cy.get('#continue-container').should('have.css', 'opacity', '0.6')
    })

    it("get current location", _ => {
        cy.get('#current-location-button').click();

        cy.intercept
    })
})