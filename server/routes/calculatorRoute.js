/**
 * Route for calculator
 * @author Ryan Koning
 */
const {HTTP_OK_CODE, BAD_REQUEST_CODE} = require("../framework/utils/httpErrorCodes");

class CalculatorRoute {
    #app;
    #co2TreesYear = 26.635;

    constructor(app) {
        this.#app = app;

        this.#getCO2forCar();
        this.#getCO2ForTrain();
        this.#getCO2forBike();
        this.#getCO2forBus();
        this.#getCO2forTram();
        this.#getCO2forWalking()
    }

    #getCO2forCar() {
        this.#app.get("/calculator/car", (req, res) => {
            //This is the amount of co2 emission for Diesel per kilometer in gram
            const co2EmissionDiesel = 132;

            //This is the amount of co2 emission for Benzine per kilometer in gram
            const co2EmissionBenzine = 120;

            //This is the amount of co2 emission for LPG per kilometer in gram
            const co2EmissionLPG = 83;

            //This is the amount of co2 emission for CNG per kilometer in gram for high and low pressure
            const co2EmissionCNGLow = 113;
            const co2EmissionCNGHigh = 112;

            let distance = req.query.distance;


            const electricCarEmission = 0;

            switch (req.query.car) {
                case "benzineCar":
                    res.status(HTTP_OK_CODE).json({"CO2": distance * co2EmissionBenzine, "trees": this.#treeCalculation(distance * co2EmissionBenzine)})
                    break;
                case "dieselCar":
                    res.status(HTTP_OK_CODE).json({"CO2": distance * co2EmissionDiesel, "trees": this.#treeCalculation(distance * co2EmissionDiesel)})
                    break;
                case "lpgCar":
                    res.status(HTTP_OK_CODE).json({"CO2": distance * co2EmissionLPG, "trees": this.#treeCalculation(distance * co2EmissionLPG)})
                    break;
                case "cngLowCar":
                    res.status(HTTP_OK_CODE).json({"CO2": distance * co2EmissionCNGLow, "trees": this.#treeCalculation(distance * co2EmissionCNGLow)})
                    break;
                case "cngHighCar":
                    res.status(HTTP_OK_CODE).json({"CO2": distance * co2EmissionCNGHigh, "trees": this.#treeCalculation(distance * co2EmissionCNGHigh)})
                    break;
                case "electricCar":
                    res.status(HTTP_OK_CODE).json({"CO2": distance * electricCarEmission, "trees": this.#treeCalculation(distance * electricCarEmission)})
                    break;
                default:
                    res.status(BAD_REQUEST_CODE).json({"Message:":"Invalid Query Param"})
            }
        })
    }

    #getCO2ForTrain(){
        this.#app.get("/calculator/train", (req, res) =>{
            if (req.query.train === "train"){
                res.status(HTTP_OK_CODE).json({"CO2" : 0, "trees": this.#treeCalculation(0)})
            } else {
                res.status(BAD_REQUEST_CODE).json({"Message:":"Invalid Query Param"})
            }
        })
    }

    #getCO2forBike(){
        this.#app.get("/calculator/bike", (req, res) =>{
            if (req.query.bike === "bike"){
                res.status(HTTP_OK_CODE).json({"CO2" : 0, "trees": this.#treeCalculation(0)})
            } else {
                res.status(BAD_REQUEST_CODE).json({"Message:":"Invalid Query Param"})
            }
        })
    }

    #getCO2forBus(){
        this.#app.get("/calculator/bus", (req, res) =>{
            //The average CO2 emission of a traveller from public transport is 116 gram per kilometer
            const averageCo2Emission = 116;

            let distance = req.query.distance;

            if (req.query.bus === "bus"){
                res.status(HTTP_OK_CODE).json({"CO2" : averageCo2Emission * distance, "trees": this.#treeCalculation(distance * averageCo2Emission)})
            } else {
                res.status(BAD_REQUEST_CODE).json({"Message:":"Invalid Query Param"})
            }
        })
    }

    #getCO2forTram(){
        this.#app.get("/calculator/tram", (req, res) =>{
            if (req.query.tram === "tram"){
                res.status(HTTP_OK_CODE).json({"CO2" : 0, "trees": this.#treeCalculation(0)})
            } else {
                res.status(BAD_REQUEST_CODE).json({"Message:":"Invalid Query Param"})
            }
        })
    }

    #getCO2forWalking(){
        this.#app.get("/calculator/walk", (req, res) =>{
            if (req.query.walk === "walk"){
                res.status(HTTP_OK_CODE).json({"CO2" : 0, "trees": this.#treeCalculation(0)})
            } else {
                res.status(BAD_REQUEST_CODE).json({"Message:":"Invalid Query Param"})
            }
        })
    }

    #treeCalculation(co2User){

        const co2UserInKilo = co2User / 1000;

        const co2TreesYearTwoDecimal = Math.round((co2UserInKilo / this.#co2TreesYear) * 100) / 100;
        const co2TreesMonth = co2TreesYearTwoDecimal * 12;
        const co2TreesDay = co2TreesYearTwoDecimal * 365;

        return{
            "year": co2TreesYearTwoDecimal,
            "month": co2TreesMonth,
            "day": co2TreesDay
        }

    }
}

module.exports = CalculatorRoute;