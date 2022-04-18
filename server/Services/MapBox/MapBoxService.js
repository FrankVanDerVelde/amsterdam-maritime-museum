const axios = require("axios").default;

class MapBoxService {

    #baseURL = "https://api.mapbox.com"
    #token = "pk.eyJ1IjoibWFydGlqbnZkd2FsIiwiYSI6ImNsMG1uaThlbDA3Y24zY3BhMnBpZDhmNTQifQ.rIhK3UbqvbOp8iZtqXLVdw";
    #accesTokenAndLanguageQueryParameters = `access_token=${this.#token}&language=nl`
    #locationMuseum = "4.91511,52.37138";

    async getDistanceInMeters(coordinates, profile) {
        let response = await axios.get(this.#createURLForDistance(coordinates, profile));
        return response.data.routes[0].legs[0].distance;
    }

    #createURLForDistance(toCoordinates, profile) {
        let coordinates = `${toCoordinates};${this.#locationMuseum}`;
        const url = `${this.#baseURL}/directions/v5/${profile}/${coordinates}?${this.#accesTokenAndLanguageQueryParameters}`;
        console.log(url);
        return url;
    }

    async getFirstPlaceForLocation(location) {
        let url = `${this.#baseURL}/geocoding/v5/mapbox.places/${location}.json?proximity=ip&types=place%2Cpostcode%2Caddress&${this.#accesTokenAndLanguageQueryParameters}`;
        let response = await axios.get(url);

        return {
            center: response.data.features[0].center,
            place_name: response.data.features[0].place_name
        };
    }
}

module.exports = MapBoxService;
