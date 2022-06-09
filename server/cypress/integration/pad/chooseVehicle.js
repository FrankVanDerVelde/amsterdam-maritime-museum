describe("chooseVehicle", () => {

    //Run before every test
    beforeEach(() => {
        //Where it will be tested
        cy.visit("http://localhost:8080/#choose-vehicle");
    });

    //Checking if no vehicle is selected user can't continue
    it('should stay on the same page when no vehicle is selected', () => {
        cy.get('.application-continue-container')
            .click();
        cy.url()
            .should('eq', "http://localhost:8080/#choose-vehicle");
    });

    //Checking if selected vehicle is saved in localstorage
    it('should save vehicle in localstorage', () => {
        cy.get('.bus')
            .click();
        cy.get('.application-continue-container')
            .click();
        cy.getLocalStorage('chosenVehicle')
            .should('contain', "bus")
    })

    //Testing selecting and unselecting
    it('should unselect the previous vehicle', () => {
        cy.get('.walk')
            .click();
        cy.get('.car')
            .click();
        cy.get('.walk')
            .should('not.have.class', "active");
    });

    //Checking if user can't continue without a license plate is inserted
    it('should stay on the same page when no license plate is detected', () => {
        cy.get('.car')
            .click();
        cy.get('.application-continue-container')
            .click();
        cy.url()
            .should('eq', "http://localhost:8080/#choose-vehicle");
    });

    //Valid license plate with saved fuel in local storage
    it('should save fuel type when a valid license plate is inserted and show a success pop-up', () => {
        cy.get('.car')
            .click();
        cy.get('.licensePlate')
            .type("K-001-HL");
        cy.get('#submitLicensePlate')
            .click();
        cy.get('#successContainer')
            .should('not.have.class', "hidden");
        cy.getLocalStorage('fuel')
            .should('contain', "benzine")
    });

    //Invalid license plate with user-feedback
    it('should show a failure pop-up when invalid license plate is inserted and cannot continue', () => {
        cy.get('.car')
            .click();
        cy.get('.licensePlate')
            .type("a-sda-231");
        cy.get('#submitLicensePlate')
            .click();
        cy.get('#errorContainer')
            .should('not.have.class', "hidden");
        cy.get('.application-continue-container')
            .click();
        cy.url()
            .should('eq', "http://localhost:8080/#choose-vehicle");
    });
})