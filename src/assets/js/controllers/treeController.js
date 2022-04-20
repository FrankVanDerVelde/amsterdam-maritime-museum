/**
 * This class contains information about how many trees there need to be to compensate for the amount of
 * CO2 emitted.
 * @author Ryan Koning
 */

import { UsersRepository } from "../repositories/usersRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";

export class treeController extends Controller{
    //Attributes
    //The amount of CO2 the user of the website uses to get to Het Scheepvaartmuseum.

    #co2User;

    //The average amount of CO2 a tree compensates per year in kilo.
    #co2TreesYear = 26.635;

    #constructor() {
        super();
    }

    /**
     * This function calculates the number of trees needed per year, month and day
     * to compensate the user's CO2 emissions.
     * @returns {Promise<void>}
     */
    async #treeCompensation(){
        
        const co2TreesYearTwoDecimal = Math.round((this.#co2User / this.#co2TreesYear) * 100) / 100;
        const co2TreesMonth = co2TreesYearTwoDecimal * 12;
        const co2TreesDay = co2TreesYearTwoDecimal * 365;

        document.querySelector("#amountOfTreesYear").innerHTML = co2TreesYearTwoDecimal;
        document.querySelector("#amountOfTreesMonth").innerHTML = co2TreesMonth;
        document.querySelector("#amountOfTreesDay").innerHTML = co2TreesDay;
    }

}