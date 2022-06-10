describe("User Location UI Spec", () => {

    beforeEach(() => {
        cy.visit("http://localhost:3000")
    });

    it("Check initial UI state", (done) => {
        cy.get('#current-location-button')
            .should('exist');
        cy.get('#location-name-text-field')
            .should('exist');
        cy.get('#continue-container')
            .should('exist');
        cy.get('#continue-container')
            .should('have.css', 'opacity', '0.6');
        done();
    });

    it("Click continue should stay on page", () => {
        cy.get('.application-continue-container')
            .first()
            .click()
        cy.url()
            .should('include', 'user-location');
    });

    it("Get current location", () => {
        cy.get('#current-location-button')
            .click();
        cy.wait(1000);
        cy.get('#distance-result-label')
            .should('contain', "KM");
    });

    // This should fail because we ask MapBox to calculate the distance with a driving option, and the
    // provided location will be overseas, thus it will fail.
    it("Distance calculations will fail", () => {
        cy.get('#location-name-text-field')
            .type('One Infinite Loop, Cupertino');
        cy.get('.user-location-search-result-element')
            .first()
            .click();
        cy.wait(1500);
        cy.get('#error-title-label')
            .should('not.have.attr', 'hidden');
    });

    it("Search locations and continue", () => {
        cy.get('#location-name-text-field')
            .type('Alkmaar Noord');
        cy.get('.user-location-search-result-element')
            .first()
            .click();
        cy.wait(1500);
        cy.get('#distance-result-label')
            .should('contain', "KM");

        // Continue
        cy.get('.application-continue-container')
            .first()
            .click()
        cy.url()
            .should('include', 'vehicle');
    });
})