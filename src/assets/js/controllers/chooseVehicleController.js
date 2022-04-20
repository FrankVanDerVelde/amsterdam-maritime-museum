/**
 * Controller for the calculator
 */
import { App } from "../app.js";
import { Controller} from "./controller.js";

export class ChooseVehicleController extends Controller {
    #chooseVehicleView;

    constructor() {
        super();
        this.#setupView().then( () => {
            this.#addContinueButtonEventListener();
        });
    }

    async #setupView() {
        this.#chooseVehicleView = await super.loadHtmlIntoContent("html_views/chooseVehicle.html");

        const test = this.#chooseVehicleView;
        console.log(this.#chooseVehicleView);

        const buttonCards = test.querySelectorAll('.btn_card');

        buttonCards.forEach(card => {
            card.addEventListener('click', function (e) {
                const active = test.querySelector('.btn_card.active');

                console.log(active);

                if (active) {
                    active.classList.toggle('active');

                    // test.querySelector('.btn_card .active').classList.toggle('active');
                }

                card.classList.toggle('active');
            })
        })
    }

    #addContinueButtonEventListener() {
        let continueContainer = this.#chooseVehicleView.querySelector('.application-continue-container');
        continueContainer.onclick = this.#handleContinueButtonClicked;
    }

    #handleContinueButtonClicked() {
        App.loadController(App.CONTROLLER_TREE_BACKGROUND);
    }
}
