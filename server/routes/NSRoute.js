const NSAPI = require("ns-api");

class NSRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #ns;
    #app;

    constructor(app) {
        this.#app = app;
        this.#ns = new NSAPI({ key: '624ddc76b8b743a18746509dda9e06f0' })
        this.#getAllStation();
        this.#getTripCtxRecon()
        this.#getTripPrice();
    }

    #getAllStation() {
        this.#app.get("/ns/allStations", async (req, res) => {
            try {
                let result = await Promise.all([this.#ns.getAllStations()])

                let thinnedResults = result[0]
                    .filter((station) => { return station.land === "NL" })
                    .map((station) => {
                        return {
                            code: station.code,
                            stationType: station.stationType,
                            name: station.namen.middel,
                        }
                    }).sort((stationA, stationB) => {
                        const nameA = stationA.name.toUpperCase();
                        const nameB = stationB.name.toUpperCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0; // names must be equal
                    });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    results: thinnedResults
                });
            } catch(e) {
                console.error(e);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    error: e
                });
            }
        });
    }


    #getTripCtxRecon() {
        this.#app.get("/ns/ctxRecon/:fromStation", async (req, res) => {
            try {
                let result = await this.#ns.getTrips({
                    dateTime: new Date(),
                    fromStation: req.params.fromStation,
                    toStation: 'ASD',
                });

                console.log(result);
                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    firstCtxRecon: result[0].ctxRecon,
                    resultsCount: result.length,
                    results: result
                });
            } catch(e) {
                console.error(e);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    error: String(e)
                });
            }
        });
    }

    #getTripPrice() {
        this.#app.post("/ns/tripPrice", async (req, res) => {
            try {
                const stationCode = req.params.stationCode
                const AMSCentralStationCode = 8400058
                const now = new Date().toISOString();
                const recon = `/arnu|fromStation=${stationCode}|toStation=${AMSCentralStationCode}|plannedFromTime=${now}|yearCard=false|excludeHighSpeedTrains=false|searchForAccessibleTrip=false`
                console.log(req.body.ctxRecon);
                let result = await this.#ns.getTrip({
                    ctxRecon: req.body.ctxRecon,
                    travelRequestType: "DEFAULT",
                    discount: "NO_DISCOUNT",
                    travelClass: "2"
                })

                let fares = result.fares
                    .filter((fare) => {
                        return (
                            (fare.travelClass === "SECOND_CLASS")
                                &&
                            (fare.product === "OVCHIPKAART_ENKELE_REIS")
                                &&
                            (fare.discountType === "NO_DISCOUNT")
                        );
                    })
                    .map((fare) => {
                        return { priceInEuro: Number(fare.priceInCents) / 100.0 };
                    })[0];

                res.status(this.#errorCodes.HTTP_OK_CODE).json({results: fares});
            } catch(e) {
                console.error(e);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    error: String(e),
                    inputCtxRecon: req.body,
                });
            }
        });
    }
}

module.exports = NSRoute;