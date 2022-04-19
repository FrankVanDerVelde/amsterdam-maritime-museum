class dikkeRoutesOuleh {
    #app;

    constructor(app) {
        this.#app = app;

        this.#createOuleh();
    }

    #createOuleh() {
        this.#app.post("/ouleh", (req, res) => {
            res.send({"Baapie" : "Dik",
            "Omygah" : "Ouleh"})

        });
    }
}

module.exports = dikkeRoutesOuleh;