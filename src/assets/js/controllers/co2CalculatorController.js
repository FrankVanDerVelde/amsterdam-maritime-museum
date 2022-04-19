/**
 * This class contains the information about the CO2 emission calculation
 * @author Ryan Koning
 */

import {Controller} from "./controller";

export class Co2CalculatorController extends Controller{
    //Attributes
    #distance;
    #co2Emission;

    #constructor() {
        super();
    }

    /**
     * This function returns the co2 emission of the people who travel by car
     */
    #co2CalculatorCar() {
        //This is the amount of co2 emission for Diesel per kilometer in gram
        const co2EmissionDiesel = 132;

        //This is the amount of co2 emission for Benzine per kilometer in gram
        const co2EmissionBenzine = 120;

        //This is the amount of co2 emission for LPG per kilometer in gram
        const co2EmissionLPG = 83;

        //This is the amount of co2 emission for CNG per kilometer in gram for high and low pressure
        const co2EmissionCNGLow = 113;
        const co2EmissionCNGHigh = 112;

        //This are the amounts of co2 emission per kind of car in gram
        const co2EmissionCarDiesel = this.#distance * co2EmissionDiesel;
        const co2EmissionCarBenzine = this.#distance * co2EmissionBenzine;
        const co2EmissionCarLPG = this.#distance * co2EmissionLPG;
        const co2EmissionCarCNGLow = this.#distance * co2EmissionCNGLow;
        const co2EmissionCarCNGHigh = this.#distance * co2EmissionCNGHigh;
        const electricCarEmission = 0;

        if (car == benzineCar) {
            this.#co2Emission = co2EmissionCarBenzine;
        } else if (car == dieselCar) {
            this.#co2Emission = co2EmissionCarDiesel;
        } else if (car == lpgCar) {
            this.#co2Emission = co2EmissionCarLPG;
        } else if (car == cngLowCar) {
            this.#co2Emission = co2EmissionCarCNGLow;
        } else if (car == cngHighCar) {
            this.#co2Emission = co2EmissionCarCNGHigh;
        } else if (car == electricCar) {
            this.#co2Emission = electricCarEmission;
        }

        //If the people travel by car we are gonna ask them with how many people they travel per car
        //If they travel with many people per car instead of with many cars we gonna put a "Thank you message on screen
        //-------

    }

    /**
     * This function returns the co2 emission of the people who travel by train
     */
    #co2CalculatorTrain(){
        //The trains in the Netherlands drive on wind energy, so they don't have emission .
        this.#co2Emission = 0;

    }

    /**
     * This function returns the co2 emission of a bike
     */
    #co2CalculatorBike(){
        //If you go with a bike you don't have any co2 emission.
        this.#co2Emission = 0;

        //Under this comment comes the code that prints a "Thank you for using the bike" message on the website.
        //--------
    }

    /**
     * This function returns the co2 emission of the people who travel by bus
     */
    #co2CalculatorBus(){

        //The average CO2 emission of a traveller from public transport is 116 gram per kilometer
        const averageCo2Emission = 116

        //We take the average amount of emission of public transport because there are many people that travel in
        //the same bus etc, so its better for the environment
        this.#co2Emission = this.#distance * averageCo2Emission;

    }

    #co2CalculatorTram(){
        //According to sources on the internet trams and metro's have zero emission
        this.#co2Emission = 0;
    }
}