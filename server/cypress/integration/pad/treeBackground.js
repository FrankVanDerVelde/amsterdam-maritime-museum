//Context: Login
describe("Login",  () => {
    const endpoint = "/#tree-background";

    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#tree-background");
    });

    // Succesfull creation of canvas
    it("Existing canvas", () => {
        cy.get("canvas").should("exist");
    });
});