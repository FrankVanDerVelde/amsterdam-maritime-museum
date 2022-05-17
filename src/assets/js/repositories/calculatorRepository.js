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
        this.#typeFuelCar = localStorage.getItem('typeFuelCar');
    }

    async getCarbonEmissionForCar() {
        return await this.#networkManager.doRequest(`${this.#route}/car?car=` +
            this.#typeFuelCar + `&distance=` + this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForVehicle(){
        return await this.#networkManager.doRequest(`${this.#route}/` + this.#chosenVehicle + `?` +
            this.#chosenVehicle + `=` + this.#chosenVehicle + `&distance=` + this.#userDistanceToMuseum, "GET")
    }
}
