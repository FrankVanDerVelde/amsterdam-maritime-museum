import {NetworkManager} from "../framework/utils/networkManager.js";

export class calculatorRepository{
    #route;
    #networkManager;
    #userDistanceToMuseum;
    #chosenVehicle;
    #typeFuelCar;

    constructor() {
        this.#route = "/calculator";
        this.#networkManager = new NetworkManager();
        this.#userDistanceToMuseum = localStorage.getItem('usersDistanceToMuseum') ? localStorage.getItem('usersDistanceToMuseum') : 22;
        this.#chosenVehicle = localStorage.getItem('chosenVehicle');
        this.#typeFuelCar = localStorage.getItem('fuel');
    }

    /** @function
 * @name getEmission 
 * 
 * Calculates the Co2 emissions based on the vehicle, distance and fuel when using car
 * 
 * @param {String} [d=sessionVehicle] - Takes a vehicle string defaults to vehicle in session
 * @param {number} [d=sessionDistance] - Takes a distance string defaults to distance in session
 * @param {String} [d=sessionFuel] -  Takes a fuel string defaults to fuel in session
 * */
    async getEmission(vehicle = this.#chosenVehicle, distance = this.#userDistanceToMuseum, fuel = this.#typeFuelCar) {
        if (vehicle === 'car') {
            return await this.#networkManager.doRequest(`${this.#route}/car?car=` + fuel + `&distance=` + distance, "GET");
        } else {
            return await this.#networkManager.doRequest(`${this.#route}/` + vehicle + `?` + vehicle + `=` + vehicle + `&distance=` + distance, "GET");
        }
    }
}
