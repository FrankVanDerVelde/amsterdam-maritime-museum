import {NetworkManager} from "../framework/utils/networkManager.js";

export class chooseVehicleRepository{
    #route
    #networkManager

    constructor() {
        this.#route = "/choose-vehicle"
        this.#networkManager = new NetworkManager();
    }

    async getVehicleFuel(licensePlate){
        return await  this.#networkManager.doRequest(`${this.#route}/getVehicleFuel:licensePlate=${licensePlate}`,
            "GET")
    }
}