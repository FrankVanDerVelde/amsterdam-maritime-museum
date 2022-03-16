/**
 * Route for calculator
 * @author Frank van der Velde
 */

class CalculatorRoute {
    #app;
    
    constructor(app) {
        this.#app = app;

        this.#createCalculator();
    }

    #createCalculator() {
        this.#app.get("/calculator", (req, res) => {
            res.send("API endpoint calculator");
        })
    }
}

module.exports = CalculatorRoute;