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
     * Async function to get a piece of room example data by its id via networkmanager
     * in the back-end we define :roomId as parameter at the end of the endpoint
     *
     * GET requests don't send data via the body like a POST request but via the url
     * @returns {Promise<LocationDistance>}
     * @param location
     */
    async getDistanceForLocation(location) {
        return await this.#networkManager.doRequest(
            `/map/distance_for_city/${location}`,
            "GET");
    }

    async getDistanceForCoords(coords) {
        return this.#networkManager.doRequest(
            `/map/distance_for_city/${coords.longitude},${coords.latitude}`,
            "GET"
        );
    }
}