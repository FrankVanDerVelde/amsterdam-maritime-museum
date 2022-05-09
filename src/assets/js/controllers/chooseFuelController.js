/**
 * Controller for the calculator
 */
import { App } from "../app.js";
import { Controller} from "./controller.js";

export class ChooseFuelController extends Controller {
    #chooseFuelView;

    constructor() {
        super();
        this.#setupView().then( () => {
            this.#addContinueButtonEventListener();
        });
    }

    async #setupView() {
        this.#chooseFuelView = await super.loadHtmlIntoContent("html_views/chooseFuel.html");

        const test = this.#chooseFuelView;
        console.log(this.#chooseFuelView);

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
        let continueContainer = this.#chooseFuelView.querySelector('.application-continue-container');
        continueContainer.onclick = this.#handleContinueButtonClicked;
    }

    #handleContinueButtonClicked() {
        App.loadController(App.CONTROLLER_TREE_BACKGROUND);
    }
}
