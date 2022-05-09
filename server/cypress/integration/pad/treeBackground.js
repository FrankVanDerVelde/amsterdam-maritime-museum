//Context: Login
describe("Login",  () => {
    const endpoint = "/#tree-background";

    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#tree-background");
    });

    it("Existing canvas", () => {
        
        cy.get(".tree-canvas-container").should("exist");
        cy.get("#canvas-box").should("exist");
        cy.get("canvas").should("exist");
    });
});