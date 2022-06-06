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
    #isChoseVehicleCar;

    constructor() {
        super();
        this.#setupView().then(() => {
            this.#addContinueButtonEventListener();
        });
    }

    async #setupView() {
        window.localStorage.removeItem('fuel');
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
            this.#chooseVehicleView.querySelector('#licensePlateContainer').classList.remove('hidden');
            this.#isChoseVehicleCar = true;
        } else {
            this.#chooseVehicleView.querySelector('#licensePlateContainer').classList.add('hidden');
            this.#isChoseVehicleCar = false;
        }
    }

    #addContinueButtonEventListener() {
        let continueContainer = this.#chooseVehicleView.querySelector('.application-continue-container');
        continueContainer.onclick = this.#handleContinueButtonClicked.bind(this);
    }

    #savingChosenVehicle() {
        const activeOption = this.#chooseVehicleView.querySelector('.btn_card.active');
        this.#chosenVehicle = activeOption.id;
    }

    #capitalizeInput(inputBox){
        inputBox.target.value = inputBox.target.value.toUpperCase();
    }

    #vehicleFuel(){
        this.#chooseVehicleView.querySelector("#submitLicensePlate").addEventListener('click', async () => {
            let licensePlate = this.#chooseVehicleView.querySelector('#inputLicensePlate');
            try{
                const data =await this.#chooseVehicleRepository.getVehicleFuel(licensePlate.value);

                window.localStorage.setItem('fuel', data[0].toLowerCase());
                this.#getElementByIdId('successContainer').classList.remove('hidden');
                this.#getElementByIdId('errorContainer').classList.add('hidden');
                this.#getElementByIdId('success-title-label').innerHTML = "Success";
                this.#getElementByIdId('success-description-label').innerHTML = "U mag door naar het volgende scherm";

            }catch (e){
                this.#getElementByIdId('errorContainer').classList.remove('hidden');
                this.#getElementByIdId('successContainer').classList.add('hidden');
                this.#getElementByIdId('error-title-label').innerHTML = "Er is een fout opgetreden";
                this.#getElementByIdId('error-description-label').innerHTML = "We konden geen auto vinden met de kenteken " + licensePlate.value;
                window.localStorage.removeItem('fuel');
            }
        });

    }

    #canContinue() {
        if (this.#getElementByIdId('successContainer').classList.contains('hidden') === false){
            return true;
        }else if (this.#isChoseVehicleCar === true) {
            return false;
        }

        return (this.#chosenVehicle !== undefined);
    }

    #handleContinueButtonClicked() {
        if (this.#canContinue()) {
            window.localStorage.setItem('chosenVehicle', this.#chosenVehicle)
            App.loadController(App.CONTROLLER_TREE_BACKGROUND);
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
