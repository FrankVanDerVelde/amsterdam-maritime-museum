import {NetworkManager} from "../framework/utils/networkManager.js";

export class DashboardRepository{
    #route
    #networkManager

    constructor() {
        this.#route = "/dashboard"
        this.#networkManager = new NetworkManager();
    }

    async getTotalVisitor(){
        return await  this.#networkManager.doRequest(`${this.#route}/getVisitorTotal`, "GET")
    }

    async getWeeklySubmissions(){
        return await  this.#networkManager.doRequest(`${this.#route}/getWeeklySubmissions`, "GET")
    }

    async getCO2AveragePerVisitor(){
        return await  this.#networkManager.doRequest(`${this.#route}/getCO2AveragePerVisitor`, "GET")
    }

    async getDistanceAveragePerVisitor(){
        return await  this.#networkManager.doRequest(`${this.#route}/getDistanceAveragePerVisitor`, "GET")
    }
}