//Context: Login
describe("Login",  () => {
    const endpoint = "/#tree-background";

    before(() => {
        cy.setSession();
        cy.saveLocalStorage();
    });

    beforeEach(() => {
        //Go to the specified URL
        cy.restoreLocalStorage();
        cy.visit("http://localhost:8080/#tree-background");
    });

    it('should exist fuel, vehicle and distance in localStorage', () => {
        cy.getLocalStorage("fuel").should("exist");
        cy.getLocalStorage("chosenVehicle").should("exist");
        cy.getLocalStorage("usersDistanceToMuseum").should("exist");
    });

    // Succesfull creation of canvas
    it("Existing canvas", () => {
        cy.get("canvas").should("exist");
    });

    // NS Dialog
    it("Check has loaded stations", () => {
        cy.wait(1000); // it's still busy loading the canvas, give it some time.
        cy.get('#train-vehicle')
            .click();
        cy.get('#stations')
            .select('Alkmaar')
            .should('have.value', 'AMR');
    });

    it("Check price calculation", () => {
        cy.wait(1000); // it's still busy loading the canvas, give it some time.

        cy.get('#train-vehicle')
            .click();
        cy.get('#stations')
            .select('Alkmaar')
        cy.get('#ns-number-of-persons')
            .clear()
            .type('2');
        cy.get('#ns-done-button')
            .click();

        cy.wait(4000); // NS API Can actually be quite slow sometimes.

        cy.get('.ns-price-result-label')
            .first()
            .should('contain.text', '€');
    });
});