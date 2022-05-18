/**
 * Controller for the calculator
 */
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {chooseVehicleRepository} from "../repositories/chooseVehicleRepository.js";

export class ChooseVehicleController extends Controller {
    #chooseVehicleView;
    #chosenVehicle;
    #chooseVehicleRepository = new chooseVehicleRepository();

    constructor() {
        super();
        this.#setupView().then(() => {
            this.#addContinueButtonEventListener();
        });
    }

    async #setupView() {
        this.#chooseVehicleView = await super.loadHtmlIntoContent("html_views/chooseVehicle.html");
        this.#addEventListenersToVehicleOptions();
        this.#showsContinueButton(false)
        this.#chooseVehicleView.querySelector("#licensePlateContainer").addEventListener('input', this.#capitalizeInput);
        await this.#vehicleFuel();
    }

    #addEventListenersToVehicleOptions() {
        const vehicleOptions = this.#chooseVehicleView.querySelectorAll('.btn_card');
        vehicleOptions.forEach(this.#addEventListenerToVehicleOption.bind(this));
    }

    #addEventListenerToVehicleOption(vehicleOption) {
        vehicleOption.addEventListener('click', this.#handleVehicleOptionClicked.bind(this, vehicleOption));
    }

    #handleVehicleOptionClicked(vehicleOption) {
        this.#removeActiveStateForCurrentlySelectionOption();
        this.#setActiveStateForVehicleOption(vehicleOption);
        this.#checkCurrentlySelectedItemIsCarOption();
        this.#savingChosenVehicle();
        this.#showsContinueButton(true)
    }

    #removeActiveStateForCurrentlySelectionOption() {
        const activeOption = this.#chooseVehicleView.querySelector('.btn_card.active');
        if (!activeOption) return;
        activeOption.classList.remove('active');
    }

    #setActiveStateForVehicleOption(vehicleOption) {
        vehicleOption.classList.add('active')
    }

    #checkCurrentlySelectedItemIsCarOption() {
        const car = this.#chooseVehicleView.querySelector('.car');
        if (car.classList.contains('active')) {
            this.#chooseVehicleView.querySelector('#licensePlateContainer').classList.remove("hidden");
        } else {
            this.#chooseVehicleView.querySelector('#licensePlateContainer').classList.add("hidden");
        }
    }

    #addContinueButtonEventListener() {
        let continueContainer = this.#chooseVehicleView.querySelector('.application-continue-container');
        continueContainer.onclick = this.#handleContinueButtonClicked.bind(this);
    }

    #savingChosenVehicle() {
        console.log(this);
        const activeOption = this.#chooseVehicleView.querySelector('.btn_card.active');
        console.log(activeOption.id);
        this.#chosenVehicle = activeOption.id;
    }

    #capitalizeInput(inputBox){
        inputBox.target.value = inputBox.target.value.toUpperCase();
    }

    #vehicleFuel(){
        this.#chooseVehicleView.querySelector("#submitLicensePlate").addEventListener('click', async () => {
            let licensePlate = this.#chooseVehicleView.querySelector('#inputLicensePlate');
            const data =await this.#chooseVehicleRepository.getVehicleFuel(licensePlate.value);
            window.localStorage.setItem('fuel', data[0].toLowerCase());
        });

    }

    #canContinue() {
        return (this.#chosenVehicle !== undefined)
    }

    #handleContinueButtonClicked() {
        if (this.#canContinue()) {
            window.localStorage.setItem('chosenVehicle', this.#chosenVehicle)
            App.loadController(App.CONTROLLER_CHOOSE_FUEL);
        }
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
