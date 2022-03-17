const axios = require("axios").default;

class MapBoxService {

    #baseURL = "https://api.mapbox.com"
    #token = "pk.eyJ1IjoibWFydGlqbnZkd2FsIiwiYSI6ImNsMG1uaThlbDA3Y24zY3BhMnBpZDhmNTQifQ.rIhK3UbqvbOp8iZtqXLVdw";
    #locationMuseum = "4.91511,52.37138";

    async getDistanceInMeters(coordinates, profile) {
        let response = await axios.get(this.#createURLForDistance(coordinates, profile));
        return response.data.routes[0].legs[0].distance;
    }

    #createURLForDistance(toCoordinates, profile) {
        let coordinates = `${toCoordinates};${this.#locationMuseum}`;
        const url = this.#createMapBoxURLFrom(`/directions/v5/${profile}/${coordinates}`);
        console.log(url);
        return url;
    }

    async getCoordinatesForLocation(location) {
        let url = `${this.#baseURL}/geocoding/v5/mapbox.places/${location}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${this.#token}`;
        let response = await axios.get(url);

        return await response.data.features[0].center;
    }

    #createMapBoxURLFrom(path) {
        return `${this.#baseURL}${path}?access_token=${this.#token}`;
    }
}

module.exports = MapBoxService;
