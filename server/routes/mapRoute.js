const MapBoxService = require("../Services/MapBox/MapBoxService");
const MapBoxProfile = require("../Services/MapBox/MapBoxProfile");

class MapRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #mapBoxService;
    #app;

    constructor(app) {
        this.#app = app;
        this.#mapBoxService = new MapBoxService();
        this.#getDistanceForCoordinates();
        this.#getDistanceForLocationName();
    }

    #getDistanceForCoordinates() {
        this.#app.get("/map/distance_for_coordinates/:coordinates", async (req, res) => {
            try {
                const distance = await this.#mapBoxService.getDistanceInMeters(req.params.coordinates, MapBoxProfile.driving.value);

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    distance_in_meters: distance,
                    distance_in_km: distance / 1000
                });
            } catch (e) {
                console.error(e);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    error: e,
                    input: req.params.coordinates
                });
            }
        });
    }

    #getDistanceForLocationName() {
        this.#app.get("/map/distance_for_city/:city", async (req, res) => {
            try {
                const coordinates = await this.#mapBoxService.getCoordinatesForLocation(req.params.city);
                const distance = await this.#mapBoxService.getDistanceInMeters(coordinates, MapBoxProfile.driving.value);

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    distance_in_meters: distance,
                    distance_in_km: distance / 1000
                });
            } catch (e) {
                console.error(e);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    error: e,
                    input: req.params.coordinates
                });
            }
        })
    }
}

module.exports = MapRoute