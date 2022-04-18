/**
 * -- THIS IS AN EXAMPLE REPOSITORY WITH EXAMPLE DATA FROM DB --
 * Repository responsible for all room related data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with `networkManager`!
 *
 * @author Pim Meijer
 */
import {NetworkManager} from "../framework/utils/networkManager.js";


export class MapRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/map"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function to get the distance from the provided location to museum.
     * It returns the distance in meters and KM
     *
     * @returns {Promise<LocationDistance>}
     * @param location a string of the location query
     */
    async getDistanceForLocation(location) {
        return await this.#networkManager.doRequest(
            `/map/distance_for_city/${location}`,
            "GET");
    }

    /**
     * Async function to get the distance from the provided location to museum.
     * It returns the distance in meters and KM
     *
     * @returns {Promise<LocationDistance>}
     * @param coords the longitude and latitude
     */
    async getDistanceForCoords(coords) {
        return this.#networkManager.doRequest(
            `/map/distance_for_city/${coords.longitude},${coords.latitude}`,
            "GET"
        );
    }
}
