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
    it("Should exist canvas", () => {
        cy.get("canvas").should("exist");
    });

    it('Change vehicle to train', () => {
      cy.wait(1500);
      cy.get('#train-vehicle').click();
      cy.get('#ns-done-button').click()
    });
});