import {NetworkManager} from "../framework/utils/networkManager.js";

export class calculatorRepository{
    #route;
    #networkManager;
    #userDistanceToMuseum;

    constructor() {
        this.#route = "/calculator";
        this.#networkManager = new NetworkManager();
        this.#userDistanceToMuseum = localStorage.getItem('usersDistanceToMuseum') ? localStorage.getItem('usersDistanceToMuseum') : 22;
    }

    async getCarbonEmissionForCar(){
        return await this.#networkManager.doRequest(`${this.#route}/car?car=dieselCar&distance=` + this.#userDistanceToMuseum, "GET");
    }



    async getCarbonEmissionForTrain(){
        return await this.#networkManager.doRequest(`${this.#route}/train?train=train&distance=` + this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForBike(){
        return await this.#networkManager.doRequest(`${this.#route}/bike?bike=bike&distance=` + this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForBus(){
        return await this.#networkManager.doRequest(`${this.#route}/bus?bus=bus&distance=` + this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForWalking(){
        return await this.#networkManager.doRequest(`${this.#route}/walk?walk=walk&distance=` + this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForTram(){
        return await this.#networkManager.doRequest(`${this.#route}/tram?tram=tram&distance=` + this.#userDistanceToMuseum, "GET");
    }
    }
