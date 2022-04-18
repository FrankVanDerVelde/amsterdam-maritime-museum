const MapBoxService = require("../Services/MapBox/MapBoxService.js");
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
        this.#getPlaces();
    }

    #getDistanceForCoordinates() {
        this.#app.get("/map/distance_for_coordinates/:coordinates", async (req, res) => {
            try {
                const distance = await this.#mapBoxService.getDistanceInMeters(req.params.coordinates, MapBoxProfile.driving.value);

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    distance_in_meters: distance,
                    distance_in_km: distance / 1000,
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    error: e,
                    input: req.params.coordinates
                });
            }
        });
    }

    #getDistanceForLocationName() {
        this.#app.get("/map/distance_for_city/:locationName", async (req, res) => {
            try {
                const result = await this.#mapBoxService.getFirstPlaceForLocation(req.params.locationName);
                const distance = await this.#mapBoxService.getDistanceInMeters(result.center, MapBoxProfile.driving.value);

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    distance_in_meters: distance,
                    distance_in_km: distance / 1000,
                    place_name: result.place_name,
                    allData: result.allData
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    error: e,
                    input: req.params.coordinates
                });
            }
        })
    }

    #getPlaces() {
        this.#app.get("/map/places/:locationName", async (req, res) => {
            try {
                const result = await this.#mapBoxService.getPlacesForLocation(req.params.locationName);
                let mappedResults = result.features.map((feature) => {
                    return {
                        id: feature.id,
                        place_name: feature.place_name,
                        place_type: feature.place_type
                    }
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    results: mappedResults
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    error: e,
                    input: req.params.locationName
                });
            }
        })
    }
}

module.exports = MapRoute