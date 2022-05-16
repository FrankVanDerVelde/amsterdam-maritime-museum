/**
 * Controller for the calculator
 */
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class ChooseVehicleController extends Controller {
    #chooseVehicleView;
    #chosenVehicle;
    #vehicle

    constructor() {
        super();
        this.#setupView().then(() => {
            this.#addContinueButtonEventListener();
        });
    }

    async #setupView() {
        this.#chooseVehicleView = await super.loadHtmlIntoContent("html_views/chooseVehicle.html");

        const test = this.#chooseVehicleView;
        this.#savingChosenVehicle();
        this.#showsContinueButton(false);
        console.log(this.#vehicle);

        const buttonCards = test.querySelectorAll('.btn_card');

        this.#chooseVehicleView.querySelector(".btn_card").addEventListener('click', this.#savingChosenVehicle());

        buttonCards.forEach(card => {
            card.addEventListener('click', function (e) {
                const active = test.querySelector('.btn_card.active');

                if (active) {
                    active.classList.toggle('active');
                }

                card.classList.toggle('active');

                const car = test.querySelector('.car');
                if (car.classList.contains('active')) {
                    test.querySelector('#licensePlate').hidden = false;
                } else {
                    test.querySelector('#licensePlate').hidden = true;
                }
            })
        })
    }

    #addContinueButtonEventListener() {
        let continueContainer = this.#chooseVehicleView.querySelector('.application-continue-container');
        continueContainer.onclick = this.#handleContinueButtonClicked;
    }

    #savingChosenVehicle() {
        this.#chosenVehicle = this.#chooseVehicleView.querySelector(this.#getElementByIdId())
        switch (this.#chosenVehicle) {
            case "walk" :
                this.#vehicle = "walk"
                break;
            case "bike" :
                this.#vehicle = "bike"
                break;
            case "car" :
                this.#vehicle = "car"
                break;
            case "bus" :
                this.#vehicle = "bus"
                break;
            case "train" :
                this.#vehicle = "train"
                break;
            case "tram" :
                this.#vehicle = "tram"
        }
        console.log(this.#vehicle)
        return this.#vehicle;
    }

    #canContinue() {
        return (this.#vehicle !== undefined)
    }

    #handleContinueButtonClicked() {
        App.loadController(App.CONTROLLER_CHOOSE_FUEL);
        // if (this.#canContinue()){
        //     window.localStorage.setItem('chosenVehicle', this.#vehicle)
        //     App.loadController(App.CONTROLLER_CHOOSE_FUEL);
        // }
    }

    #showsContinueButton(canContinue) {
        this.#getContinueContainer().style.opacity = canContinue ? "1" : "0.6";
    }

    #getContinueContainer() {
        return this.#getElementByIdId('continue-container');
    }

    #getElementByIdId(id) {
        return this.#chooseVehicleView.querySelector(`#${id}`);
    }
}
