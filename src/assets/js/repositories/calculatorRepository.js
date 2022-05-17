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

    // async getCarbonEmissionForVehicle(){
    //     return await this.#networkManager.doRequest(`${this.#route}/` + this.#choosenVehicle + `?` +
    //         this.#choosenVehicle + `=` + this.#choosenVehicle + `&distance=` + this.#userDistanceToMuseum, "GET")
    // }

    async getCarbonEmissionForTrain(){
        return await this.#networkManager.doRequest(`${this.#route}/train?train=train&distance=` +
            this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForBike(){
        return await this.#networkManager.doRequest(`${this.#route}/bike?bike=bike&distance=` +
            this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForBus(){
        return await this.#networkManager.doRequest(`${this.#route}/bus?bus=bus&distance=` +
            this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForWalking(){
        return await this.#networkManager.doRequest(`${this.#route}/walk?walk=walk&distance=` +
            this.#userDistanceToMuseum, "GET");
    }

    async getCarbonEmissionForTram(){
        return await this.#networkManager.doRequest(`${this.#route}/tram?tram=tram&distance=` +
            this.#userDistanceToMuseum, "GET");
    }
    }
