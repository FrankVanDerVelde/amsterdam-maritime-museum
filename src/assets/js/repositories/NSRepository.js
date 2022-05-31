import {NetworkManager} from "../framework/utils/networkManager.js";

export class NSRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/ns"
        this.#networkManager = new NetworkManager();
    }

    async getAllStations() {
        let result = await this.#networkManager.doRequest(`${this.#route}/allStations`, 'GET')
        return result.results;
    }

    async getTripPrice(fromStation, toStation) {
        const ctxReconResult = await this.#getCtxRecon(fromStation);
        return await this.#networkManager.doRequest(
            `${this.#route}/tripPrice`,
            "POST",
            { ctxRecon: ctxReconResult.firstCtxRecon }
        );
    }

    /** Privates **/
    async #getCtxRecon(fromStation, toStation) {
        return await this.#networkManager.doRequest(`${this.#route}/ctxRecon/${fromStation}`, 'GET')
    }
}